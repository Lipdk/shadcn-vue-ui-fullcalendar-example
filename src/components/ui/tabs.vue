<script setup lang="ts">
import { TabsRoot } from 'radix-vue'
import { cn } from '@/utils'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  class?: string
  defaultValue?: string
}>()
</script>

<template>
  <TabsRoot v-bind="$attrs" :default-value="defaultValue" :class="cn('', props.class)">
    <slot />
  </TabsRoot>
</template>