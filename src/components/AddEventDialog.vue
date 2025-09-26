<template>
  <Dialog
    :open="eventsStore.eventAddOpen"
    @update:open="eventsStore.setEventAddOpen"
  >
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add New Event</DialogTitle>
        <DialogDescription>
          Create a new calendar event. Click save when you're done.
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="title">Event Title</Label>
          <Input
            id="title"
            v-model="form.title"
            placeholder="Enter event title"
            required
          />
        </div>

        <div class="space-y-2">
          <Label for="description">Description</Label>
          <Textarea
            id="description"
            v-model="form.description"
            placeholder="Enter event description"
            rows="3"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="startDate">Start Date</Label>
            <Input
              id="startDate"
              v-model="form.startDate"
              type="date"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="startTime">Start Time</Label>
            <Input
              id="startTime"
              v-model="form.startTime"
              type="time"
              required
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="endDate">End Date</Label>
            <Input id="endDate" v-model="form.endDate" type="date" required />
          </div>

          <div class="space-y-2">
            <Label for="endTime">End Time</Label>
            <Input id="endTime" v-model="form.endTime" type="time" required />
          </div>
        </div>

        <div class="space-y-2">
          <Label for="color">Event Color</Label>
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

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            @click="eventsStore.setEventAddOpen(false)"
          >
            Cancel
          </Button>
          <Button type="submit"> Save Event </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
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

// Reset form when dialog opens
watch(
  () => eventsStore.eventAddOpen,
  (isOpen) => {
    if (isOpen) {
      resetForm();
    }
  }
);

function resetForm() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  form.title = '';
  form.description = '';
  form.startDate = today.toISOString().split('T')[0];
  form.startTime = '09:00';
  form.endDate = today.toISOString().split('T')[0];
  form.endTime = '10:00';
  form.backgroundColor = colors[0];
}

function handleSubmit() {
  const startDateTime = new Date(`${form.startDate}T${form.startTime}`);
  const endDateTime = new Date(`${form.endDate}T${form.endTime}`);

  if (endDateTime <= startDateTime) {
    alert('End time must be after start time');
    return;
  }

  const newEvent: CalendarEvent = {
    id: String(Date.now()), // Simple ID generation
    title: form.title,
    description: form.description,
    start: startDateTime,
    end: endDateTime,
    backgroundColor: form.backgroundColor,
  };

  eventsStore.addEvent(newEvent);
  eventsStore.setEventAddOpen(false);
}

// Initialize form
resetForm();
</script>
