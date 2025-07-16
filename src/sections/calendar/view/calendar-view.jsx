import Calendar from '@fullcalendar/react'; // => request placed at the top
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import { useState, useEffect, useCallback } from 'react';
import interactionPlugin from '@fullcalendar/interaction';
import { paths } from 'src/routes/paths';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { isAfter, isBetween } from 'src/utils/format-time';

import { CALENDAR_COLOR_OPTIONS } from 'src/_mock/_calendar';
import { alpha } from '@mui/material/styles';
import { updateEvent, useGetEvents } from 'src/api/calendar';
import { useGetProject } from 'src/api/project';
import { useRouter } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import { StyledCalendar } from '../styles';
import CalendarForm from '../calendar-form';
import { useEvent, useCalendar } from '../hooks';
import CalendarToolbar from '../calendar-toolbar';
import CalendarFilters from '../calendar-filters';
import CalendarFiltersResult from '../calendar-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  colors: [],
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function CalendarView() {
  const theme = useTheme();
  const settings = useSettingsContext();
  const smUp = useResponsive('up', 'sm');
  const openFilters = useBoolean();
  const [filters, setFilters] = useState(defaultFilters);
  const { events, eventsLoading } = useGetEvents();
  const { projects, projectLoading } = useGetProject();
  const router = useRouter();

  const dateError = isAfter(filters.startDate, filters.endDate);

  // Remove all event form and editing logic
  // Remove useCalendar and related state

  // Map projects to calendar events with unique colors
  const projectEvents = (projects || []).map((project, idx) => {
    const colorIdx = idx % CALENDAR_COLOR_OPTIONS.length;
    const color = CALENDAR_COLOR_OPTIONS[colorIdx];
    return {
      id: `project-${project._id}`,
      title: project.name,
      start: project.startDate,
      end: project.endDate || project.startDate,
      color,
      allDay: true,
      extendedProps: {
        projectId: project._id,
        isProject: true,
        projectColor: color,
      },
    };
  });

  // Merge with existing events
  const allEvents = [...(events || []), ...projectEvents];

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const canReset = !!filters.colors.length || (!!filters.startDate && !!filters.endDate);

  const dataFiltered = applyFilter({
    inputData: allEvents,
    filters,
    dateError,
  });

  // Only allow navigation for project events
  const handleEventClick = useCallback(
    (arg) => {
      const { event } = arg;
      if (event.id && typeof event.id === 'string' && event.id.startsWith('project-')) {
        const projectId = event.id.replace('project-', '');
        router.push(paths.dashboard.project.view(projectId));
      }
    },
    [router]
  );

  // Custom event content renderer (unchanged)
  const renderEventContent = (eventInfo) => {
    const isProject = eventInfo.event.extendedProps?.isProject;
    const projectColor = eventInfo.event.extendedProps?.projectColor;
    if (isProject) {
      return (
        <span
          className="fc-event-project"
          style={{
            display: 'flex',
            alignItems: 'center',
            fontWeight: 600,
            color: projectColor,
            background: alpha(projectColor, 0.15),
            borderRadius: 12,
            padding: '2px 8px',
            margin: '0 2px',
            minHeight: 24,
            fontSize: 13,
            // cursor: 'pointer', // now handled by CSS
          }}
        >
          <Iconify icon="mdi:briefcase-outline" width={16} height={16} style={{ marginRight: 4, color: projectColor }} />
          {eventInfo.event.title}
        </span>
      );
    }
    return <span>{eventInfo.event.title}</span>;
  };

  // Remove all dialog, form, and event creation UI

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: { xs: 3, md: 5 } }}
        >
          <Typography variant="h4">Calendar</Typography>
          {/* Remove New Event Button */}
        </Stack>

        {canReset && (
          <CalendarFiltersResult
            filters={filters}
            onFilters={handleFilters}
            canReset={canReset}
            onResetFilters={handleResetFilters}
            results={dataFiltered.length}
            sx={{ mb: { xs: 3, md: 5 } }}
          />
        )}

        <Card>
          <StyledCalendar>
            <CalendarToolbar
              date={new Date()}
              view={smUp ? 'dayGridMonth' : 'listWeek'}
              loading={eventsLoading || projectLoading}
              onNextDate={() => {}}
              onPrevDate={() => {}}
              onToday={() => {}}
              onChangeView={() => {}}
              onOpenFilters={openFilters.onTrue}
            />
            <Calendar
              weekends
              editable={false}
              droppable={false}
              selectable={false}
              rerenderDelay={10}
              allDayMaintainDuration={false}
              eventResizableFromStart={false}
              initialDate={new Date()}
              initialView={smUp ? 'dayGridMonth' : 'listWeek'}
              dayMaxEventRows={3}
              eventDisplay="block"
              events={dataFiltered}
              headerToolbar={false}
              eventClick={handleEventClick}
              eventContent={renderEventContent}
              eventClassNames={(arg) => {
                if (arg.event.extendedProps?.isProject) return ['fc-event-project'];
                return [];
              }}
              height={smUp ? 720 : 'auto'}
              // Remove eventDrop, eventResize, select
              plugins={[
                listPlugin,
                dayGridPlugin,
                timelinePlugin,
                timeGridPlugin,
                interactionPlugin,
              ]}
            />
          </StyledCalendar>
        </Card>
      </Container>
      <CalendarFilters
        open={openFilters.value}
        onClose={openFilters.onFalse}
        filters={filters}
        onFilters={handleFilters}
        canReset={canReset}
        onResetFilters={handleResetFilters}
        dateError={dateError}
        events={allEvents}
        colorOptions={CALENDAR_COLOR_OPTIONS}
        onClickEvent={() => {}}
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, filters, dateError }) {
  const { colors, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  inputData = stabilizedThis.map((el) => el[0]);

  if (colors.length) {
    inputData = inputData.filter((event) => colors.includes(event.color));
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((event) => isBetween(event.start, startDate, endDate));
    }
  }

  return inputData;
}
