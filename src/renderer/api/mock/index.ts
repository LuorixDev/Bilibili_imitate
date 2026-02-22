import type { Video, VideoDetail, Comment, Danmaku, UserStats } from '../../types'

// Mock 数据生成工具
const mockVideos: Video[] = [
  {
    id: '1',
    title: '【4K HDR】B站画质测试 你的设备能流畅播放吗？',
    cover: 'https://picsum.photos/400/225?random=1',
    duration: 185,
    author: {
      id: 'u1',
      name: '科技美学',
      avatar: 'https://picsum.photos/100/100?random=11'
    },
    views: 1250000,
    likes: 45600,
    comments: 3200,
    publishTime: '2024-01-15T10:30:00Z',
    category: '科技',
    tags: ['4K', 'HDR', '测试', '画质']
  },
  {
    id: '2',
    title: '耗时30天！我做出了B站最强转场合集',
    cover: 'https://picsum.photos/400/225?random=2',
    duration: 420,
    author: {
      id: 'u2',
      name: '影视飓风',
      avatar: 'https://picsum.photos/100/100?random=12'
    },
    views: 2800000,
    likes: 189000,
    comments: 5600,
    publishTime: '2024-01-14T15:20:00Z',
    category: '影视',
    tags: ['剪辑', '转场', '教程', 'PR']
  },
  {
    id: '3',
    title: '【原神】4.4版本前瞻直播完整版，新角色闲云、嘉明登场！',
    cover: 'https://picsum.photos/400/225?random=3',
    duration: 3600,
    author: {
      id: 'u3',
      name: '原神官方',
      avatar: 'https://picsum.photos/100/100?random=13'
    },
    views: 5200000,
    likes: 350000,
    comments: 45000,
    publishTime: '2024-01-13T20:00:00Z',
    category: '游戏',
    tags: ['原神', '前瞻', '新版本', '米哈游']
  },
  {
    id: '4',
    title: '挑战！在零下20度的东北吃露天烧烤是什么体验？',
    cover: 'https://picsum.photos/400/225?random=4',
    duration: 680,
    author: {
      id: 'u4',
      name: '大祥哥来了',
      avatar: 'https://picsum.photos/100/100?random=14'
    },
    views: 890000,
    likes: 78000,
    comments: 2100,
    publishTime: '2024-01-12T12:00:00Z',
    category: '美食',
    tags: ['烧烤', '东北', '户外', '冬季']
  },
  {
    id: '5',
    title: '2024年最值得期待的10款游戏大作',
    cover: 'https://picsum.photos/400/225?random=5',
    duration: 520,
    author: {
      id: 'u5',
      name: '游戏指南针',
      avatar: 'https://picsum.photos/100/100?random=15'
    },
    views: 1500000,
    likes: 92000,
    comments: 7800,
    publishTime: '2024-01-11T18:30:00Z',
    category: '游戏',
    tags: ['游戏推荐', '2024', '大作', '盘点']
  },
  {
    id: '6',
    title: '我用AI复刻了周杰伦的新歌，你能听出区别吗？',
    cover: 'https://picsum.photos/400/225?random=6',
    duration: 245,
    author: {
      id: 'u6',
      name: '音乐制作人小王',
      avatar: 'https://picsum.photos/100/100?random=16'
    },
    views: 2100000,
    likes: 156000,
    comments: 12300,
    publishTime: '2024-01-10T09:15:00Z',
    category: '音乐',
    tags: ['AI', '周杰伦', '音乐', '科技']
  },
  {
    id: '7',
    title: '【鬼畜】当刘华强买瓜遇到ChatGPT',
    cover: 'https://picsum.photos/400/225?random=7',
    duration: 188,
    author: {
      id: 'u7',
      name: '鬼畜区扛把子',
      avatar: 'https://picsum.photos/100/100?random=17'
    },
    views: 3500000,
    likes: 280000,
    comments: 8900,
    publishTime: '2024-01-09T16:45:00Z',
    category: '鬼畜',
    tags: ['鬼畜', '刘华强', 'ChatGPT', '搞笑']
  },
  {
    id: '8',
    title: '深度解析：《流浪地球3》预告片中的隐藏细节',
    cover: 'https://picsum.photos/400/225?random=8',
    duration: 890,
    author: {
      id: 'u8',
      name: '电影最TOP',
      avatar: 'https://picsum.photos/100/100?random=18'
    },
    views: 1800000,
    likes: 120000,
    comments: 6700,
    publishTime: '2024-01-08T14:20:00Z',
    category: '影视',
    tags: ['流浪地球', '解析', '科幻', '电影']
  }
]

// 生成视频详情
export const getVideoDetail = (id: string): VideoDetail => {
  const video = mockVideos.find(v => v.id === id)
  if (!video) {
    throw new Error('Video not found')
  }
  
  return {
    ...video,
    description: `这是一个示例视频描述。\n\n本视频仅供演示使用，展示了${video.title}的相关内容。\n\n喜欢的话记得一键三连哦！\n\n商务合作请联系：example@email.com`,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    relatedVideos: mockVideos.filter(v => v.id !== id).slice(0, 6),
    collects: Math.floor(Math.random() * 50000) + 1000,
    coins: Math.floor(Math.random() * 20000) + 500,
    authorDesc: `${video.author.name}的简介\n\n这是一个示例作者描述，展示了UP主的一些基本信息。\n\n喜欢我的视频请点个关注哦！`
  }
}

