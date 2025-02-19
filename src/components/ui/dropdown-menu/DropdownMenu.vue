<template>
  <Root v-bind="$attrs">
    <slot />
  </Root>
</template>

<script setup lang="ts">
import { Root } from '@radix-ui/vue/dropdown-menu'
</script> 