<template>
  <TooltipProvider>
    <div class="min-h-screen bg-background">
      <div class="absolute top-4 right-4">
        <a
          href="https://github.com/Lipdk/shadcn-vue-ui-fullcalendar-example"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center"
          title="View Source on GitHub"
        >
          <svg
            class="size-10"
            viewBox="0 0 15 15"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z"
              fill="currentColor"
              fill-rule="evenodd"
              clip-rule="evenodd"
            ></path>
          </svg>
        </a>
      </div>

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
              <h2
                class="text-3xl font-bold tracking-tight text-black dark:text-white"
              >
                Calendar
              </h2>
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
} from '@/components/ui';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Calendar as CalendarIcon, Clock, Github } from 'lucide-vue-next';
import Calendar from '@/components/Calendar.vue';
import AvailabilityChecker from '@/components/AvailabilityChecker.vue';
import ThemeToggle from '@/components/ThemeToggle.vue';
import { useTheme } from '@/composables/useTheme';

const activeTab = ref('calendar');
const calendarRef = ref<InstanceType<typeof Calendar> | null>(null);

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
