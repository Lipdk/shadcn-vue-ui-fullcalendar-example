<template>
  <Card class="p-4">
    <div
      class="flex flex-col sm:flex-row gap-import { Button } from '@/components/ui/button' import { Card } from '@/components/ui/card' import { Separator } from '@/components/ui/separator' import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip' import { ChevronLeft, ChevronRight, Plus } from 'lucide-vue-next'ems-center justify-between"
    >
      <!-- Date info and navigation -->
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1">
          <Button variant="outline" size="icon" @click="goPrev">
            <ChevronLeft class="h-4 w-4" />
          </Button>

          <Button variant="outline" @click="goToday" class="min-w-[70px]">
            Today
          </Button>

          <Button variant="outline" size="icon" @click="goNext">
            <ChevronRight class="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" class="h-6 mx-2" />

        <!-- Current date display -->
        <div class="text-sm font-medium text-muted-foreground">
          {{ formatDateRange(props.start, props.end) }}
        </div>
      </div>

      <!-- Right side controls -->
      <div class="flex items-center gap-2">
        <!-- View switcher -->
        <div class="flex">
          <Button
            :variant="currentView === 'timeGridDay' ? 'default' : 'outline'"
            size="sm"
            @click="changeView('timeGridDay')"
            class="rounded-r-none"
          >
            Day
          </Button>
          <Button
            :variant="currentView === 'timeGridWeek' ? 'default' : 'outline'"
            size="sm"
            @click="changeView('timeGridWeek')"
            class="rounded-none border-l-0"
          >
            Week
          </Button>
          <Button
            :variant="currentView === 'dayGridMonth' ? 'default' : 'outline'"
            size="sm"
            @click="changeView('dayGridMonth')"
            class="rounded-l-none border-l-0"
          >
            Month
          </Button>
        </div>

        <Separator orientation="vertical" class="h-6 mx-1" />

        <!-- Add event button with tooltip -->
        <Tooltip>
          <TooltipTrigger as-child>
            <Button @click="openAddEventDialog" class="gap-2">
              <Plus class="h-4 w-4" />
              Add Event
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add new event (Shortcut: N)</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-vue-next';
import { useEventsStore } from '@/stores/events';
import {
  TooltipTrigger,
  TooltipContent,
  Tooltip,
} from '@/components/ui/tooltip';

interface Props {
  calendarRef: any;
  start: Date;
  end: Date;
  viewedDate: Date;
}

const props = defineProps<Props>();

const eventsStore = useEventsStore();
const currentView = ref('timeGridWeek');

function goPrev() {
  if (props.calendarRef?.getApi) {
    props.calendarRef.getApi().prev();
  }
}

function goNext() {
  if (props.calendarRef?.getApi) {
    props.calendarRef.getApi().next();
  }
}

function goToday() {
  if (props.calendarRef?.getApi) {
    props.calendarRef.getApi().today();
  }
}

function changeView(view: string) {
  if (props.calendarRef?.getApi) {
    props.calendarRef.getApi().changeView(view);
    currentView.value = view;
  }
}

function formatDateRange(start: Date, end: Date) {
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };

  if (
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth()
  ) {
    // Same month
    if (start.getDate() === end.getDate()) {
      // Same day
      return start.toLocaleDateString('en-US', options);
    } else {
      // Same month, different days
      return `${start.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
      })} - ${end.getDate()}, ${start.getFullYear()}`;
    }
  } else {
    // Different months/years
    return `${start.toLocaleDateString(
      'en-US',
      options
    )} - ${end.toLocaleDateString('en-US', options)}`;
  }
}

function openAddEventDialog() {
  eventsStore.setEventAddOpen(true);
}
</script>
