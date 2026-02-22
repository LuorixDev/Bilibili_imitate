import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import VideoView from '../views/VideoView.vue';
import SearchView from '../views/SearchView.vue';
import HistoryView from '../views/HistoryView.vue';
import UserView from '../views/UserView.vue';
import CategoryView from '../views/CategoryView.vue';
import LiveView from '../views/LiveView.vue';
import HotView from '../views/HotView.vue';
import SettingView from '../views/SettingView.vue';
import DynamicView from '../views/DynamicView.vue';
import MyView from '../views/MyView.vue';
import UserInfoView from '../views/UserInfoView.vue';
import LiveDetailView from '../views/LiveDetailView.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/category', name: 'category', component: CategoryView },
    { path: '/live', name: 'live', component: LiveView },
    { path: '/live/:id', name: 'live-detail', component: LiveDetailView, props: true },
    { path: '/hot', name: 'hot', component: HotView },
    { path: '/dynamic', name: 'dynamic', component: DynamicView },
    { path: '/my', name: 'my', component: MyView },
    { path: '/video/:id', name: 'video', component: VideoView, props: true },
    { path: '/search', name: 'search', component: SearchView },
    { path: '/history', name: 'history', component: HistoryView },
    { path: '/user', name: 'user', component: UserView },
    { path: '/userinfo/:id', name: 'userinfo', component: UserInfoView, props: true },
    { path: '/setting', name: 'setting', component: SettingView },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
