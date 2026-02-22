<template>
  <div v-if="isPlayerRoute" class="player-shell">
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
  <div v-else class="app">
    <SideMenu class="sidebar app-region" />
    <div class="right-panel">
      <HeaderBar class="app-region" />
      <main ref="mainRef" class="main">
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
        <button v-show="showBackToTop" class="backtoTop no-app-region" @click="scrollToTop">
          <BaseIcon name="up" :size="18" />
        </button>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import HeaderBar from './components/HeaderBar.vue';
import SideMenu from './components/SideMenu.vue';
import BaseIcon from './components/BaseIcon.vue';

const route = useRoute();
const isPlayerRoute = computed(() => route.name === 'video' || route.name === 'live-detail');

const mainRef = ref<HTMLElement | null>(null);
const showBackToTop = ref(false);

const onScroll = () => {
  showBackToTop.value = (mainRef.value?.scrollTop || 0) > 400;
};

const scrollToTop = () => {
  mainRef.value?.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  mainRef.value?.addEventListener('scroll', onScroll);
});

onUnmounted(() => {
  mainRef.value?.removeEventListener('scroll', onScroll);
});
</script>
