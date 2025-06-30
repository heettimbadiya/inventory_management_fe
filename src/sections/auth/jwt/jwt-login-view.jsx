import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const { login } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await login?.(data.email, data.password);
      enqueueSnackbar("Login successfully!", { variant: 'success' });
      router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {
      enqueueSnackbar("Something went wrong!", { variant: 'error' });
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const renderBrandSection = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: { xs: '50vh', md: '100vh' },
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        p: { xs: 3, sm: 4, md: 6 },
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: -30, md: -50 },
          left: { xs: -30, md: -50 },
          width: { xs: 120, md: 200 },
          height: { xs: 120, md: 200 },
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: -60, md: -100 },
          right: { xs: -60, md: -100 },
          width: { xs: 180, md: 300 },
          height: { xs: 180, md: 300 },
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
        }}
      />

      <Box sx={{ textAlign: 'center', zIndex: 1, maxWidth: 400 }}>
        {/* Logo/Brand Icon */}
        <Box
          sx={{
            width: { xs: 60, md: 80 },
            height: { xs: 60, md: 80 },
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: { xs: 2, md: 3 },
            backdropFilter: 'blur(10px)',
          }}
        >
          <Iconify
            icon="material-symbols:dashboard"
            sx={{ fontSize: { xs: 30, md: 40 }, color: 'white' }}
          />
        </Box>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: { xs: 1, md: 2 },
            fontSize: { xs: '1.75rem', sm: '2.125rem', md: '3rem' },
          }}
        >
          CRM Dashboard
        </Typography>
        <Typography
          variant="h6"
          sx={{
            opacity: 0.9,
            mb: { xs: 3, md: 4 },
            maxWidth: { xs: 280, md: 350 },
            fontSize: { xs: '1rem', md: '1.25rem' },
            lineHeight: 1.4,
          }}
        >
          Manage your customer relationships with powerful insights and analytics
        </Typography>

        {/* Feature highlights */}
        <Stack
          spacing={{ xs: 1.5, md: 2 }}
          sx={{
            textAlign: 'left',
            maxWidth: { xs: 280, md: 350 },
            display: { xs: 'none', sm: 'flex' }
          }}
        >
          {[
            { icon: 'mdi:chart-line', text: 'Advanced Analytics' },
            { icon: 'mdi:account-group', text: 'Customer Management' },
            { icon: 'mdi:lightning-bolt', text: 'Real-time Updates' },
          ].map((feature, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Iconify
                icon={feature.icon}
                sx={{ fontSize: { xs: 20, md: 24 }, opacity: 0.8 }}
              />
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  fontSize: { xs: '0.875rem', md: '1rem' }
                }}
              >
                {feature.text}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );

  const renderLoginForm = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: { xs: '100vh', sm: '100vh' },
        p: { xs: 2, sm: 0 },
        // pt: { xs: '120px', sm: 4 }, // Add top padding on mobile for header
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: { xs: '100%', sm: 400, md: 440 },
          mx: 'auto',
          p: { xs: 3, sm: 4, md: 5 },
          borderRadius: { xs: 0, sm: 3 },
          width: '100%',
        }}
      >
        {/* Header */}
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              mb: 1,
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
            }}
          >
            Welcome Back
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
          >
            Sign in to access your CRM dashboard
          </Typography>
        </Box>

        {/* Form */}
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack spacing={{ xs: 2.5, md: 3 }}>
            <RHFTextField name="email" label="Email address" />

            <RHFTextField
              name="password"
              label="Password"
              type={password.value ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={password.onToggle} edge="end">
                      <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />


            {/* Remember me and Forgot password */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 0 },
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    size="small"
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                  >
                    Remember me
                  </Typography>
                }
                sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
              />
              <Link
                variant="body2"
                color="primary"
                underline="hover"
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: '0.8rem', md: '0.875rem' },
                  alignSelf: { xs: 'flex-end', sm: 'center' }
                }}
              >
                Forgot password?
              </Link>
            </Box>

            {/* Login Button */}
            <LoadingButton
              fullWidth
              color="inherit"
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Login
            </LoadingButton>
          </Stack>
        </FormProvider>

        {/* Divider */}
        <Divider sx={{ my: { xs: 2 } }}>
          <Typography
            variant="body2"
            color="text.disabled"
            sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
          >
            OR
          </Typography>
        </Divider>

        {/* Register Link */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
          >
            Don't have an account?{' '}
            <Link
              component={RouterLink}
              href={paths.auth.jwt.register}
              variant="subtitle2"
              color="primary"
              sx={{
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: { xs: '0.8rem', md: '0.875rem' },
                '&:hover': {
                  textDecoration: 'underline',
                }
              }}
            >
              Create account
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );

  return (
    <Container maxWidth={false} disableGutters>
      <Grid container sx={{ minHeight: '100vh' }}>
        {/* Brand/Hero Section - Hidden on mobile, visible on tablet+ */}
        <Grid
          item
          xs={false}
          sm={6}
          md={6}
          lg={7}
          xl={8}
          sx={{
            display: { xs: 'none', sm: 'block' },height:"100%"
          }}
        >
          {renderBrandSection}
        </Grid>

        {/* Login Form Section */}
        <Grid
          item
          xs={12}
          sm={6}
          md={6}
          lg={5}
          xl={4}
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {renderLoginForm}
        </Grid>
      </Grid>
    </Container>
  );
}
