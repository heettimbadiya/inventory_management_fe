import { useState, useCallback } from 'react';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
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
  TablePaginationCustom,
} from 'src/components/table';
import InvoiceTableRow from '../invoice-table-row';
import InvoiceTableToolbar from '../invoice-table-toolbar';
import InvoiceTableFiltersResult from '../invoice-table-filters-result';
import { useGetInvoices, deleteInvoice } from 'src/api/invoice';

const TABLE_HEAD = [
  { id: 'invoiceNumber', label: 'Invoice Number' },
  { id: 'project', label: 'Project' },
  { id: 'contact', label: 'Contact' },
  { id: 'issueDate', label: 'Issue Date' },
  { id: 'dueDate', label: 'Due Date' },
  { id: 'totalAmount', label: 'Total Amount' },
  { id: 'status', label: 'Status' },
  { id: '' },
];

const defaultFilters = {
  name: '',
  status: 'All',
  startDate: null,
  endDate: null,
};

export default function InvoiceListView() {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const settings = useSettingsContext();
  const router = useRouter();
  const table = useTable({ defaultOrderBy: 'issueDate' });
  const confirm = useBoolean();
  const { invoices, invoiceLoading, mutate } = useGetInvoices();
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedId, setSelectedId] = useState(null);

  // Filtering logic
  const dataFiltered = applyFilter({
    inputData: invoices,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const denseHeight = table.dense ? 56 : 76;
  const canReset = filters.status !== 'All';
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = (name, value) => {
    table.onResetPage();
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.invoice.edit(id));
    },
    [router]
  );
  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.invoice.view(id));
    },
    [router]
  );

  const handleDeleteRow = useCallback(async (id) => {
    try {
      await deleteInvoice(id);
      enqueueSnackbar('Invoice deleted successfully', { variant: 'success' });
      mutate();
    } catch (error) {
      enqueueSnackbar('Failed to delete invoice', { variant: 'error' });
    }
  }, [enqueueSnackbar, mutate]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Invoices"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Invoice' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.invoice.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Invoice
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card>
        <InvoiceTableToolbar filters={filters} onFilters={handleFilters} />
        {canReset && (
          <InvoiceTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            onResetFilters={() => setFilters(defaultFilters)}
            results={dataFiltered.length}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
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
                    <InvoiceTableRow
                      key={row._id}
                      row={row}
                      index={index}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                      onEditRow={() => handleEditRow(row._id)}
                      onViewRow={() => handleViewRow(row._id)}
                      onDeleteRow={() => handleDeleteRow(row._id)}
                      mutate={mutate}
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
              if (selectedId) handleDeleteRow(selectedId);
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </Container>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  let filtered = inputData;
  if (filters.status && filters.status !== 'All') {
    filtered = filtered.filter((row) => row.status === filters.status);
  }
  if (filters.name) {
    filtered = filtered.filter((row) =>
      (row.invoiceNumber || '').toLowerCase().includes(filters.name.toLowerCase()) ||
      (row?.projectId?.name || '').toLowerCase().includes(filters.name.toLowerCase()) ||
      (row?.contactId?.fullName || '').toLowerCase().includes(filters.name.toLowerCase())
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
