import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from 'src/components/iconify';

export default function ContactTableToolbar({ filters, onFilters }) {
  const handleFilterName = (event) => {
    onFilters('name', event.target.value);
  };
  return (
    <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ p: 2.5 }}>
      <TextField
        fullWidth
        value={filters.name}
        onChange={handleFilterName}
        placeholder="Search by name, email, or organization..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}

ContactTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
}; 