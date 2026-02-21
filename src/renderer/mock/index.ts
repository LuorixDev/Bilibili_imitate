// src/renderer/mock/index.ts
import { faker } from '@faker-js/faker'
import type { User, Comment, Video } from './types'

// To ensure consistency, let's seed the faker instance
faker.seed(123)

const createMockUser = (): User => ({
  id: faker.string.uuid(),
  username: faker.internet.username(),
  avatar: faker.image.avatar(),
})

const createMockComment = (repliesCount = 0): Comment => {
  const author = createMockUser()
  const replies =
    repliesCount > 0
      ? Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () =>
          createMockComment(repliesCount - 1),
        )
      : []

  return {
    id: faker.string.uuid(),
    author,
    content: faker.lorem.sentence(),
    timestamp: faker.date.past(),
    likes: faker.number.int({ min: 0, max: 1000 }),
    replies,
  }
}

const createMockVideo = (): Video => {
  const author = createMockUser()
  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(5),
    description: faker.lorem.paragraphs(3),
    author,
    cover: faker.image.urlLoremFlickr({ category: 'nature' }),
    url: 'https://www.w3schools.com/html/mov_bbb.mp4', // Placeholder video
    views: faker.number.int({ min: 1000, max: 10000000 }),
    likes: faker.number.int({ min: 100, max: 500000 }),
    duration: faker.number.int({ min: 60, max: 1800 }),
    createdAt: faker.date.past(),
    comments: Array.from({ length: faker.number.int({ min: 5, max: 25 }) }, () =>
      createMockComment(faker.number.int({ min: 0, max: 2 })),
    ),
  }
}

export const createMockDB = (videoCount = 20) => {
  const db: { videos: Video[] } = {
    videos: [],
  }
  for (let i = 0; i < videoCount; i++) {
    db.videos.push(createMockVideo())
  }
  return db
}