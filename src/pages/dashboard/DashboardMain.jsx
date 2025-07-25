import React from 'react';
import { Grid, Box, Typography, CircularProgress, Alert, Paper, Stack, Button, Avatar, Chip } from '@mui/material';
import StatCard from './components/StatCard';
import LeadsCard from './components/LeadsCard';
import CreateCard from './components/CreateCard';
import CalendarCard from './components/CalendarCard';
import ActivityCard from './components/ActivityCard';
import PaymentsCard from './components/PaymentsCard';
import PaymentsOverviewCard from './components/PaymentsOverviewCard';
import NotesCard from './components/NotesCard';
import TasksCard from './components/TasksCard';
import { Icon } from '@iconify/react';
import { useGetDashboard } from 'src/api/dashboard';
import { useRouter } from '../../routes/hooks';
import { paths } from '../../routes/paths';
import { useAuthContext } from '../../auth/hooks';
import Container from '@mui/material/Container';

const DashboardMain = () => {
  const {
    dashboard = {},
    dashboardLoading,
    dashboardError,
  } = useGetDashboard();
const router = useRouter()
  const data = dashboard || { leads: [], scheduledProjects: [], notes: [] };
  const now = new Date();
  const hours = now.getHours();
  const { user } = useAuthContext()
  const getGreeting = () => {
    if (hours < 12) return 'Good morning';
    if (hours < 17) return 'Good afternoon';
    return 'Good evening';
  };
  // Stats with simple styling
  const stats = [
    { label: 'New leads', value: data.leads?.length || 0, icon: 'mdi:account-plus' },
    { label: 'Contacts', value: data?.totalContactsCount || 0, icon: 'mdi:email-outline' },
    { label: 'Projects', value: data?.totalProjectsCount || 0, icon: 'mdi:check-circle-outline' },
    { label: '2025 bookings', value: `$${data.totalEarnings || 0}`, icon: 'mdi:calendar-check-outline' },
  ];

  // Leads for LeadsCard - show recent leads
  const recentLeads = (data.leads || [])
    .slice(0, 3) // Show only 3 most recent
    .map(lead => ({
      name: lead.fullName,
      email: lead.email,
      time: lead.lastInteraction
        ? new Date(lead.lastInteraction).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })
        : 'No recent activity',
      location: lead.organization || lead.website || 'No organization',
      status: lead.status,
      tags: lead.tags || []
    }));

  // Activities for ActivityCard - show upcoming projects
  const upcomingProjects = (data.scheduledProjects || [])
    .filter(project => new Date(project.startDate) >= new Date())
    .slice(0, 3)
    .map(project => ({
      name: project.name,
      type: project.type,
      stage: project.stage,
      time: project.startTime ? new Date(project.startTime).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }) : 'No time set',
      contact: project.contact?.fullName || 'No contact'
    }));

  // Notes for NotesCard - show recent notes
  const recentNotes = (data.notes || [])
    .slice(0, 3)
    .map(note => ({
      name: note.fullName,
      message: note.additionalInfo,
      time: new Date(note.updatedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    }));

  if (dashboardLoading) return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh'
    }}>
      <CircularProgress size={60} />
    </Box>
  );

  if (dashboardError) return (
    <Box sx={{ p: 4 }}>
      <Alert severity="error">
        {dashboardError.message || 'Failed to load dashboard data'}
      </Alert>
    </Box>
  );

  return (
    <Container maxWidth={'lg'}>
    <Box sx={{
      minHeight: '100vh',
      p: 0
    }}>
      {/* Header */}

        <Box sx={{ mb: 4, }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            {new Date().toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </Typography>
          <Typography variant="h4" sx={{
            fontWeight: 700,
            color: '#212121',
            mb: 1
          }}>
            {getGreeting()}, {user?.lastName || user?.firstName}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            Temperature's rising, business is thriving.
          </Typography>
        </Box>


      {/* Top Stats */}
      <Grid container spacing={3} sx={{ mb: 2, mt: 4,p:3 }}>
        {stats.map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i} style={{background: "white", padding: '15px 24px'}}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3} style={{marginBottom: "24px"}}>
        {/* Left Column */}
        <Grid item xs={12} lg={4} >
          {/*<Stack spacing={3}>*/}
            <CreateCard
              onNewContact={() => router.push(paths.dashboard.contact.new)}
              onNewProject={() => router.push(paths.dashboard.project.new)}
              onNewInvoice={() => router.push(paths.dashboard.invoice.new)}
            />
            {/*<ActivityCard*/}
            {/*  activities={upcomingProjects}*/}
            {/*  onGoToProjects={() => {}}*/}
            {/*/>*/}
            {/*<PaymentsCard*/}
            {/*  summary="Your payments"*/}
            {/*  amount={`$${data.totalEarnings || 0}`}*/}
            {/*  onGoToPayments={() => {}}*/}
            {/*/>*/}
          {/*</Stack>*/}
        </Grid>

        {/*center*/}

        <Grid item xs={12} lg={4}>
          <LeadsCard
            leads={recentLeads}
            onGoToInquiries={() => router.push(paths.dashboard.contact.list)}
          />
        </Grid>

        {/* Center Column old */}
        {/*<Grid item xs={12} lg={6}>*/}
        {/*  <Grid container spacing={3}>*/}
        {/*    <Grid item xs={12} md={6}>*/}
        {/*      <LeadsCard*/}
        {/*        leads={recentLeads}*/}
        {/*        onGoToInquiries={() => router.push(paths.dashboard.contact.list)}*/}
        {/*      />*/}
        {/*    </Grid>*/}
        {/*    <Grid item xs={12} md={6}>*/}
        {/*      <Paper sx={{ */}
        {/*        p: 3, */}
        {/*        height: '100%', */}
        {/*        borderRadius: 2,*/}
        {/*        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',*/}
        {/*        background: 'white'*/}
        {/*      }}>*/}
        {/*        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>*/}
        {/*          <Typography variant="subtitle2" sx={{ flexGrow: 1, fontWeight: 600 }}>*/}
        {/*            Projects*/}
        {/*          </Typography>*/}
        {/*          <Button size="small" variant="text" sx={{ fontSize: 12, textTransform: 'none' }}>?</Button>*/}
        {/*        </Stack>*/}
        {/*        <Box sx={{ textAlign: 'center', mt: 2 }}>*/}
        {/*          <Icon icon="mdi:briefcase-outline" width={48} height={48} color="#bdbdbd" />*/}
        {/*          <Typography variant="body2" sx={{ mt: 1 }}>Manage your projects</Typography>*/}
        {/*          <Typography variant="caption" color="text.secondary">Track progress and deadlines</Typography>*/}
        {/*          <Box sx={{ mt: 1 }}>*/}
        {/*            <Button size="small" variant="text" sx={{ fontSize: 12, textTransform: 'none', color: '#1976d2' }}>*/}
        {/*              View all projects*/}
        {/*            </Button>*/}
        {/*          </Box>*/}
        {/*        </Box>*/}
        {/*      </Paper>*/}
        {/*    </Grid>*/}
        {/*    <Grid item xs={12} md={6}>*/}
        {/*      <PaymentsOverviewCard*/}
        {/*        title="Payments overview"*/}
        {/*        message="It's a quiet month. No payments are being processed right now."*/}
        {/*        onCheckInvoices={() => {}}*/}
        {/*      />*/}
        {/*    </Grid>*/}
        {/*    <Grid item xs={12} md={6}>*/}
        {/*      <NotesCard*/}
        {/*        title="Recent notes"*/}
        {/*        notes={recentNotes}*/}
        {/*        onAddNote={() => router.push(paths.dashboard.project.list)}*/}
        {/*      />*/}
        {/*    </Grid>*/}
        {/*    <Grid item xs={12} md={6}>*/}
        {/*      <Paper sx={{*/}
        {/*        p: 3,*/}
        {/*        height: '100%',*/}
        {/*        borderRadius: 2,*/}
        {/*        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',*/}
        {/*        background: 'white'*/}
        {/*      }}>*/}
        {/*        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>*/}
        {/*          <Typography variant="subtitle2" sx={{ flexGrow: 1, fontWeight: 600 }}>*/}
        {/*            Contacts*/}
        {/*          </Typography>*/}
        {/*          <Button size="small" variant="text" sx={{ fontSize: 12, textTransform: 'none' }}>?</Button>*/}
        {/*        </Stack>*/}
        {/*        <Box sx={{ textAlign: 'center', mt: 2 }}>*/}
        {/*          <Icon icon="mdi:account-group-outline" width={48} height={48} color="#bdbdbd" />*/}
        {/*          <Typography variant="body2" sx={{ mt: 1 }}>Manage your contacts</Typography>*/}
        {/*          <Typography variant="caption" color="text.secondary">Keep track of all your clients</Typography>*/}
        {/*          <Box sx={{ mt: 1 }}>*/}
        {/*            <Button size="small" variant="text" sx={{ fontSize: 12, textTransform: 'none', color: '#1976d2' }}>*/}
        {/*              View all contacts*/}
        {/*            </Button>*/}
        {/*          </Box>*/}
        {/*        </Box>*/}
        {/*      </Paper>*/}
        {/*    </Grid>*/}
        {/*  </Grid>*/}
        {/*</Grid>*/}

        {/* Right Column */}
        <Grid item xs={12} lg={4}>
          <CalendarCard
            projects={data.scheduledProjects || []}
            onMeeting={() => {}}
          />
        </Grid>
      </Grid>

      {/*second row*/}
      <Grid container spacing={3} style={{marginBottom: "24px"}}>
        <Grid item xs={12} lg={4}>
          <PaymentsCard
            summary="Your payments"
            amount={`$${data.totalEarnings || 0}`}
            onGoToPayments={() => {}}
          />
        </Grid>
        <Grid item xs={12} lg={8}>
          <NotesCard
            title="Recent notes"
            notes={recentNotes}
            onAddNote={() => router.push(paths.dashboard.project.list)}
          />
        </Grid>
      </Grid>


    </Box>
    </Container>
  );
};

export default DashboardMain;
