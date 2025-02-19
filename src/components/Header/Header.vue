<template>
  <header class="fixed top-0 left-0 box-border px-4 sm:px-6 flex justify-center w-screen h-max backdrop-blur-lg bg-background/80 border-b border-border z-50 transition-colors">
    <div class="flex justify-between items-center w-full max-w-[1666px] h-14">
      <div class="logo w-max h-full flex items-center gap-4">
        <img class="w-auto h-3/5 object-contain dark:invert" src="@/assets/images/logo.webp" />
        <a class="text-lg font-bold text-foreground transition-colors" href="/">{{ props.title }}</a>
      </div>
      <div class="flex items-center gap-4">
        <h3 class="w-max h-max text-sm text-muted-foreground hidden sm:block transition-colors">{{ props.desc }}</h3>
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue'
const props = defineProps(['title', 'desc'])
</script>
