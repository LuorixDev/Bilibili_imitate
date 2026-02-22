<template>
  <div class="video-view">
    <!-- 视频播放区 -->
    <div class="player-section">
      <VideoPlayer
        :src="video?.videoUrl || ''"
        :danmaku-list="danmakuList"
        :show-danmaku="true"
        :auto-play="true"
        @play="onPlay"
        @timeupdate="onTimeUpdate"
        @ended="onEnded"
        ref="playerRef"
      />
    </div>
    
    <!-- 视频信息区 -->
    <div class="info-section">
      <div class="video-header">
        <h1 class="video-title">{{ video?.title }}</h1>
        <div class="video-stats">
          <span class="stat-item">
            <PlayCircleIcon class="icon" />
            {{ formatNumber(video?.views || 0) }} 播放
          </span>
          <span class="stat-item">
            <MessageSquareIcon class="icon" />
            {{ formatNumber(video?.comments || 0) }} 弹幕
          </span>
          <span class="stat-item">
            <ClockIcon class="icon" />
            {{ video?.publishTime }}
          </span>
        </div>
      </div>
      
      <div class="video-actions">
        <button
          class="action-btn"
          :class="{ active: isLiked }"
          @click="toggleLike"
        >
          <ThumbsUpIcon class="icon" />
          <span>{{ formatNumber(video?.likes || 0) }}</span>
        </button>
        <button
          class="action-btn"
          :class="{ active: isCollected }"
          @click="toggleCollect"
        >
          <StarIcon class="icon" />
          <span>{{ formatNumber(video?.collects || 0) }}</span>
        </button>
        <button
          class="action-btn"
          :class="{ active: isCoined }"
          @click="toggleCoin"
        >
          <CoinsIcon class="icon" />
          <span>{{ formatNumber(video?.coins || 0) }}</span>
        </button>
        <button class="action-btn" @click="share">
          <Share2Icon class="icon" />
          <span>分享</span>
        </button>
      </div>
      
      <!-- UP主信息 -->
      <div class="up-info" v-if="video">
        <img :src="video.author?.avatar" class="up-avatar" @click="goToUser" />
        <div class="up-meta">
          <div class="up-name" @click="goToUser">{{ video.author?.name }}</div>
          <div class="up-desc">{{ video.authorDesc || '这个人很懒，什么都没有写~' }}</div>
        </div>
        <button
          class="follow-btn"
          :class="{ followed: isFollowing }"
          @click="toggleFollow"
        >
          {{ isFollowing ? '已关注' : '+ 关注' }}
        </button>
      </div>
      
      <!-- 视频简介 -->
      <div class="video-desc">
        <p>{{ video?.description || '暂无简介' }}</p>
        <div class="video-tags">
          <span v-for="tag in video?.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
    </div>
    
    <!-- 评论区 -->
    <div class="comment-section">
      <div class="comment-header">
        <h3>评论 ({{ comments.length }})</h3>
        <div class="comment-sort">
          <span
            :class="{ active: sortBy === 'hot' }"
            @click="sortBy = 'hot'"
          >最热</span>
          <span
            :class="{ active: sortBy === 'time' }"
            @click="sortBy = 'time'"
          >最新</span>
        </div>
      </div>
      
      <!-- 评论输入 -->
      <div class="comment-input-area">
        <img :src="userStore.userInfo?.avatar || '/default-avatar.png'" class="user-avatar" />
        <div class="input-wrapper">
          <textarea
            v-model="commentText"
            placeholder="发一条友善的评论~"
            rows="3"
          ></textarea>
          <div class="input-actions">
            <button class="submit-btn" @click="submitComment" :disabled="!commentText.trim()">
              发表评论
            </button>
          </div>
        </div>
      </div>
      
      <!-- 评论列表 -->
      <div class="comment-list">
        <CommentItem
          v-for="comment in sortedComments"
          :key="comment.id"
          :comment="comment"
          @reply="replyComment"
          @like="likeComment"
        />
      </div>
    </div>
    
    <!-- 相关推荐 -->
    <div class="recommend-section">
      <h3 class="section-title">相关推荐</h3>
      <div class="recommend-list">
        <VideoCard
          v-for="v in recommendVideos"
          :key="v.id"
          :video="v"
          @click="goToVideo(v)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  PlayCircleIcon,
  MessageSquareIcon,
  ClockIcon,
  ThumbsUpIcon,
  StarIcon,
  CoinsIcon,
  Share2Icon
} from 'lucide-vue-next'
import VideoPlayer from '@/components/VideoPlayer/index.vue'
import VideoCard from '@/components/VideoCard.vue'
import CommentItem from '@/components/CommentItem.vue'
import { useUserStore } from '@/stores/user'
import { useHistoryStore } from '@/stores/history'
import { videoApi } from '@/api/videoApi'
import { commentApi } from '@/api/commentApi'
import { danmakuApi } from '@/api/danmakuApi'
import type { Video, VideoDetail, Comment, Danmaku } from '@/types'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const historyStore = useHistoryStore()

// Refs
const playerRef = ref<InstanceType<typeof VideoPlayer>>()
const video = ref<VideoDetail | null>(null)
const danmakuList = ref<Danmaku[]>([])
const comments = ref<Comment[]>([])
const recommendVideos = ref<Video[]>([])
const commentText = ref('')
const sortBy = ref<'hot' | 'time'>('hot')

// State
const isLiked = ref(false)
const isCollected = ref(false)
const isCoined = ref(false)
const isFollowing = ref(false)

// Computed
const videoId = computed(() => route.params.id as string)

const sortedComments = computed(() => {
  const list = [...comments.value]
  if (sortBy.value === 'hot') {
    return list.sort((a, b) => b.likes - a.likes)
  }
  return list.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
})

