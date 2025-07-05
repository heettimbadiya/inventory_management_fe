
import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';
import logos from '../../../public/logo/white-logo.svg'
// ----------------------------------------------------------------------

const WhiteLogo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const theme = useTheme();


  // OR using local (public folder)
  // -------------------------------------------------------
  const logo = (
    <Box
      component="img"
      src={logos}
      sx={{ width: 200,height:100,objectFit:'cover', cursor: 'pointer', ...sx }}
    />
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

WhiteLogo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default WhiteLogo;
