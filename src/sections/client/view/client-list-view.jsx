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

import { useGetClient } from 'src/api/client';
import ClientTableRow from '../client-table-row';
import ClientTableToolbar from '../client-table-toolbar';
import ClientTableFiltersResult from '../client-table-filter-result';
import { HOST_API } from '../../../config-global';

// ----------------------------------------------------------------------


const TABLE_HEAD = [
  { id: 'srNo', label: 'Sr No', width: 120 },
  { id: 'clientName', label: 'Name' },
  { id: 'email', label: 'Email', width: 230 },
  { id: 'phoneNumber', label: 'Contact', width: 230 },
  { id: 'type', label: 'Type', width: 230 },
  { id: 'note', label: 'Note', width: 230 },
  { id: 'address', label: 'Address', width: 230 },
  { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  type: 'all',
};

// ----------------------------------------------------------------------

export default function ClientListView() {
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const { client, mutate } = useGetClient();
  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    if (client) {
      setTableData(client);
    }
  }, [client]);


  const handleDeleteRow = useCallback(async (id) => {
      try {

        const response = await axios.delete(
          `${HOST_API}/api/delete/${id}`
        );
        if (response.status === 200) {
          enqueueSnackbar('deleted successfully', { variant: 'success' });

          confirm.onFalse();
          mutate();
        } else {
          enqueueSnackbar('Failed to delete items', { variant: 'error' });
        }
      } catch(error) {
        console.error('Failed to delete inquiry', error);
        enqueueSnackbar('Failed to delete client', { variant: 'error' });
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
      router.push(paths.dashboard.client.edit(id));
    },
    [router]
  );


  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.client.edit(id));
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
            { name: 'Client', href: paths.dashboard.client.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.client.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Client
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <ClientTableToolbar filters={filters} onFilters={handleFilters} />

          {canReset && (
            <ClientTableFiltersResult
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
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row._id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row, index) => (
                      <ClientTableRow
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
    inputData = inputData.filter(
      (user) =>
        user.clientName.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        user.desc.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        user.type.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        user.email.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }


  return inputData;
}