// Methods
const loadVideo = async () => {
  try {
    const res = await videoApi.getVideoDetail(videoId.value)
    video.value = res.data
    document.title = `${video.value?.title} - Bilibili`
  } catch (e) {
    console.error('加载视频失败:', e)
  }
}

const loadDanmaku = async () => {
  try {
    const res = await danmakuApi.getDanmaku(videoId.value)
    danmakuList.value = res.data
  } catch (e) {
    console.error('加载弹幕失败:', e)
  }
}

const loadComments = async () => {
  try {
    const res = await commentApi.getComments(videoId.value)
    comments.value = res.data
  } catch (e) {
    console.error('加载评论失败:', e)
  }
}

const loadRecommend = async () => {
  try {
    const res = await videoApi.getRecommendVideos(6)
    recommendVideos.value = res.data
  } catch (e) {
    console.error('加载推荐失败:', e)
  }
}

const onPlay = () => {
  if (video.value) {
    historyStore.addToHistory(video.value)
  }
}

const onTimeUpdate = (time: number) => {
  // 可以在这里实现观看进度保存
}

const onEnded = () => {
  // 自动播放下一个
}

const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

const toggleLike = () => {
  isLiked.value = !isLiked.value
  if (video.value) {
    video.value.likes += isLiked.value ? 1 : -1
  }
}

const toggleCollect = () => {
  isCollected.value = !isCollected.value
  if (video.value) {
    video.value.collects += isCollected.value ? 1 : -1
  }
}

const toggleCoin = () => {
  if (!isCoined.value && video.value) {
    isCoined.value = true
    video.value.coins += 1
  }
}

const share = () => {
  // 实现分享功能
}

const goToUser = () => {
  if (video.value?.author?.id) {
    router.push(`/user/${video.value.author.id}`)
  }
}

const toggleFollow = () => {
  isFollowing.value = !isFollowing.value
}

const submitComment = async () => {
  if (!commentText.value.trim()) return
  
  try {
    const res = await commentApi.postComment(videoId.value, commentText.value)
    comments.value.unshift(res.data)
    commentText.value = ''
  } catch (e) {
    console.error('发表评论失败:', e)
  }
}

const replyComment = (comment: Comment) => {
  commentText.value = `回复 @${comment.author.name}: `
}

const likeComment = async (commentId: string) => {
  try {
    await commentApi.likeComment(commentId)
    const comment = comments.value.find(c => c.id === commentId)
    if (comment) {
      comment.likes += 1
    }
  } catch (e) {
    console.error('点赞评论失败:', e)
  }
}

const goToVideo = (v: Video) => {
  router.push(`/video/${v.id}`)
}

// Watch for route changes
watch(() => route.params.id, () => {
  loadVideo()
  loadDanmaku()
  loadComments()
  window.scrollTo(0, 0)
})

onMounted(() => {
  loadVideo()
  loadDanmaku()
  loadComments()
  loadRecommend()
})
</script>

<style scoped>
.video-view {
  padding-bottom: 40px;
}

.player-section {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
}

.info-section {
  padding: 20px;
  background: white;
  margin-bottom: 12px;
}

.video-header {
  margin-bottom: 16px;
}

.video-title {
  font-size: 20px;
  font-weight: 600;
  color: #18191c;
  line-height: 1.5;
  margin-bottom: 12px;
}

.video-stats {
  display: flex;
  gap: 20px;
  color: #9499a0;
  font-size: 13px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-item .icon {
  width: 16px;
  height: 16px;
}

.video-actions {
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #f1f2f3;
  margin-bottom: 16px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid #e3e5e7;
  border-radius: 8px;
  background: white;
  color: #61666d;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f1f2f3;
}

.action-btn.active {
  background: #fb7299;
  color: white;
  border-color: #fb7299;
}

.action-btn .icon {
  width: 18px;
  height: 18px;
}

.up-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.up-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
}

.up-meta {
  flex: 1;
}

.up-name {
  font-size: 15px;
  font-weight: 500;
  color: #18191c;
  cursor: pointer;
  margin-bottom: 4px;
}

.up-desc {
  font-size: 13px;
  color: #9499a0;
}

.follow-btn {
  padding: 8px 20px;
  border-radius: 4px;
  border: none;
  background: #fb7299;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.follow-btn.followed {
  background: #f1f2f3;
  color: #9499a0;
}

.follow-btn:hover {
  opacity: 0.9;
}

.video-desc {
  color: #18191c;
  line-height: 1.8;
  font-size: 14px;
}

.video-desc p {
  margin-bottom: 12px;
}

.video-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 4px 12px;
  background: #f1f2f3;
  border-radius: 12px;
  font-size: 12px;
  color: #61666d;
}

.comment-section {
  background: white;
  padding: 20px;
  margin-bottom: 12px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.comment-header h3 {
  font-size: 18px;
  font-weight: 600;
}

.comment-sort {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #9499a0;
}

.comment-sort span {
  cursor: pointer;
}

.comment-sort span.active {
  color: #18191c;
  font-weight: 500;
}

.comment-input-area {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.input-wrapper {
  flex: 1;
}

.input-wrapper textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e3e5e7;
  border-radius: 8px;
  resize: none;
  font-size: 14px;
  font-family: inherit;
}

.input-wrapper textarea:focus {
  outline: none;
  border-color: #fb7299;
}

.input-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.submit-btn {
  padding: 8px 24px;
  background: #fb7299;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.submit-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.submit-btn:disabled {
  background: #e3e5e7;
  cursor: not-allowed;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.recommend-section {
  background: white;
  padding: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.recommend-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}
</style>
