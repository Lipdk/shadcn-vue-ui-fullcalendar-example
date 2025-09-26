<script setup lang="ts">
import { TabsList } from 'radix-vue'
import { cn } from '@/utils'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  class?: string
}>()
</script>

<template>
  <TabsList
    v-bind="$attrs"
    :class="cn('inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground', props.class)"
  >
    <slot />
  </TabsList>
</template>