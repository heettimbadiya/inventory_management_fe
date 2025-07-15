import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { fDate } from '../../utils/format-time';
import Button from '@mui/material/Button';
import { useState } from 'react';
import DraftEmailDialog from './draft-email-dialog';
import ReactMarkdown from 'react-markdown';
import { Box } from '@mui/material';

export default function ProjectTableRow({ row, selected, onSelectRow, onEditRow, onDeleteRow, index }) {
  const { name, contact, type, startDate, timezone, endDate, leadSource } = row;
  const confirm = useBoolean();
  const popover = usePopover();
  const [openDraftEmail, setOpenDraftEmail] = useState(false);

  return (
    <>
      <TableRow hover selected={selected}>
        {/*<TableCell padding="checkbox">*/}
        {/*  <Checkbox checked={selected} onChange={onSelectRow} />*/}
        {/*</TableCell>*/}
        <TableCell>{index + 1}</TableCell>
        <TableCell>{name}</TableCell>
        <TableCell>{contact?.contact || '-'}</TableCell>
        <TableCell>{type || '-'}</TableCell>
        <TableCell>{timezone || '-'}</TableCell>
        <TableCell>{fDate(startDate) || '-'}</TableCell>
        <TableCell>{fDate(endDate) || '-'}</TableCell>
        <TableCell>{leadSource || '-'}</TableCell>
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top" sx={{ width: 140 }}>
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
        <MenuItem
          onClick={() => {
            setOpenDraftEmail(true);
            popover.onClose();
          }}
        >
          <Iconify icon="material-symbols:mail" />
          Draft Email
        </MenuItem>
      </CustomPopover>
      <DraftEmailDialog open={openDraftEmail} onClose={() => setOpenDraftEmail(false)} project={row} />
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={() => {onDeleteRow();
            confirm.onFalse()}}>
            Delete
          </Button>
        }
      />
    </>
  );
}

ProjectTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  index: PropTypes.number,
};
