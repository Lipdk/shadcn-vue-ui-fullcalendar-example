import { defineStore } from 'pinia'
import { ref } from 'vue'
import { initialEvents, type CalendarEvent } from '@/utils/data'

export const useEventsStore = defineStore('events', () => {
  // State
  const events = ref<CalendarEvent[]>(
    initialEvents.map((event) => ({
      ...event,
      id: String(event.id),
      color: event.backgroundColor,
    }))
  )
  
  const eventViewOpen = ref(false)
  const eventAddOpen = ref(false)
  const eventEditOpen = ref(false)
  const eventDeleteOpen = ref(false)
  const availabilityCheckerEventAddOpen = ref(false)
  const selectedEvent = ref<CalendarEvent | undefined>()

  // Actions
  function addEvent(event: CalendarEvent) {
    events.value.push(event)
  }

  function deleteEvent(id: string) {
    const index = events.value.findIndex((event) => event.id === id)
    if (index > -1) {
      events.value.splice(index, 1)
    }
  }

  function updateEvent(id: string, updatedEvent: Partial<CalendarEvent>) {
    const index = events.value.findIndex((event) => event.id === id)
    if (index > -1) {
      events.value[index] = { ...events.value[index], ...updatedEvent }
    }
  }

  function setEventViewOpen(value: boolean) {
    eventViewOpen.value = value
  }

  function setEventAddOpen(value: boolean) {
    eventAddOpen.value = value
  }

  function setEventEditOpen(value: boolean) {
    eventEditOpen.value = value
  }

  function setEventDeleteOpen(value: boolean) {
    eventDeleteOpen.value = value
  }

  function setAvailabilityCheckerEventAddOpen(value: boolean) {
    availabilityCheckerEventAddOpen.value = value
  }

  function setSelectedEvent(event: CalendarEvent | undefined) {
    selectedEvent.value = event
  }

  return {
    // State
    events,
    eventViewOpen,
    eventAddOpen,
    eventEditOpen,
    eventDeleteOpen,
    availabilityCheckerEventAddOpen,
    selectedEvent,
    // Actions
    addEvent,
    deleteEvent,
    updateEvent,
    setEventViewOpen,
    setEventAddOpen,
    setEventEditOpen,
    setEventDeleteOpen,
    setAvailabilityCheckerEventAddOpen,
    setSelectedEvent,
  }
})