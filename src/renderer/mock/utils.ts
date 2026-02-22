import type { Paginated } from '../types';

const randomRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const pick = <T>(list: T[]) => list[randomRange(0, list.length - 1)];

export const withLatency = async <T>(fn: () => T, delay = 320): Promise<T> => {
  await new Promise((resolve) => setTimeout(resolve, delay + randomRange(0, 260)));
  return fn();
};

export const paginate = <T>(items: T[], page: number, pageSize: number): Paginated<T> => {
  const start = (page - 1) * pageSize;
  const list = items.slice(start, start + pageSize);
  return {
    list,
    page,
    pageSize,
    total: items.length,
  };
};

let idSeed = 1000;
export const createId = () => `${Date.now()}_${idSeed++}`;

export const clone = <T>(data: T): T => JSON.parse(JSON.stringify(data));
