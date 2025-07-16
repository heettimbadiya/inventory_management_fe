import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import { useGetProjectById } from 'src/api/project';
import { useParams, useRouter } from 'src/routes/hooks';
import { fDate, fTime } from 'src/utils/format-time';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Iconify from 'src/components/iconify';
import Paper from '@mui/material/Paper';
import { alpha } from '@mui/material/styles';

export function ProjectView({ id: propId }) {
  const settings = useSettingsContext();
  const params = useParams();
  const router = useRouter();
  const id = propId || params.id;
  const { project, projectLoading, projectError } = useGetProjectById(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Project Details"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Project', href: paths.dashboard.project.root },
          { name: project?.name || 'View Project' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Button variant="outlined" onClick={() => router.back()} sx={{ mb: 3 }}>
        Back
      </Button>
      <Card sx={{ p: { xs: 2, md: 4 }, mb: 4 }}>
        {projectLoading && (
          <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 200 }}>
            <CircularProgress />
          </Stack>
        )}
        {projectError && (
          <Typography color="error">Failed to load project details.</Typography>
        )}
        {project && !projectLoading && !projectError && (
          <Grid container spacing={4}>
            {/* Left: Project Main Info */}
            <Grid xs={12} md={8}>
              <Stack spacing={3}>
                {/* Project Header */}
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                    <Iconify icon="mdi:briefcase-outline" width={32} height={32} color="#fff" />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" sx={{ mb: 0.5 }}>{project.name}</Typography>
                    <Chip
                      label={project.stage}
                      color="info"
                      size="small"
                      sx={{ fontWeight: 600, fontSize: 14, textTransform: 'capitalize' }}
                    />
                  </Box>
                </Stack>
                <Divider />
                {/* Project Details */}
                <Grid container spacing={2}>
                  <Grid xs={12} sm={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="mdi:tag-outline" width={20} />
                      <Typography variant="subtitle2">Type:</Typography>
                      <Typography variant="body2">{project.type}</Typography>
                    </Stack>
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="mdi:earth" width={20} />
                      <Typography variant="subtitle2">Timezone:</Typography>
                      <Typography variant="body2">{project.timezone}</Typography>
                    </Stack>
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="mdi:calendar-start" width={20} />
                      <Typography variant="subtitle2">Start Date:</Typography>
                      <Typography variant="body2">{fDate(project.startDate)} {project.startTime ? fTime(project.startTime) : ''}</Typography>
                    </Stack>
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="mdi:calendar-end" width={20} />
                      <Typography variant="subtitle2">End Date:</Typography>
                      <Typography variant="body2">{project.endDate ? fDate(project.endDate) : '-'} {project.endTime ? fTime(project.endTime) : ''}</Typography>
                    </Stack>
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="mdi:source-branch" width={20} />
                      <Typography variant="subtitle2">Lead Source:</Typography>
                      <Typography variant="body2">{project.leadSource}</Typography>
                    </Stack>
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="mdi:clock-outline" width={20} />
                      <Typography variant="subtitle2">Created:</Typography>
                      <Typography variant="body2">{fDate(project.createdAt)}</Typography>
                    </Stack>
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="mdi:clock-edit-outline" width={20} />
                      <Typography variant="subtitle2">Updated:</Typography>
                      <Typography variant="body2">{fDate(project.updatedAt)}</Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </Grid>
            {/* Right: Contact Card */}
            <Grid xs={12} md={4}>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: (theme) => alpha(theme.palette.info.light, 0.08),
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Avatar sx={{ bgcolor: 'info.main', width: 48, height: 48, mb: 1 }}>
                  <Iconify icon="mdi:account" width={28} height={28} color="#fff" />
                </Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {project.contact?.fullName || 'No Contact'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.contact?.email || '-'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.contact?.contact || '-'}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Card>
    </Container>
  );
}

ProjectView.propTypes = {
  id: PropTypes.string,
}; 