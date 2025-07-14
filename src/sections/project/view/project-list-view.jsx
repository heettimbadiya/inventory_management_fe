import Container from '@mui/material/Container';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import { PROJECT_STAGES } from '../project-new-edit-form.jsx';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import ProjectTableRow from '../project-table-row';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from 'src/components/iconify';
import { RouterLink } from '../../../routes/components';
import { useGetProject } from '../../../api/project';
import { useRouter } from '../../../routes/hooks';
import axiosInstance from '../../../utils/axios';
import { useSnackbar } from '../../../components/snackbar';
import { _id } from '../../../_mock';


const TABLE_HEAD = [
  { id: 'srNo', label: '#' },
  { id: 'name', label: 'Project Name' },
  { id: 'contact', label: 'Contact' },
  { id: 'type', label: 'Type' },
  { id: 'timezone', label: 'Timezone' },
  { id: 'startDate', label: 'Start Date' },
  { id: 'endDate', label: 'End Date' },
  { id: 'leadSource', label: 'Lead Source' },
  { id: '' },
];

const defaultFilters = {
  name: '',
  stage: 'all',
};

function ProjectTableToolbar({ filters, onFilters }) {
  return (
    <Stack spacing={2} alignItems={{ xs: 'flex-end', md: 'center' }} direction={{ xs: 'column', md: 'row' }} sx={{ p: 2.5, pr: { xs: 2.5, md: 2.5 } }}>
      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <TextField
          fullWidth
          value={filters.name}
          onChange={(e) => onFilters('name', e.target.value)}
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </Stack>
  );
}

export function ProjectListView() {
  const settings = useSettingsContext();
  const table = useTable();
  const {projects,mutate} = useGetProject()
  const [filters, setFilters] = useState(defaultFilters);
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar();
  // Filtering logic
  const dataFiltered = applyFilter({
    inputData: projects,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const denseHeight = table.dense ? 56 : 76;
  const canReset = filters.name !== '' || filters.stage !== 'all';
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = (name, value) => {
    table.onResetPage();
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.project.edit(id));
    },
    [router]
  );

  const handleDeleteRow = useCallback(async (id) => {
      try {

        const response = await axiosInstance.delete(
          `/api/project/${id}`
        );
        if (response?.data?.success == true) {
          enqueueSnackbar('Project deleted successfully', { variant: 'success' });

          confirm.onFalse();
          mutate();
        } else {
          enqueueSnackbar('Failed to delete items', { variant: 'error' });
        }
      } catch(error) {
        console.error('Failed to delete project', error);
        enqueueSnackbar('Failed to delete project', { variant: 'error' });
      }
    },
    [enqueueSnackbar,mutate, table]
  );
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Projects"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Project' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.project.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Project
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {/* Tabs for stage filtering (as before) */}
      <Paper sx={{ mb: 3, p: 1, overflowX: 'auto' }}>
        <Tabs
          value={filters.stage}
          onChange={(_, value) => handleFilters('stage', value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ minHeight: 48 }}
        >
          <Tab
            key="all"
            value="all"
            label={<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><span style={{ fontWeight: filters.stage === 'all' ? 700 : 400 }}>{projects.length}</span><span style={{ fontSize: 13 }}>All</span></Box>}
            sx={{ minWidth: 120, px: 2, py: 1, fontWeight: filters.stage === 'all' ? 700 : 400 }}
          />
          {PROJECT_STAGES.map((stage) => (
            <Tab
              key={stage}
              value={stage}
              label={<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><span style={{ fontWeight: filters.stage === stage ? 700 : 400 }}>{projects.filter((p) => p.stage === stage).length}</span><span style={{ fontSize: 13 }}>{stage}</span></Box>}
              sx={{ minWidth: 120, px: 2, py: 1, fontWeight: filters.stage === stage ? 700 : 400 }}
            />
          ))}
        </Tabs>
      </Paper>
      <Card>
        <ProjectTableToolbar filters={filters} onFilters={handleFilters} />
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={dataFiltered.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                dataFiltered.map((row) => row.id)
              )
            }
          />
          <Box sx={{ minWidth: 960 }}>
            <Table size={table.dense ? 'small' : 'medium'}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={null}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row, index) => (
                    <ProjectTableRow
                      key={row._id}
                      row={row}
                      index={index}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                      onEditRow={() => handleEditRow(row._id)}
                      onDeleteRow={() => handleDeleteRow(row._id)}
                    />
                  ))}
                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />
                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Box>
        </TableContainer>
        <TablePaginationCustom
          count={dataFiltered.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </Container>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  let filtered = inputData;
  if (filters.stage && filters.stage !== 'all') {
    filtered = filtered.filter((row) => row.stage === filters.stage);
  }
  if (filters.name) {
    filtered = filtered.filter((row) =>
      (row.name || '').toLowerCase().includes(filters.name.toLowerCase())
    );
  }
  // Sorting
  const stabilized = filtered.map((el, index) => [el, index]);
  stabilized.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilized.map((el) => el[0]);
}
