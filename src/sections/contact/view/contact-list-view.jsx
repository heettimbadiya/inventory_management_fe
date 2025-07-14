import { useState, useCallback, useEffect } from 'react';
import axiosInstance from '../../../utils/axios.js';
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
import ContactTableRow from '../contact-table-row';
import ContactTableToolbar from '../contact-table-toolbar';
import { useGetContact } from '../../../api/contact.js';

const TABLE_HEAD = [
  { id: 'srNo', label: '#' },
  { id: 'fullName', label: 'Full Name' },
  { id: 'email', label: 'Email' },
  { id: 'phoneNumber', label: 'Phone' },
  { id: 'organization', label: 'Organization' },
  { id: 'lastInteraction', label: 'Last Interaction' },
  { id: '' },
];

const defaultFilters = {
  name: '',
};

export default function ContactListView() {
  const { enqueueSnackbar } = useSnackbar();
  const {contact} = useGetContact()
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const [tableData, setTableData] = useState(contact);
  const [filters, setFilters] = useState(defaultFilters);
  console.log(contact)
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axiosInstance.get('/api/contact');
        console.log(response.data)
        setTableData(response.data.contacts || []);
      } catch (error) {
        enqueueSnackbar('Failed to fetch contacts', { variant: 'error' });
      }
    };
    fetchContacts();
  }, [enqueueSnackbar]);

  const handleDeleteRow = useCallback(async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/contact/${id}`);
      if (response?.data?.success) {
        enqueueSnackbar('Contact deleted successfully', { variant: 'success' });
        setTableData((prev) => prev.filter((row) => row._id !== id));
        confirm.onFalse();
      } else {
        enqueueSnackbar('Failed to delete contact', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Failed to delete contact', { variant: 'error' });
    }
  }, [enqueueSnackbar, confirm]);

  const handleEditRow = useCallback((id) => {
    router.push(paths.dashboard.contact.edit(id));
  }, [router]);

  const handleViewRow = useCallback((id) => {
    router.push(paths.dashboard.contact.edit(id));
  }, [router]);

  const dataFiltered = tableData.filter((row) =>
    row.fullName.toLowerCase().includes(filters.name.toLowerCase()) ||
    row.email.toLowerCase().includes(filters.name.toLowerCase()) ||
    row.organization.toLowerCase().includes(filters.name.toLowerCase())
  );

  const denseHeight = table.dense ? 56 : 76;
  const canReset = filters.name !== '';
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback((name, value) => {
    table.onResetPage();
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, [table]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Contacts"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Contact', href: paths.dashboard.contact.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.contact.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Contact
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>
          <ContactTableToolbar filters={filters} onFilters={handleFilters} />
          {canReset && (
            <Button onClick={handleResetFilters} sx={{ m: 2 }}>Reset Filters</Button>
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
                      <ContactTableRow
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
        content={<span>Are you sure you want to delete <strong>{table.selected.length}</strong> items?</span>}
        action={
          <Button variant="contained" color="error" onClick={confirm.onFalse}>
            Delete
          </Button>
        }
      />
    </>
  );
}
