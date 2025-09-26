<template>
  <div ref="calendarContainerRef" class="space-y-4">
    <CalendarNav
      :calendar-ref="calendarRef"
      :start="selectedStart"
      :end="selectedEnd"
      :viewed-date="viewedDate"
    />

    <Card class="p-4 shadow-sm">
      <FullCalendar
        ref="calendarRef"
        :options="{
          timeZone: 'local',
          plugins,
          initialView: 'timeGridWeek',
          headerToolbar: false,
          slotMinTime: calendarEarliestTime,
          slotMaxTime: calendarLatestTime,
          allDaySlot: false,
          firstDay: 1,
          height: 'auto',
          contentHeight: 600,
          aspectRatio: 1.8,
          displayEventEnd: true,
          windowResizeDelay: 100,
          events,
          slotLabelFormat,
          eventTimeFormat,
          eventBorderColor: 'transparent',
          expandRows: true,
          selectable: true,
          editable: true,
          selectMirror: true,
          dayMaxEvents: true,
          weekends: true,
          handleWindowResize: true,
          select: handleDateSelect,
          eventClick: handleEventClick,
          eventChange: handleEventChange,
          eventsSet: handleEventsSet,
          datesSet: handleDatesSet,
          eventDidMount: handleEventDidMount,
          windowResize: refreshCalendar,
        }"
        class="calendar-container"
      />
    </Card>

    <!-- Event dialogs -->
    <AddEventDialog />
    <EventViewDialog />
    <EditEventDialog />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onActivated, nextTick, watch } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import multiMonthPlugin from '@fullcalendar/multimonth';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Card } from '@/components/ui';
import CalendarNav from './CalendarNav.vue';
import AddEventDialog from './AddEventDialog.vue';
import EventViewDialog from './EventViewDialog.vue';
import EditEventDialog from './EditEventDialog.vue';
import { useEventsStore } from '@/stores/events';
import { earliestTime, latestTime } from '@/utils/data';
import { getDateFromMinutes } from '@/utils';

// Props
interface Props {
  isVisible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isVisible: true,
});

// Store
const eventsStore = useEventsStore();
const { events } = eventsStore;

// Calendar ref
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);
const calendarContainerRef = ref<HTMLDivElement | null>(null);

// State
const viewedDate = ref(new Date());
const selectedStart = ref(new Date());
const selectedEnd = ref(new Date());

// Double-click detection for events
let lastClickTime = 0;
let lastClickedEvent: string | null = null;

// FullCalendar plugins
const plugins = [
  dayGridPlugin,
  timeGridPlugin,
  multiMonthPlugin,
  interactionPlugin,
  listPlugin,
];

// Computed time ranges
const calendarEarliestTime = computed(() => {
  const earliestHour = getDateFromMinutes(earliestTime)
    .getHours()
    .toString()
    .padStart(2, '0');
  const earliestMin = getDateFromMinutes(earliestTime)
    .getMinutes()
    .toString()
    .padStart(2, '0');
  return `${earliestHour}:${earliestMin}`;
});

const calendarLatestTime = computed(() => {
  const latestHour = getDateFromMinutes(latestTime)
    .getHours()
    .toString()
    .padStart(2, '0');
  const latestMin = getDateFromMinutes(latestTime)
    .getMinutes()
    .toString()
    .padStart(2, '0');
  return `${latestHour}:${latestMin}`;
});

// Format options
const slotLabelFormat = {
  hour: 'numeric' as const,
  minute: '2-digit' as const,
  hour12: true,
};

const eventTimeFormat = {
  hour: 'numeric' as const,
  minute: '2-digit' as const,
  hour12: true,
};

// Event handlers
function handleDateSelect(info: any) {
  selectedStart.value = info.start;
  selectedEnd.value = info.end;
}

function handleEventClick(info: any) {
  const event = events.find((e: any) => e.id === info.event.id);
  if (!event) return;

  const currentTime = Date.now();
  const isDoubleClick =
    lastClickedEvent === event.id && currentTime - lastClickTime < 300;

  if (isDoubleClick) {
    // Double-click: Open edit dialog directly
    eventsStore.setSelectedEvent(event);
    eventsStore.setEventEditOpen(true);
    lastClickedEvent = null; // Reset to prevent triple-click issues
  } else {
    // Single-click: Open view dialog
    eventsStore.setSelectedEvent(event);
    eventsStore.setEventViewOpen(true);
    lastClickedEvent = event.id;
    lastClickTime = currentTime;
  }
}

