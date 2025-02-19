<template>
  <Trigger
    :class="[
      'flex h-10 w-10 items-center justify-center rounded-md border border-input bg-transparent p-0 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
      className,
    ]"
    v-bind="$attrs"
  >
    <slot />
  </Trigger>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Trigger } from '@radix-ui/vue/dropdown-menu'

const props = defineProps<{
  class?: string
}>()

const className = computed(() => props.class)
</script> 