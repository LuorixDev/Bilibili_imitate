<template>
  <div class="skeleton-grid">
    <div v-for="n in count" :key="n" class="card">
      <div class="thumb shimmer"></div>
      <div class="line short shimmer"></div>
      <div class="line shimmer"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  count?: number;
}

withDefaults(defineProps<Props>(), {
  count: 12,
});
</script>

<style scoped>
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0;
}

.card {
  padding: 10px 20px 0 20px;
}

.thumb {
  width: 100%;
  height: 140px;
  border-radius: 8px;
}

.line {
  height: 12px;
  margin-top: 10px;
  border-radius: 6px;
}

.line.short {
  width: 60%;
}

.shimmer {
  background: linear-gradient(
    90deg,
    var(--skeleton-base) 0%,
    var(--skeleton-highlight) 50%,
    var(--skeleton-base) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 1600px) {
  .skeleton-grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

@media (max-width: 1300px) {
  .skeleton-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
