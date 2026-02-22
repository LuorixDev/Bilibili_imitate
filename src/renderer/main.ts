import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './styles/variables.css';
import './styles/base.css';
import './styles/layout.css';
import { initThemeSync, loadTheme } from './utils/theme';

const app = createApp(App);

loadTheme();
initThemeSync();

app.use(createPinia());
app.use(router);

app.mount('#app');
