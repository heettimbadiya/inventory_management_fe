import moment from 'moment';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Label from '../../components/label/index.js';
import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

export default function LeadsTableRow({
  row,
  selected,
  onEditRow,
  onDeleteRow,
  onConvertLoadToClient,
  index,
}) {
  const { name, email, phone, notes, stage, source,tags } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{index + 1}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{name}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{email}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{phone}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{source}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{stage}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{notes || '-'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {tags.length > 0 ? (
            <>
              {tags.slice(0, 3).map((tag, index) => (
                <Label
                  key={index}
                  variant="soft"
                  color="info"
                  sx={{ mx: 0.5 }}
                >
                  {tag}
                </Label>
              ))}
              {tags.length > 3 && (
                <Box component="span" sx={{ ml: 0.5, fontWeight: 'bold' }}>…</Box>
              )}
            </>
          ) : (
            '-'
          )}
        </TableCell>



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
        sx={{ width: 180 }}
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
        </MenuItem>{' '}
        { row.stage !== 'Client' &&
        <MenuItem
          onClick={() => {
            onConvertLoadToClient();
            popover.onClose();
          }}
        >
          <Iconify icon="mdi:account-convert" />
          Convert To Client
        </MenuItem>}
      </CustomPopover>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow();
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

LeadsTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  index: PropTypes.number,
};
