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
  Button,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { useAuthContext } from 'src/auth/hooks';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import { useRouter, useSearchParams } from 'src/routes/hooks';
import { useSnackbar } from 'notistack';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { PATH_AFTER_LOGIN } from 'src/config-global';

import Image from 'src/components/image';
import logo from '../../../../public/logo/logo.svg'; // Update to actual logo path

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
    <Box sx={{backgroundColor: "#F7F7F7"}}>
    <Container
      maxWidth="xs"
      sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ fontSize: 28 }}>
            <Image alt={'logo'} src={logo} sx={{ width: '250px', height: '120px' }} />
          </Typography>
        </Box>
      <Paper elevation={0} sx={{ p: 4,  width: '100%' }}>
          <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', fontWeight: 700 ,fontSize: '24px'}}>
            Welcome back
          </Typography>

          <FormProvider methods={methods} onSubmit={onSubmit}>
            <Stack spacing={2}>
              <RHFTextField name="email" placeholder="Email" />

              <RHFTextField
                name="password"
                placeholder="Password"
                type={password.value ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={password.onToggle} edge="end">
                        <Iconify
                          icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <LoadingButton
                fullWidth
                type="submit"
                variant="contained"
                loading={isSubmitting}
                sx={{
                  mt: 1,
                  py: 1.5,
                  fontWeight: 600,
                  bgcolor: 'black',
                  '&:hover': { bgcolor: '#333' },
                }}
              >
                LOG IN
              </LoadingButton>

              <Link variant="body2" underline="hover" sx={{ textAlign: 'center', mt: 1 }}>
                Forgot your password?
              </Link>

              <Divider sx={{ my: 2 }}>OR</Divider>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<Iconify icon="logos:google-icon" />}
                sx={{ py: 1.2, fontWeight: 500 }}
              >
                Sign in with Google
              </Button>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<Iconify icon="logos:apple" />}
                sx={{ py: 1.2, fontWeight: 500 }}
              >
                Log in with Apple
              </Button>
            </Stack>
          </FormProvider>

          <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
            Don’t have a business account?{' '}
            <Link component={RouterLink} href={paths.auth.jwt.register} underline="hover">
              Create one
            </Link>
          </Typography>
      </Paper>
        <Typography
          variant="caption"
          sx={{ mt: 2, display: 'block', textAlign: 'center', color: 'text.secondary' }}
        >
          By logging in, you agree to the{' '}
          <Link href="#" underline="hover">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" underline="hover">
            Privacy Policy
          </Link>
          .
        </Typography>
      </Box>
    </Container>
    </Box>
  );
}