// 生成评论数据
export const getComments = (_videoId: string): Comment[] => {
  return [
    {
      id: 'c1',
      content: '这个视频质量真的太高了！制作精良，内容充实，已经三连支持！期待UP主的下一个作品！',
      author: {
        id: 'u10',
        name: '小明的日常',
        avatar: 'https://picsum.photos/100/100?random=21',
        level: 6
      },
      likes: 3420,
      replies: 56,
      createTime: '2024-01-15T12:30:00Z',
      isTop: true,
      children: [
        {
          id: 'c1-1',
          content: '同感！UP主做的真的很用心',
          author: {
            id: 'u11',
            name: '路人甲',
            avatar: 'https://picsum.photos/100/100?random=22',
            level: 5
          },
          likes: 128,
          replies: 0,
          createTime: '2024-01-15T13:00:00Z',
          isTop: false,
          parentId: 'c1'
        },
        {
          id: 'c1-2',
          content: '终于等到更新了！',
          author: {
            id: 'u12',
            name: '忠实粉丝',
            avatar: 'https://picsum.photos/100/100?random=23',
            level: 4
          },
          likes: 89,
          replies: 0,
          createTime: '2024-01-15T14:20:00Z',
          isTop: false,
          parentId: 'c1'
        }
      ]
    },
    {
      id: 'c2',
      content: '讲得太好了，解决了我很多困惑，感谢UP主！',
      author: {
        id: 'u13',
        name: '学习使我快乐',
        avatar: 'https://picsum.photos/100/100?random=24',
        level: 5
      },
      likes: 1890,
      replies: 23,
      createTime: '2024-01-15T11:00:00Z',
      isTop: false
    },
    {
      id: 'c3',
      content: '不懂就问，这个是怎么做到的？',
      author: {
        id: 'u14',
        name: '萌新求带',
        avatar: 'https://picsum.photos/100/100?random=25',
        level: 2
      },
      likes: 456,
      replies: 15,
      createTime: '2024-01-15T10:15:00Z',
      isTop: false,
      children: [
        {
          id: 'c3-1',
          content: '你可以看看UP主之前的教程视频',
          author: {
            id: 'u15',
            name: '热心网友',
            avatar: 'https://picsum.photos/100/100?random=26',
            level: 5
          },
          likes: 234,
          replies: 3,
          createTime: '2024-01-15T10:30:00Z',
          isTop: false,
          parentId: 'c3'
        }
      ]
    },
    {
      id: 'c4',
      content: 'UP主的声音好听，讲解也很清晰，关注了！',
      author: {
        id: 'u16',
        name: '声控党',
        avatar: 'https://picsum.photos/100/100?random=27',
        level: 4
      },
      likes: 890,
      replies: 12,
      createTime: '2024-01-14T20:00:00Z',
      isTop: false
    },
    {
      id: 'c5',
      content: '前来考古，经典永流传！',
      author: {
        id: 'u17',
        name: '考古学家',
        avatar: 'https://picsum.photos/100/100?random=28',
        level: 6
      },
      likes: 2341,
      replies: 45,
      createTime: '2024-01-14T18:30:00Z',
      isTop: false
    }
  ]
}

// 生成弹幕数据
export const getDanmaku = (_videoId: string): Danmaku[] => {
  const templates = [
    '来了来了', '前方高能', '哈哈哈', '太强了', '学到了', 
    '第一', '火钳刘明', '卧槽', '666', '经典',
    '太真实了', '泪目', ' protecting', '这就去试', '已三连',
    'UP主辛苦了', '爷青回', '梦幻联动', '双厨狂喜', '妙啊'
  ]
  
  const colors = ['#ffffff', '#fb7299', '#00b5e5', '#f3a034', '#00c853', '#ff5252']
  
  return Array.from({ length: 100 }, (_, i) => ({
    id: `d${i}`,
    text: templates[Math.floor(Math.random() * templates.length)],
    time: Math.random() * 300,
    type: Math.random() > 0.9 ? 'top' : Math.random() > 0.9 ? 'bottom' : 'scroll',
    color: colors[Math.floor(Math.random() * colors.length)],
    fontSize: Math.random() > 0.8 ? 'large' : Math.random() > 0.3 ? 'normal' : 'small',
    author: `user${Math.floor(Math.random() * 10000)}`
  }))
}

// 获取推荐视频
export const getRecommendVideos = (page = 1, pageSize = 20): Video[] => {
  // 模拟分页，生成更多随机视频
  const moreVideos: Video[] = Array.from({ length: pageSize }, (_, i) => {
    const baseIndex = (page - 1) * pageSize + i
    const template = mockVideos[i % mockVideos.length]
    return {
      ...template,
      id: `v-${baseIndex}`,
      cover: `https://picsum.photos/400/225?random=${baseIndex + 100}`,
      views: Math.floor(Math.random() * 1000000) + 10000,
      likes: Math.floor(Math.random() * 100000) + 1000
    }
  })
  return moreVideos
}

// 搜索视频
export const searchVideos = (keyword: string): Video[] => {
  if (!keyword.trim()) return []
  
  // 模拟搜索结果
  return mockVideos.filter(v => 
    v.title.toLowerCase().includes(keyword.toLowerCase()) ||
    v.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))
  ).concat(
    Array.from({ length: 10 }, (_, i) => ({
      ...mockVideos[i % mockVideos.length],
      id: `search-${i}`,
      title: `${keyword} - 搜索结果${i + 1}`,
      cover: `https://picsum.photos/400/225?random=${200 + i}`
    }))
  )
}

// 获取用户统计
export const getUserStats = (): UserStats => ({
  views: 1250000,
  likes: 89000,
  videos: 42
})

// 获取用户视频
export const getUserVideos = (): Video[] => {
  return mockVideos.slice(0, 6).map((v, i) => ({
    ...v,
    id: `user-v-${i}`,
    cover: `https://picsum.photos/400/225?random=${300 + i}`
  }))
}
