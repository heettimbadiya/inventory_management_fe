import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function ContactTableFilterResult({ filters, onResetFilters, results }) {
  const hasFilter = filters.name && filters.name !== '';
  if (!hasFilter) return null;
  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 2 }}>
      <span>{results} results found</span>
      <Button onClick={onResetFilters}>Reset Filters</Button>
    </Stack>
  );
}

ContactTableFilterResult.propTypes = {
  filters: PropTypes.object,
  onResetFilters: PropTypes.func,
  results: PropTypes.number,
}; 