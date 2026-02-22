<template>
  <div class="tab-menu">
    <button
      v-for="item in items"
      :key="item"
      class="tab"
      :class="{ active: item === modelValue }"
      @click="emit('update:modelValue', item)"
    >
      {{ item }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  items: string[];
  modelValue: string;
}

defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<style scoped>
.tab-menu {
  width: 100%;
  height: 35px;
  display: flex;
  justify-content: flex-start;
  gap: 6px;
  padding-left: 20px;
}

.tab {
  padding: 4px 10px;
  font-size: 13px;
  border-radius: 5px;
  transition: all 0.2s ease;
}

.tab:hover {
  color: var(--color-primary);
}

.tab.active {
  background: #ffecf1;
  font-weight: 600;
  color: var(--color-primary);
}
</style>
