<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

// Apply the global theme
useTheme()
</script>

<template>
  <router-view />
</template>

<style>
/* You can add global styles here if needed */
#app {
  width: 100%;
  height: 100%;
  background-color: var(--bg-color);
}
</style>
