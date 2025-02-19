<template>
  <component
    :is="type === 'link' ? 'a' : 'button'"
    :class="[
      buttonVariants({
        variant,
        size,
        class: className,
      }),
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { buttonVariants, type ButtonVariants } from '.'

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset' | 'link'
    variant?: ButtonVariants['variant']
    size?: ButtonVariants['size']
    disabled?: boolean
    class?: string
  }>(),
  {
    type: 'button',
    disabled: false,
  }
)

const className = computed(() => props.class)
</script> 