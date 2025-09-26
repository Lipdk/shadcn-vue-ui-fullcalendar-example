<script setup lang="ts">
import { Separator as SeparatorPrimitive } from 'radix-vue'
import { cn } from '@/utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  class?: string
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
}>(), {
  orientation: 'horizontal',
  decorative: true,
})
</script>

<template>
  <SeparatorPrimitive
    v-bind="$attrs"
    :decorative="decorative"
    :orientation="orientation"
    :class="cn(
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      props.class,
    )"
  />
</template>