<template>
  <div class="space-y-6">
    <Card class="p-6">
      <div class="space-y-6">
        <div>
          <h3 class="text-lg font-semibold">Find Available Time Slots</h3>
          <p class="text-sm text-muted-foreground mt-1">
            Find optimal meeting times based on your preferences and existing
            commitments.
          </p>
        </div>

        <Separator />

        <form @submit.prevent="findAvailableSlots" class="space-y-6">
          <!-- Date Range Selection -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="startDate">Start Date</Label>
              <Input
                id="startDate"
                v-model="preferences.startDate"
                type="date"
                :min="today"
                required
              />
            </div>
            <div class="space-y-2">
              <Label for="endDate">End Date</Label>
              <Input
                id="endDate"
                v-model="preferences.endDate"
                type="date"
                :min="preferences.startDate || today"
                required
              />
            </div>
          </div>

          <!-- Meeting Duration -->
          <div class="space-y-2">
            <Label for="duration">Meeting Duration</Label>
            <Select v-model="preferences.duration">
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Time Preferences -->
          <div class="space-y-3">
            <Label>Preferred Time Range</Label>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="earliestTime" class="text-sm">Earliest Time</Label>
                <Input
                  id="earliestTime"
                  v-model="preferences.earliestTime"
                  type="time"
                  required
                />
              </div>
              <div class="space-y-2">
                <Label for="latestTime" class="text-sm">Latest Time</Label>
                <Input
                  id="latestTime"
                  v-model="preferences.latestTime"
                  type="time"
                  required
                />
              </div>
            </div>
          </div>

          <!-- Days of Week -->
          <div class="space-y-3">
            <Label>Available Days</Label>
            <div class="flex flex-wrap gap-2">
              <Button
                v-for="day in daysOfWeek"
                :key="day.value"
                type="button"
                :variant="
                  preferences.availableDays.includes(day.value)
                    ? 'default'
                    : 'outline'
                "
                size="sm"
                @click="toggleDay(day.value)"
              >
                {{ day.label }}
              </Button>
            </div>
          </div>

          <!-- Buffer Time -->
          <div class="space-y-2">
            <Label for="bufferTime">Buffer Time Between Meetings</Label>
            <Select v-model="preferences.bufferTime">
              <SelectTrigger>
                <SelectValue placeholder="Select buffer time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">No buffer</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="flex gap-3">
            <Button type="submit" :disabled="isSearching" class="flex-1">
              <Search class="w-4 h-4 mr-2" v-if="!isSearching" />
              <Loader2 class="w-4 h-4 mr-2 animate-spin" v-else />
              {{ isSearching ? 'Searching...' : 'Find Available Slots' }}
            </Button>
            <Button type="button" variant="outline" @click="resetForm">
              Reset
            </Button>
          </div>
        </form>

        <!-- Results Section -->
        <div v-if="availableSlots.length > 0" class="space-y-4">
          <Separator />
          <div>
            <h4 class="text-base font-semibold">Available Time Slots</h4>
            <p class="text-sm text-muted-foreground">
              Found {{ availableSlots.length }} available slot{{
                availableSlots.length !== 1 ? 's' : ''
              }}
            </p>
          </div>

          <div class="grid gap-3">
            <Card
              v-for="slot in availableSlots"
              :key="`${slot.date}-${slot.startTime}`"
              class="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
              @click="selectSlot(slot)"
            >
              <div class="flex justify-between items-center">
                <div>
                  <div class="font-medium">{{ formatSlotDate(slot.date) }}</div>
                  <div class="text-sm text-muted-foreground">
                    {{ slot.startTime }} - {{ slot.endTime }}
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Calendar class="w-4 h-4 mr-2" />
                  Book
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <!-- No Results -->
        <div v-else-if="hasSearched && !isSearching" class="text-center py-8">
          <div class="text-muted-foreground">
            <CalendarX class="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No available time slots found for your criteria.</p>
            <p class="text-sm">
              Try adjusting your preferences and search again.
            </p>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Loader2, Calendar, CalendarX } from 'lucide-vue-next';
import { useEventsStore } from '@/stores/events';

const eventsStore = useEventsStore();

// Get today's date for minimum date input
const today = new Date().toISOString().split('T')[0];

// Days of week options
const daysOfWeek = [
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
  { value: 0, label: 'Sun' },
];

// Form preferences
const preferences = reactive({
  startDate: today,
  endDate: '',
  duration: '60',
  earliestTime: '09:00',
  latestTime: '17:00',
  availableDays: [1, 2, 3, 4, 5], // Mon-Fri by default
  bufferTime: '15',
});

// State
const isSearching = ref(false);
const hasSearched = ref(false);
const availableSlots = ref<any[]>([]);

interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
}

// Functions
function toggleDay(dayValue: number) {
  const index = preferences.availableDays.indexOf(dayValue);
  if (index > -1) {
    preferences.availableDays.splice(index, 1);
  } else {
    preferences.availableDays.push(dayValue);
  }
}

async function findAvailableSlots() {
  isSearching.value = true;
  hasSearched.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock available slots generation
    availableSlots.value = generateMockSlots();
  } finally {
    isSearching.value = false;
  }
}

function generateMockSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const startDate = new Date(preferences.startDate);
  const endDate = new Date(preferences.endDate || preferences.startDate);

  const current = new Date(startDate);

  while (current <= endDate) {
    const dayOfWeek = current.getDay();

    if (preferences.availableDays.includes(dayOfWeek)) {
      // Generate 2-3 slots per day
      const numberOfSlots = Math.floor(Math.random() * 2) + 2;

      for (let i = 0; i < numberOfSlots; i++) {
        const hour = 9 + i * 3; // 9am, 12pm, 3pm
        if (hour <= 17) {
          const startTime = `${hour.toString().padStart(2, '0')}:00`;
          const endHour =
            hour + Math.floor(parseInt(preferences.duration) / 60);
          const endMin = parseInt(preferences.duration) % 60;
          const endTime = `${endHour.toString().padStart(2, '0')}:${endMin
            .toString()
            .padStart(2, '0')}`;

          slots.push({
            date: current.toISOString().split('T')[0],
            startTime,
            endTime,
          });
        }
      }
    }

    current.setDate(current.getDate() + 1);
  }

  return slots.slice(0, 8); // Limit to 8 results
}

function formatSlotDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function selectSlot(slot: TimeSlot) {
  // Pre-fill add event dialog with selected slot
  const startDateTime = new Date(`${slot.date}T${slot.startTime}`);
  const endDateTime = new Date(`${slot.date}T${slot.endTime}`);

  // This would ideally set the form data in the AddEventDialog
  eventsStore.setEventAddOpen(true);
}

function resetForm() {
  preferences.startDate = today;
  preferences.endDate = '';
  preferences.duration = '60';
  preferences.earliestTime = '09:00';
  preferences.latestTime = '17:00';
  preferences.availableDays = [1, 2, 3, 4, 5];
  preferences.bufferTime = '15';

  availableSlots.value = [];
  hasSearched.value = false;
}
</script>
