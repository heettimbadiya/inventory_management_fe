import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { hideScroll } from 'src/theme/css';

import { NavSectionMini } from 'src/components/nav-section';

import { NAV } from '../config-layout';
import { useNavData } from './config-navigation';
import NavToggleButton from '../common/nav-toggle-button';
import WhiteLogo from '../../components/logo/white-logo';

// ----------------------------------------------------------------------

export default function NavMini() {
  const { user } = useMockedUser();

  const navData = useNavData();

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_MINI },
      }}
    >
      <NavToggleButton
        sx={{
          top: 22,
          left: NAV.W_MINI - 12,
        }}
      />

      <Stack
        sx={{
          pb: 2,
          height: 1,
          position: 'fixed',
          width: NAV.W_MINI,
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          backgroundColor: (theme) => theme.palette.mode === 'light' ? '#000' : '',
          ...hideScroll.x,
        }}
      >
        <WhiteLogo sx={{ mx: 'auto', my: 2 }} />

        <NavSectionMini
          data={navData}
          slotProps={{
            currentRole: user?.role,
          }}
        />
      </Stack>
    </Box>
  );
}
