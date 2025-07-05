/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

// ----------------------------------------------------------------------

import Router from 'src/routes/sections';

import ThemeProvider from 'src/theme';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import ProgressBar from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, SettingsProvider } from 'src/components/settings';
import SnackbarProvider from 'src/components/snackbar/snackbar-provider';
import { AuthProvider } from 'src/auth/context/jwt';
import { LocalizationProvider } from './locales/index.js';

// ----------------------------------------------------------------------

export default function App() {
  const charAt = `

  ░░░    ░░░
  ▒▒▒▒  ▒▒▒▒
  ▒▒ ▒▒▒▒ ▒▒
  ▓▓  ▓▓  ▓▓
  ██      ██

  `;

  console.info(`%c${charAt}`, 'color: #5BE49B');

  useScrollToTop();

  return (
    <AuthProvider>
      <LocalizationProvider>
      <SettingsProvider
        defaultSettings={{
          themeMode: 'light', // 'light' | 'dark'
          themeDirection: 'ltr', //  'rtl' | 'ltr'
          themeContrast: 'bold', // 'default' | 'bold'
          themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
          themeColorPresets: 'black', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
          themeStretch: true,
        }}
      >
        <ThemeProvider>
          <MotionLazy>
            <SnackbarProvider>
            <SettingsDrawer />
            <ProgressBar />
            <Router />
            </SnackbarProvider>
          </MotionLazy>
        </ThemeProvider>
      </SettingsProvider>
      </LocalizationProvider>
    </AuthProvider>
  );
}
