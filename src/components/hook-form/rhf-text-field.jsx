import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';

// ----------------------------------------------------------------------

export default function RHFTextField({ name, helperText, type, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type={type}
          value={type === 'number' && field.value === 0 ? '' : field.value}
          onChange={(event) => {
            if (type === 'number') {
              field.onChange(Number(event.target.value));
            } else {
              field.onChange(event.target.value);
            }
          }}
          error={!!error}
          helperText={error ? error?.message : helperText}
          size="small"
          {...other}
          sx={{'.css-roqmai-MuiInputBase-root-MuiOutlinedInput-root':{
            borderRadius:0.5,
            },
            ".css-aplpb4-MuiInputBase-input-MuiOutlinedInput-input":{
              backgroundColor:"#F6F7F8"
            },
            ".css-1a4ei83-MuiInputBase-root-MuiOutlinedInput-root":{
              backgroundColor:"#F6F7F8"
            }
          }}
        />
      )}
    />
  );
}

RHFTextField.propTypes = {
  helperText: PropTypes.object,
  name: PropTypes.string,
  type: PropTypes.string,
};
