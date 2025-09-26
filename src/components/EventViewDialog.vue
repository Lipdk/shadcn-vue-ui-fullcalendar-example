<template>
  <Dialog
    :open="eventsStore.eventViewOpen"
    @update:open="eventsStore.setEventViewOpen"
  >
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ selectedEvent?.title }}</DialogTitle>
        <DialogDescription>
          Event details and actions • Double-click events to edit directly
        </DialogDescription>
      </DialogHeader>

      <div v-if="selectedEvent" class="space-y-4">
        <!-- Event Color Indicator -->
        <div class="flex items-center gap-3">
          <div
            class="w-4 h-4 rounded-full border"
            :style="{ backgroundColor: selectedEvent.backgroundColor }"
          />
          <span class="text-sm text-muted-foreground">Event Color</span>
        </div>

        <!-- Event Description -->
        <div v-if="selectedEvent.description" class="space-y-2">
          <Label>Description</Label>
          <p class="text-sm text-muted-foreground bg-muted p-3 rounded-md">
            {{ selectedEvent.description }}
          </p>
        </div>

        <!-- Event Date & Time -->
        <div class="space-y-3">
          <Label>Date & Time</Label>
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm">
              <Calendar class="w-4 h-4 text-muted-foreground" />
              <span>{{ formatEventDate(selectedEvent.start) }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <Clock class="w-4 h-4 text-muted-foreground" />
              <span>
                {{ formatEventTime(selectedEvent.start) }} -
                {{ formatEventTime(selectedEvent.end) }}
                <span class="text-muted-foreground ml-2">
                  ({{
                    getEventDuration(selectedEvent.start, selectedEvent.end)
                  }})
                </span>
              </span>
            </div>
          </div>
        </div>

        <!-- Event Actions -->
        <div class="pt-4 space-y-3">
          <Separator />
          <div class="flex gap-2">
            <Button @click="handleEdit" class="flex-1">
              <Edit class="w-4 h-4 mr-2" />
              Edit Event
            </Button>
            <Button variant="destructive" @click="handleDelete">
              <Trash2 class="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="eventsStore.setEventViewOpen(false)">
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, Edit, Trash2 } from 'lucide-vue-next';
import { useEventsStore } from '@/stores/events';

const eventsStore = useEventsStore();

const selectedEvent = computed(() => eventsStore.selectedEvent);

function formatEventDate(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatEventTime(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function getEventDuration(start: Date | string, end: Date | string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours > 0 && diffMinutes > 0) {
    return `${diffHours}h ${diffMinutes}m`;
  } else if (diffHours > 0) {
    return `${diffHours}h`;
  } else {
    return `${diffMinutes}m`;
  }
}

function handleEdit() {
  eventsStore.setEventViewOpen(false);
  eventsStore.setEventEditOpen(true);
}

function handleDelete() {
  const event = eventsStore.selectedEvent;
  if (!event) return;

  if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
    eventsStore.deleteEvent(event.id);
    eventsStore.setEventViewOpen(false);
  }
}
</script>
