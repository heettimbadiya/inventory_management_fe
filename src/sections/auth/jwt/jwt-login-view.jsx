import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  Box,
  Paper,
  Stack,
  Link,
  Typography,
  Container,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Divider,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { useSnackbar } from 'notistack';

import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { useAuthContext } from 'src/auth/hooks';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { PATH_AFTER_LOGIN } from 'src/config-global';

export default function JwtLoginView() {
  const { login } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

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
      enqueueSnackbar('Login successfully!', { variant: 'success' });
      router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {
      enqueueSnackbar('Something went wrong!', { variant: 'error' });
      console.error(error);
      reset();
    }
  });

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center',justifyContent:'center' }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 5 },
          width: { xs:'100%',sm:"400px" },
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Sign in to access your CRM dashboard
        </Typography>

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack spacing={3}>
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

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    size="small"
                  />
                }
                label="Remember me"
              />

              <Link variant="body2" color="primary" underline="hover">
                Forgot password?
              </Link>
            </Box>

            <LoadingButton
              fullWidth
              color="inherit"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Login
            </LoadingButton>
          </Stack>
        </FormProvider>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          Don’t have an account?{' '}
          <Link component={RouterLink} href={paths.auth.jwt.register} underline="hover">
            Create account
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}
