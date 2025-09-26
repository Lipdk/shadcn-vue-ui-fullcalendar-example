<template>
  <Dialog
    :open="eventsStore.eventEditOpen"
    @update:open="eventsStore.setEventEditOpen"
  >
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit Event</DialogTitle>
        <DialogDescription>
          Update the event details. Click save when you're done.
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="edit-title">Event Title</Label>
          <Input
            id="edit-title"
            v-model="form.title"
            placeholder="Enter event title"
            required
          />
        </div>

        <div class="space-y-2">
          <Label for="edit-description">Description</Label>
          <Textarea
            id="edit-description"
            v-model="form.description"
            placeholder="Enter event description"
            rows="3"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="edit-startDate">Start Date</Label>
            <Input
              id="edit-startDate"
              v-model="form.startDate"
              type="date"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="edit-startTime">Start Time</Label>
            <Input
              id="edit-startTime"
              v-model="form.startTime"
              type="time"
              required
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="edit-endDate">End Date</Label>
            <Input
              id="edit-endDate"
              v-model="form.endDate"
              type="date"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="edit-endTime">End Time</Label>
            <Input
              id="edit-endTime"
              v-model="form.endTime"
              type="time"
              required
            />
          </div>
        </div>

        <div class="space-y-2">
          <Label for="edit-color">Event Color</Label>
          <div class="flex gap-2">
            <Button
              v-for="color in colors"
              :key="color"
              type="button"
              :class="`w-8 h-8 rounded-md border-2 ${
                form.backgroundColor === color
                  ? 'ring-2 ring-offset-2 ring-primary'
                  : ''
              }`"
              :style="{ backgroundColor: color }"
              @click="form.backgroundColor = color"
            />
          </div>
        </div>

        <DialogFooter class="gap-2">
          <Button
            type="button"
            variant="destructive"
            @click="handleDelete"
            class="mr-auto"
          >
            <Trash2 class="w-4 h-4 mr-2" />
            Delete
          </Button>
          <Button
            type="button"
            variant="outline"
            @click="eventsStore.setEventEditOpen(false)"
          >
            Cancel
          </Button>
          <Button type="submit">
            <Save class="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Trash2 } from 'lucide-vue-next';
import { useEventsStore } from '@/stores/events';
import type { CalendarEvent } from '@/utils/data';

const eventsStore = useEventsStore();

const colors = [
  '#AEC6E4',
  '#FFD1DC',
  '#B2E0B2',
  '#FFB3BA',
  '#FFDFBA',
  '#E0E0E0',
  '#DDA0DD',
  '#98FB98',
];

const form = reactive({
  title: '',
  description: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  backgroundColor: colors[0],
});

// Watch for when dialog opens and populate form with selected event data
watch(
  [() => eventsStore.eventEditOpen, () => eventsStore.selectedEvent],
  ([isOpen, selectedEvent]) => {
    if (isOpen && selectedEvent) {
      populateForm(selectedEvent);
    }
  }
);

function populateForm(event: CalendarEvent) {
  const startDate = new Date(event.start);
  const endDate = new Date(event.end);

  form.title = event.title;
  form.description = event.description || '';
  form.startDate = startDate.toISOString().split('T')[0];
  form.startTime = startDate.toTimeString().slice(0, 5);
  form.endDate = endDate.toISOString().split('T')[0];
  form.endTime = endDate.toTimeString().slice(0, 5);
  form.backgroundColor = event.backgroundColor || colors[0];
}

function handleSubmit() {
  const selectedEvent = eventsStore.selectedEvent;
  if (!selectedEvent) return;

  const startDateTime = new Date(`${form.startDate}T${form.startTime}`);
  const endDateTime = new Date(`${form.endDate}T${form.endTime}`);

  if (endDateTime <= startDateTime) {
    alert('End time must be after start time');
    return;
  }

  const updatedEvent: Partial<CalendarEvent> = {
    title: form.title,
    description: form.description,
    start: startDateTime,
    end: endDateTime,
    backgroundColor: form.backgroundColor,
  };

  eventsStore.updateEvent(selectedEvent.id, updatedEvent);
  eventsStore.setEventEditOpen(false);
}

function handleDelete() {
  const selectedEvent = eventsStore.selectedEvent;
  if (!selectedEvent) return;

  if (confirm('Are you sure you want to delete this event?')) {
    eventsStore.deleteEvent(selectedEvent.id);
    eventsStore.setEventEditOpen(false);
  }
}
</script>
