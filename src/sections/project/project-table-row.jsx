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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';
import axiosInstance from 'src/utils/axios';
import { PROJECT_STAGES } from './project-new-edit-form.jsx';

export default function ProjectTableRow({ row, selected, onSelectRow, onEditRow, onDeleteRow, index,mutate }) {
  const { name, contact, type, startDate, timezone, endDate, leadSource } = row;
  const confirm = useBoolean();
  const popover = usePopover();
  const [openDraftEmail, setOpenDraftEmail] = useState(false);
  const [openMoveStage, setOpenMoveStage] = useState(false);
  const [stage, setStage] = useState(row.stage || PROJECT_STAGES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
            setOpenMoveStage(true);
            popover.onClose();
          }}
        >
          <Iconify icon="solar:forward-bold" />
          Move Stage
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
      <Dialog open={openMoveStage} onClose={() => setOpenMoveStage(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Move project down the pipeline</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="stage-select-label">Select pipeline stage:</InputLabel>
              <Select
                labelId="stage-select-label"
                value={stage}
                label="Select pipeline stage:"
                onChange={e => setStage(e.target.value)}
                disabled={loading}
              >
                {PROJECT_STAGES.map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {error && <Box sx={{ color: 'error.main', mt: 1 }}>{error}</Box>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMoveStage(false)} disabled={loading}>CANCEL</Button>
          <Button
            variant="contained"
            disabled={loading || stage === row.stage}
            onClick={async () => {
              setLoading(true);
              setError('');
              try {
                await axiosInstance.put(`/api/project/${row._id}`, { ...row, stage });
                setOpenMoveStage(false);
                mutate()
                // Optionally: trigger a refresh or callback here
              } catch (err) {
                setError('Failed to move stage.');
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? <CircularProgress size={20} /> : 'MOVE'}
          </Button>
        </DialogActions>
      </Dialog>
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
