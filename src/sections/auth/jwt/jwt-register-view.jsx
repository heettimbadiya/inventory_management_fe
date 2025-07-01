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

export default function JwtRegisterView() {
  const { register } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();
  const confirmPassword = useBoolean();

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await register?.(data.email, data.password, data.firstName, data.lastName);
      enqueueSnackbar('Account created successfully!', { variant: 'success' });
      router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {
      enqueueSnackbar(error.message || 'Something went wrong!', { variant: 'error' });
      console.error(error);
      reset();
    }
  });

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center',justifyContent:"center" }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 5 },
          width: { xs:'100%',sm:"400px" },
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Create Account
        </Typography>

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack spacing={3} sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <RHFTextField name="firstName" label="First name" sx={{ flex: 1 }} />
              <RHFTextField name="lastName" label="Last name" sx={{ flex: 1 }} />
            </Box>

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

            <RHFTextField
              name="confirmPassword"
              label="Confirm password"
              type={confirmPassword.value ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={confirmPassword.onToggle} edge="end">
                      <Iconify icon={confirmPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <LoadingButton
              fullWidth
              color="inherit"
              type="submit"
              variant="contained"
              loading={isSubmitting}
              sx={{ mt: 2 }}
            >
              Create Account
            </LoadingButton>
          </Stack>
        </FormProvider>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          Already have an account?{' '}
          <Link component={RouterLink} href={paths.auth.jwt.login} underline="hover">
            Sign in
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}
