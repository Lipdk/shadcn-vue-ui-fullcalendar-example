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
          datesSet: handleDatesSet,
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
import {
  ref,
  computed,
  onMounted,
  onActivated,
  nextTick,
  watch,
  watchEffect,
} from 'vue';
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
import { useTheme } from '@/composables/useTheme';
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

// Theme
const { theme } = useTheme();

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
  console.log('Event clicked:', info.event);
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

function handleDatesSet(info: any) {
  viewedDate.value = info.view.currentStart;
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

// Watch for visibility changes
watch(
  () => props.isVisible,
  (isVisible) => {
    if (isVisible) {
      refreshCalendar();
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

onMounted(() => {
  setTimeout(() => {
    refreshCalendar();
  }, 200);

  if (calendarContainerRef.value) return;

  // Add keyboard event listeners
  document.addEventListener('keydown', handleKeydown);

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

  // Cleanup on unmount
  return () => {
    intersectionObserver.disconnect();
    resizeObserver.disconnect();
    document.removeEventListener('keydown', handleKeydown);
  };
});

// Theme watcher to refresh calendar appearance and event styles
watchEffect(() => {
  if (theme.value) {
    nextTick(() => {
      refreshCalendar();
    });
  }
});

// Expose refresh method to parent component
defineExpose({
  refreshCalendar,
});
</script>
