import moment from 'moment';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Label from '../../components/label';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function ContactTableRow({
  row,
  selected,
  onEditRow,
  onDeleteRow,
  index,
}) {
  const { fullName, email, contact, organization, jobTitle, addProject, mailingEmail, additionalInfo, tags = [], status = '' } = row;

  const confirm = useBoolean();
  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{index + 1}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fullName}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{email}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{contact || "-"}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{organization || "-"}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{jobTitle || "-"}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{mailingEmail || "-"}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {Array.isArray(tags) && tags.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {tags.slice(0, 3).map((tag, idx) => (
                <Chip key={idx} label={tag} size="small" color="info" variant="soft" />
              ))}
              {tags.length > 3 && (
                <Box component="span" sx={{ ml: 0.5, fontWeight: 'bold' }}>…</Box>
              )}
            </Box>
          ) : (
            '-'
          )}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {status ? <Label variant="soft" color="primary">{status}</Label> : '-'}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{additionalInfo || "-"}</TableCell>
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
      </CustomPopover>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={() => {onDeleteRow(); confirm.onFalse();}}>
            Delete
          </Button>
        }
      />
    </>
  );
}

ContactTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  index: PropTypes.number,
};
