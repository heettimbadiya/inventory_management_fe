import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

import {
  Card,
  Table,
  Button,
  Tooltip,
  Container,
  TableBody,
  IconButton,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
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

import ServiceTableRow from '../service-table-row';
import ServiceTableToolbar from '../service-table-toolbar';
import ServiceTableFiltersResult from '../service-table-filter-result';
import axiosInstance from '../../../utils/axios.js';
import { useGetService } from '../../../api/service';

// ----------------------------------------------------------------------


const TABLE_HEAD = [
  { id: 'srNo', label: '#' },
  { id: 'name', label: 'Name' },
  { id: 'description', label: 'Description' },
  { id: 'cost', label: 'Cost'},
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  type: 'all',
};

// ----------------------------------------------------------------------

export default function ServiceListView() {
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const { service, mutate } = useGetService();
  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    if (service) {
      setTableData(service);
    }
  }, [service]);


  const handleDeleteRow = useCallback(async (id) => {
      try {

        const response = await axiosInstance.delete(
          `/api/service/${id}`
        );
        if (response?.data?.success == true) {
          enqueueSnackbar('Service deleted successfully', { variant: 'success' });

          confirm.onFalse();
          mutate();
        } else {
          enqueueSnackbar('Failed to delete items', { variant: 'error' });
        }
      } catch(error) {
        console.error('Failed to delete inquiry', error);
        enqueueSnackbar('Failed to delete service', { variant: 'error' });
      }
    },
    [enqueueSnackbar,mutate, table, tableData]
  );



  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });


  const denseHeight = table.dense ? 56 : 76;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.service.edit(id));
    },
    [router]
  );


  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.service.edit(id));
    },
    [router]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Service', href: paths.dashboard.service.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.service.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Service
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <ServiceTableToolbar filters={filters} onFilters={handleFilters} />

          {canReset && (
            <ServiceTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row._id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}

                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row, index) => (
                      <ServiceTableRow
                        key={row._id}
                        row={row}
                        index={index}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
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

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData?.filter(
      (user) =>
        user?.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        user?.description.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }


  return inputData;
}
