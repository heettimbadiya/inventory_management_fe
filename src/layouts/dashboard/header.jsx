import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';

import { bgBlur } from 'src/theme/css';

import Logo from 'src/components/logo';
import SvgColor from 'src/components/svg-color';
import { useSettingsContext } from 'src/components/settings';

import Searchbar from '../common/searchbar';
import { NAV, HEADER } from '../config-layout';
import SettingsButton from '../common/settings-button';
import AccountPopover from '../common/account-popover';
import { Box } from '@mui/material';
import DraftEmailDialog from 'src/sections/project/draft-email-dialog';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function Header({ onOpenNav }) {
  const theme = useTheme();

  const settings = useSettingsContext();

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  const isNavMini = settings.themeLayout === 'mini';

  const lgUp = useResponsive('up', 'lg');

  const offset = useOffSetTop(HEADER.H_DESKTOP);

  const offsetTop = offset && !isNavHorizontal;

  // Add state for DraftEmailDialog
  const [openDraftEmail, setOpenDraftEmail] = useState(false);

  const renderContent = (
    <>
      {lgUp && isNavHorizontal && <Logo sx={{ mr: 2.5 }} />}

      {!lgUp && (
        <IconButton onClick={onOpenNav}>
          <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
        </IconButton>
      )}

      <Searchbar />

      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 1 }}
      >
         <Box sx={{cursor:"pointer"}} onClick={() => setOpenDraftEmail(true)}>
           <svg width="25" height="25" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path
               d="M3.86358 13.041C3.86358 13.041 12.1949 12.99 13.4886 12.8341C15.698 12.5668 16.7387 10.8419 16.7387 10.8419C16.7387 10.8419 18.5106 10.2245 18.8606 9.81083C19.2106 9.39712 19.6356 8.4424 19.6356 8.4424C19.6356 8.4424 20.2949 8.73518 19.4574 10.0113C18.6199 11.2875 16.0762 15.8192 16.0762 15.8192C16.0762 15.8192 14.6793 17.7286 13.5136 17.8305C12.123 17.9578 9.21987 18.0278 7.95736 17.9896C6.73235 17.9514 5.81672 18.0501 4.37608 16.1724C2.86357 14.1994 3.86358 13.041 3.86358 13.041Z"
               fill="#B952F6"></path>
             <path
               d="M11.98 7.07386C13.03 8.40728 14.905 10.4854 15.8706 12.0034C16.6613 13.2445 16.0956 15.7523 16.0956 15.7523C16.0488 15.9273 18.5082 12.0861 19.6832 9.76617C19.9519 9.23789 20.1519 8.14315 19.8457 7.53531C19.4519 6.75244 17.1613 3.69734 15.3831 3.19452C12.2519 2.30981 8.73309 4.88437 8.73309 4.88437C8.73309 4.88437 10.005 4.5725 11.98 7.07386Z"
               fill="#5E30E3"></path>
             <path
               d="M14.8319 3.06462C14.8319 3.06462 12.1819 3.08371 10.3475 3.99706C8.56315 4.88495 6.69438 6.8103 5.4225 9.22892C4.30062 11.3611 3.91311 13.3151 4.05374 14.4958C4.24437 16.0934 5.36937 17.2167 5.36937 17.2167C5.36937 17.2167 4.47562 16.6535 3.73811 15.5428C2.2881 13.3629 0.447464 9.76038 0.144336 8.91386C-0.558794 6.94078 1.44435 4.93587 3.18498 4.49988C4.22562 4.23892 8.06939 3.40832 10.8975 3.1219C13.2413 2.8864 14.8288 3.06462 14.8288 3.06462H14.8319Z"
               fill="#8097F3"></path>
           </svg>
         </Box>
        <SettingsButton />
        <AccountPopover />
      </Stack>
      <DraftEmailDialog open={openDraftEmail} onClose={() => setOpenDraftEmail(false)} project={null} forceEmptyPrompt />
    </>
  );

  return (
    <AppBar
      sx={{
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.W_VERTICAL + 1}px)`,
          height: HEADER.H_DESKTOP,
          ...(offsetTop && {
            height: HEADER.H_DESKTOP_OFFSET,
          }),
          ...(isNavHorizontal && {
            width: 1,
            bgcolor: 'background.default',
            height: HEADER.H_DESKTOP_OFFSET,
            borderBottom: `dashed 1px ${theme.palette.divider}`,
          }),
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI + 1}px)`,
          }),
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
};
