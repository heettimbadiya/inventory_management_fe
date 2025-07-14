import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify';

export default function ContactTableRow({ row, selected, onEditRow, onDeleteRow, index, onSelectRow }) {
  const { fullName, email, contact, organization, lastInteraction } = row;
  console.log(row,"0000");
  return (
    <TableRow hover selected={selected}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{fullName}</TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>{contact}</TableCell>
      <TableCell>{organization}</TableCell>
      <TableCell>{lastInteraction ? new Date(lastInteraction).toLocaleDateString() : ''}</TableCell>
      <TableCell align="right">
        <IconButton color="primary" onClick={onEditRow}>
          <Iconify icon="eva:edit-fill" />
        </IconButton>
        <IconButton color="error" onClick={onDeleteRow}>
          <Iconify icon="eva:trash-2-outline" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

ContactTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  index: PropTypes.number,
  onSelectRow: PropTypes.func,
};
