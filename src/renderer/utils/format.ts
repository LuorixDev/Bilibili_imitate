export const formatCount = (count: number) => {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}w`;
  }
  return count.toString();
};

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
};

export const formatDateTime = (iso: string) => {
  const date = new Date(iso);
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date
    .getHours()
    .toString()
    .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};