function handleEventChange(info: any) {
  const event = events.find((e: any) => e.id === info.event.id);
  if (event) {
    eventsStore.updateEvent(info.event.id, {
      start: info.event.start,
      end: info.event.end,
    });
  }
}

function handleEventsSet() {
  // Handle events set
}

function handleDatesSet(info: any) {
  viewedDate.value = info.view.currentStart;
}

function handleEventDidMount(info: any) {
  // Add custom styling to events
  const el = info.el;
  el.style.borderRadius = '6px';
  el.style.border = 'none';
  el.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
}

// Render functions
function dayCellContent(info: any) {
  return {
    html: `<div class="fc-daygrid-day-number">${info.dayNumberText}</div>`,
  };
}

function dayHeaderContent(info: any) {
  return { html: `<div class="fc-col-header-cell-cushion">${info.text}</div>` };
}

function eventContent(info: any) {
  return { html: `<div class="fc-event-title">${info.event.title}</div>` };
}

// Debounce timer for refresh
let refreshTimer: number | null = null;

// Method to refresh calendar when tab becomes visible
function refreshCalendar() {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }

  refreshTimer = setTimeout(() => {
    if (calendarRef.value) {
      nextTick(() => {
        const api = calendarRef.value?.getApi();
        if (api) {
          api.updateSize();
          api.render();
        }
      });
    }
  }, 50);
}

// Handle when component becomes active (when switching back to calendar tab)
onActivated(() => {
  // Use setTimeout to ensure the DOM is fully updated
  setTimeout(() => {
    refreshCalendar();
  }, 50);
});

// Watch for visibility changes
watch(
  () => props.isVisible,
  (isVisible) => {
    if (isVisible) {
      // When the calendar becomes visible, refresh it after a short delay
      setTimeout(() => {
        refreshCalendar();
      }, 100);
    }
  }
);

// Keyboard shortcut handler
function handleKeydown(event: KeyboardEvent) {
  // ESC key to close any open dialog
  if (event.key === 'Escape') {
    eventsStore.setEventViewOpen(false);
    eventsStore.setEventEditOpen(false);
    eventsStore.setEventAddOpen(false);
  }

  // N key to add new event (when no input is focused)
  if (event.key === 'n' || event.key === 'N') {
    const activeElement = document.activeElement;
    if (
      !activeElement ||
      (activeElement.tagName !== 'INPUT' &&
        activeElement.tagName !== 'TEXTAREA')
    ) {
      event.preventDefault();
      eventsStore.setEventAddOpen(true);
    }
  }
}

// Set up observers on mount to handle visibility and resize detection
onMounted(() => {
  // Initial calendar setup
  setTimeout(() => {
    refreshCalendar();
  }, 200);

  // Add keyboard event listeners
  document.addEventListener('keydown', handleKeydown);

  // Cleanup on unmount
  return () => {
    document.removeEventListener('keydown', handleKeydown);
  };

  if (calendarContainerRef.value) {
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0) {
            // Calendar container is visible, refresh after a delay
            setTimeout(() => {
              refreshCalendar();
            }, 100);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when at least 10% of the calendar is visible
      }
    );

    const resizeObserver = new ResizeObserver(() => {
      // When the container resizes, refresh the calendar
      refreshCalendar();
    });

    const containerElement = calendarContainerRef.value;
    if (containerElement) {
      intersectionObserver.observe(containerElement as Element);
      resizeObserver.observe(containerElement as Element);
    }

    // Cleanup observers on component unmount
    return () => {
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
    };
  }
});

// Expose refresh method to parent component
defineExpose({
  refreshCalendar,
});
</script>

<style>
.calendar-container {
  border-radius: 0.5rem;
}

/* FullCalendar custom styling */
:deep(.fc-theme-standard .fc-scrollgrid) {
  border: none;
}

:deep(.fc-theme-standard td, .fc-theme-standard th) {
  border-color: hsl(var(--border));
}

:deep(.fc-col-header-cell-cushion) {
  font-size: 0.875rem;
  font-weight: 500;
  color: hsl(var(--muted-foreground));
  padding: 0.5rem;
}

:deep(.fc-daygrid-day-number) {
  font-size: 0.875rem;
  font-weight: 500;
}

:deep(.fc-timegrid-slot-label-cushion) {
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
}

:deep(.fc-event) {
  cursor: pointer;
}

:deep(.fc-event-title) {
  font-size: 0.75rem;
  font-weight: 500;
}

:deep(.fc-day-today .fc-daygrid-day-number) {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border-radius: 9999px;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
}

:deep(.fc-button) {
  display: none;
}
</style>
