<template>
  <div id="app">
    <HeaderBar />
    <div class="main-container">
      <SideMenu />
      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderBar from './components/HeaderBar.vue'
import SideMenu from './components/SideMenu.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background: #f1f2f3;
  color: #18191c;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-container {
  display: flex;
  flex: 1;
  padding-top: 64px;
}

.content {
  flex: 1;
  margin-left: 200px;
  padding: 20px;
  min-height: calc(100vh - 64px);
}

@media (max-width: 768px) {
  .content {
    margin-left: 0;
    padding: 10px;
  }
}
</style>
