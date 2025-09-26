<template>
  <TooltipProvider>
    <div class="min-h-screen bg-background">
      <!-- Main Content -->
      <main class="container mx-auto px-4 py-8">
        <Tabs
          :model-value="activeTab"
          @update:model-value="handleTabChange"
          class="w-full"
        >
          <div
            class="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8"
          >
            <TabsList class="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="calendar" class="flex items-center gap-2">
                <CalendarIcon class="w-4 h-4" />
                Calendar
              </TabsTrigger>
              <TabsTrigger
                value="schedulingAssistant"
                class="flex items-center gap-2"
              >
                <Clock class="w-4 h-4" />
                Scheduling Assistant
              </TabsTrigger>
            </TabsList>
            <div class="flex-shrink-0">
              <ThemeToggle />
            </div>
          </div>

          <TabsContent value="calendar" class="space-y-6">
            <div class="text-center space-y-2">
              <h2 class="text-3xl font-bold tracking-tight">Calendar</h2>
              <p class="text-muted-foreground max-w-2xl mx-auto">
                A flexible calendar component with drag and drop capabilities
                built using FullCalendar and shadcn-vue.
              </p>
            </div>

            <Separator />
            <Calendar
              ref="calendarRef"
              :is-visible="activeTab === 'calendar'"
            />
          </TabsContent>

          <TabsContent value="schedulingAssistant" class="space-y-6">
            <div class="text-center space-y-2">
              <h2 class="text-3xl font-bold tracking-tight">
                Scheduling Assistant
              </h2>
              <p class="text-muted-foreground max-w-2xl mx-auto">
                Find available time slots based on your preferences and
                constraints. Perfect for scheduling meetings without conflicts.
              </p>
            </div>

            <Separator />
            <AvailabilityChecker />
          </TabsContent>
        </Tabs>
      </main>

      <!-- Footer -->
      <footer class="border-t mt-16">
        <div class="container mx-auto px-4 py-6">
          <div
            class="flex flex-col sm:flex-row justify-between items-center gap-4"
          >
            <div class="text-center sm:text-left">
              <p class="text-sm text-muted-foreground">
                Built with Vue 3, FullCalendar, and shadcn-vue
              </p>
              <p class="text-sm text-muted-foreground mt-1">
                Made with ❤️ by
                <a
                  href="https://github.com/Lipdk/shadcn-vue-ui-fullcalendar-example"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-medium text-primary hover:underline transition-colors"
                >
                  Lipdk
                </a>
              </p>
            </div>
            <div class="flex items-center gap-2">
              <Badge variant="outline" class="text-xs"> TypeScript </Badge>
              <Badge variant="outline" class="text-xs"> Tailwind CSS </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </TooltipProvider>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Calendar as CalendarIcon, Clock } from 'lucide-vue-next';
import Calendar from '@/components/Calendar.vue';
import AvailabilityChecker from '@/components/AvailabilityChecker.vue';
import ThemeToggle from '@/components/ThemeToggle.vue';
import { useTheme } from '@/composables/useTheme';

const activeTab = ref('calendar');
const calendarRef = ref<InstanceType<typeof Calendar> | null>(null);

// Initialize theme
useTheme();

async function handleTabChange(newTab: string) {
  activeTab.value = newTab;

  if (newTab === 'calendar') {
    // Wait for the DOM to update and then refresh the calendar
    await nextTick();
    setTimeout(() => {
      if (calendarRef.value?.refreshCalendar) {
        calendarRef.value.refreshCalendar();
      }
    }, 100);
  }
}
</script>
