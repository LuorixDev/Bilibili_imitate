import type { CommentItem, DanmakuItem, UserProfile, VideoSummary } from '../types';
import { createId, pick } from './utils';

const coverPool = [
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1500534314209-a26db0f5c9f4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
];

const videoPool = [
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/forest.mp4',
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/river.mp4',
];

const authorPool = [
  '星河记录仪',
  '猫咪研究社',
  '像素旅者',
  '轻音实验室',
  '城市漫游者',
  '深夜书房',
  '弦外之音',
  '奇遇制作组',
];

const tagPool = ['科技', '音乐', '旅行', 'Vlog', '数码', '剧情', '街访', '动画'];

const commentPool = [
  '画面好细腻！',
  '节奏很舒服，适合下班放松。',
  '这个选题太有趣了，期待下一期。',
  'BGM 好评，剪辑也很丝滑。',
  '有被治愈到，收藏了。',
  '信息量很足，建议多看几遍。',
  '评论区集合！',
  'UP 主答应我别断更。',
];

const danmakuPool = ['绝了', '给力', '好顶', '太会了', '泪目', '冲啊', '继续', '哈哈哈'];

const createUsers = (): UserProfile[] =>
  authorPool.map((name, index) => ({
    id: `user_${index + 1}`,
    name,
    avatar: `https://i.pravatar.cc/150?img=${index + 10}`,
    bio: '专注分享生活与灵感，持续更新中。',
    level: 3 + index,
    followers: 2000 + index * 340,
    following: 120 + index * 11,
    likes: 8800 + index * 640,
  }));

const createVideos = (users: UserProfile[]): VideoSummary[] => {
  const titles = [
    '把城市的夜色装进相机里',
    '一次随性出发的周末旅行',
    '桌面布置大改造，效率翻倍',
    '这首歌的和弦太温柔了',
    '深夜电台：写给自己的信',
    '对话一位独立摄影师',
    '用三分钟讲清一个冷知识',
    '剧本杀幕后的一天',
    '电子产品收纳实用技巧',
    '做一份属于自己的生活计划',
    '雨天漫游城市',
    '一分钟学会一个剪辑技巧',
    '早晨五点的街道有多安静',
    '手机也能拍出电影感',
    '旅行装备清单分享',
    '把工作流整理得清清楚楚',
    '一个人的工作室巡礼',
    '最能打动人的画面在哪里',
  ];

  return titles.map((title, index) => {
    const author = users[index % users.length];
    return {
      id: `video_${index + 1}`,
      title,
      cover: coverPool[index % coverPool.length],
      duration: 120 + index * 14,
      views: 6000 + index * 880,
      likes: 1500 + index * 210,
      author: {
        id: author.id,
        name: author.name,
        avatar: author.avatar,
      },
      publishAt: new Date(Date.now() - index * 86400000).toISOString(),
      tags: [pick(tagPool), pick(tagPool)],
      description: '这是一段关于生活、灵感与表达的故事，欢迎一起交流。',
      src: videoPool[index % videoPool.length],
    };
  });
};

const createComments = (videos: VideoSummary[], users: UserProfile[]): CommentItem[] => {
  const items: CommentItem[] = [];
  videos.forEach((video) => {
    const count = 6 + (Number(video.id.replace('video_', '')) % 6);
    for (let i = 0; i < count; i += 1) {
      const user = users[(i + 2) % users.length];
      items.push({
        id: createId(),
        videoId: video.id,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        content: pick(commentPool),
        createdAt: new Date(Date.now() - (i + 2) * 3600000).toISOString(),
        likes: 20 + i * 3,
        replies: [],
      });
    }
  });
  return items;
};

const createDanmaku = (videos: VideoSummary[], users: UserProfile[]): DanmakuItem[] => {
  const items: DanmakuItem[] = [];
  videos.forEach((video) => {
    for (let i = 0; i < 18; i += 1) {
      const user = users[(i + 1) % users.length];
      items.push({
        id: createId(),
        videoId: video.id,
        userId: user.id,
        text: pick(danmakuPool),
        time: i * 4 + 2,
        color: i % 2 === 0 ? '#ffffff' : '#ff6aa3',
        createdAt: new Date(Date.now() - i * 60000).toISOString(),
      });
    }
  });
  return items;
};

const users = createUsers();
const videos = createVideos(users);

export const db = {
  users,
  videos,
  comments: createComments(videos, users),
  danmaku: createDanmaku(videos, users),
  currentUserId: null as string | null,
};
