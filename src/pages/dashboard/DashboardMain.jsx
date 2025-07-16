import React from 'react';
import { Grid, Box, Typography, CircularProgress, Alert, Paper, Stack, Button } from '@mui/material';
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

const DashboardMain = () => {
  const {
    dashboard = {},
    dashboardLoading,
    dashboardError,
  } = useGetDashboard();

  const data = dashboard || { leads: [], scheduledProjects: [], notes: [] };

  // Stats (example: you can adjust based on your API)
  const stats = [
    { label: 'New leads', value: data.leads?.length || 0, icon: 'mdi:account-plus' },
    { label: 'Unread messages', value: 0, icon: 'mdi:email-outline' },
    { label: 'Tasks', value: 0, icon: 'mdi:check-circle-outline' },
    { label: '2025 bookings', value: data.scheduledProjects?.length || 0, icon: 'mdi:calendar-check-outline' },
  ];

  // Leads for LeadsCard
  const leads = (data.leads || []).map(lead => ({
    name: lead.fullName,
    time: lead.lastInteraction ? new Date(lead.lastInteraction).toLocaleString() : 'No recent activity',
    location: lead.organization || '',
  }));

  // Activities for ActivityCard (using scheduledProjects as example)
  const activities = (data.scheduledProjects || []).map(project => ({
    name: project.name,
    time: project.startTime || '',
  }));
  
  // Notes for NotesCard
  const notesMessage = (data.notes && data.notes.length > 0) ? data.notes[0].additionalInfo : 'Keep all your client notes here. Free your mind with notes.';

  // Tasks for TasksCard (no tasks in API, so empty)
  const tasks = [];

  // Unread messages mock (since not in API)
  const unreadMessages = 0;

  if (dashboardLoading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;
  if (dashboardError) return <Box sx={{ p: 4 }}><Alert severity="error">{dashboardError.message || dashboardError}</Alert></Box>;

  return (
    <Box sx={{ background: '#fafbfc', minHeight: '100vh', p: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary">
          {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Good morning, Daksh
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Summer’s heating up, so does your business.
        </Typography>
      </Box>

      {/* Top Stats */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {stats.map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Main Grid - 3 columns on desktop, with center column split for Unread Messages */}
      <Grid container spacing={2}>
        {/* Left column */}
        <Grid item xs={12} md={3}>
          <Box sx={{ mb: 2 }}>
            <CreateCard />
          </Box>
          <Box sx={{ mb: 2 }}>
            <ActivityCard activities={activities} onGoToProjects={() => {}} />
          </Box>
          <Box sx={{ mb: 2 }}>
            <PaymentsCard summary="Your payments" amount="$0" onGoToPayments={() => {}} />
          </Box>
        </Grid>
        {/* Center column */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <LeadsCard leads={leads} onGoToInquiries={() => {}} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>Unread messages</Typography>
                  <Button size="small" variant="text" sx={{ fontSize: 12, textTransform: 'none' }}>?</Button>
                </Stack>
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Icon icon="mdi:email-open-outline" width={48} height={48} color="#bdbdbd" />
                  <Typography variant="body2" sx={{ mt: 1 }}>You've read them all. <span role="img" aria-label="clap">👏</span></Typography>
                  <Typography variant="caption" color="text.secondary">You done good 👏</Typography>
                  <Box sx={{ mt: 1 }}>
                    <Button size="small" variant="text" sx={{ fontSize: 12, textTransform: 'none' }}>Go to active projects</Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <PaymentsOverviewCard title="Payments overview" message="It's a quiet month. No payments are being processed right now." onCheckInvoices={() => {}} />
            </Grid>
            <Grid item xs={12} md={6}>
              <NotesCard title="Recent notes" message={notesMessage} onAddNote={() => {}} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TasksCard tasks={tasks} onGoToTasks={() => {}} />
            </Grid>
          </Grid>
        </Grid>
        {/* Right column */}
        <Grid item xs={12} md={3}>
          <Box sx={{ mb: 2 }}>
            <CalendarCard date={8} onMeeting={() => {}} projects={data.scheduledProjects || []} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardMain;
