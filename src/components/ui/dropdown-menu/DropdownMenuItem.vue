<template>
  <Item
    :class="[
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    ]"
    v-bind="$attrs"
  >
    <slot />
  </Item>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Item } from '@radix-ui/vue/dropdown-menu'

const props = defineProps<{
  class?: string
}>()

const className = computed(() => props.class)
</script> 