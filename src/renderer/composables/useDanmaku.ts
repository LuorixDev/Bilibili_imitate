import { ref } from 'vue';
import type { DanmakuItem } from '../types';

export interface ActiveDanmaku {
  id: string;
  text: string;
  color: string;
  top: number;
  duration: number;
}

export const useDanmaku = () => {
  const active = ref<ActiveDanmaku[]>([]);
  const tracks = 8;

  const push = (item: DanmakuItem) => {
    const track = Math.floor(Math.random() * tracks);
    const duration = 8 + Math.random() * 4;
    const entity: ActiveDanmaku = {
      id: item.id,
      text: item.text,
      color: item.color,
      top: 12 + track * 28,
      duration,
    };
    active.value = [...active.value, entity];
    setTimeout(() => {
      active.value = active.value.filter((entry) => entry.id !== item.id);
    }, duration * 1000);
  };

  const clear = () => {
    active.value = [];
  };

  return {
    active,
    push,
    clear,
  };
};
