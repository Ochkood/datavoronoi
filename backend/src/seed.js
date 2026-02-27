require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const User = require('./models/User');
const Category = require('./models/Category');
const Topic = require('./models/Topic');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const Bookmark = require('./models/Bookmark');

async function run() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing in .env');
  }

  await connectDB(process.env.MONGO_URI);

  await Promise.all([
    Bookmark.deleteMany({}),
    Comment.deleteMany({}),
    Post.deleteMany({}),
    Topic.deleteMany({}),
    Category.deleteMany({}),
    User.deleteMany({}),
  ]);

  const [admin, publisher1, publisher2] = await User.create([
    {
      name: 'Admin User',
      email: 'admin@datanews.mn',
      password: 'Admin1234',
      role: 'admin',
      avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=admin',
    },
    {
      name: 'Б. Болормаа',
      email: 'bolormaa@datanews.mn',
      password: 'Publisher123',
      role: 'publisher',
      avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=bolormaa',
    },
    {
      name: 'Д. Ганзориг',
      email: 'ganzorig@datanews.mn',
      password: 'Publisher123',
      role: 'publisher',
      avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=ganzorig',
    },
  ]);

  const categories = await Category.insertMany([
    {
      name: 'Эдийн засаг',
      slug: 'economy',
      description: 'Эдийн засгийн дата, шинжилгээ',
      icon: 'TrendingUp',
      color: 'chart-1',
      bannerImage: '/images/infographic-1.jpg',
    },
    {
      name: 'Технологи',
      slug: 'technology',
      description: 'Технологи, AI, инноваци',
      icon: 'Cpu',
      color: 'chart-2',
      bannerImage: '/images/infographic-4.jpg',
    },
    {
      name: 'Байгаль орчин',
      slug: 'environment',
      description: 'Уур амьсгал, тогтвортой хөгжил',
      icon: 'Leaf',
      color: 'chart-4',
      bannerImage: '/images/infographic-2.jpg',
    },
    {
      name: 'Санхүү',
      slug: 'finance',
      description: 'Санхүү, крипто, хөрөнгийн зах зээл',
      icon: 'Wallet',
      color: 'chart-5',
      bannerImage: '/images/infographic-6.jpg',
    },
  ]);

  const topics = await Topic.insertMany([
    {
      name: 'AI Хувьсгал',
      slug: 'ai-revolution',
      description: 'Хиймэл оюуны салбарын өөрчлөлт',
      image: '/images/infographic-7.jpg',
      featured: true,
      startDate: new Date('2025-01-01'),
    },
    {
      name: 'COP29',
      slug: 'cop29',
      description: 'Уур амьсгалын бага хурлын дата',
      image: '/images/infographic-2.jpg',
      featured: true,
      startDate: new Date('2024-11-11'),
      endDate: new Date('2024-11-22'),
    },
  ]);

  const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
  const topicBySlug = Object.fromEntries(topics.map((t) => [t.slug, t]));

  await Post.insertMany([
    {
      title: 'Монголын ДНБ-ний өсөлт: Сүүлийн 10 жилийн дата шинжилгээ',
      excerpt: 'Монголын эдийн засгийн өсөлтийн чиг хандлагыг датагаар харууллаа.',
      content: '<p>Энэ бол seed контент юм.</p>',
      featuredImage: '/images/infographic-1.jpg',
      status: 'published',
      visibility: 'public',
      author: publisher1._id,
      category: categoryBySlug.economy._id,
      topics: [topicBySlug['ai-revolution']._id],
      publishedAt: new Date(),
      viewsCount: 12400,
      likesCount: 230,
      commentsCount: 12,
    },
    {
      title: 'AI салбарын өсөлт ба хөрөнгө оруулалт',
      excerpt: 'Хиймэл оюуны салбарын хөрөнгө оруулалтын өсөлтийн тренд.',
      content: '<p>AI контент.</p>',
      featuredImage: '/images/infographic-7.jpg',
      status: 'published',
      visibility: 'public',
      author: publisher2._id,
      category: categoryBySlug.technology._id,
      topics: [topicBySlug['ai-revolution']._id],
      publishedAt: new Date(),
      viewsCount: 8900,
      likesCount: 120,
      commentsCount: 5,
    },
    {
      title: 'Дэлхийн сэргээгдэх эрчим хүчний хэрэглээ',
      excerpt: 'Сэргээгдэх эрчим хүчний хэрэглээний харьцуулалт.',
      content: '<p>Environment content.</p>',
      featuredImage: '/images/infographic-2.jpg',
      status: 'published',
      visibility: 'public',
      author: publisher2._id,
      category: categoryBySlug.environment._id,
      topics: [topicBySlug.cop29._id],
      publishedAt: new Date(),
      viewsCount: 5600,
      likesCount: 80,
      commentsCount: 3,
    },
    {
      title: 'Крипто зах зээлийн 2026 оны төлөв',
      excerpt: 'Bitcoin, Ethereum гол үзүүлэлтүүд.',
      content: '<p>Finance content.</p>',
      featuredImage: '/images/infographic-6.jpg',
      status: 'published',
      visibility: 'public',
      author: publisher1._id,
      category: categoryBySlug.finance._id,
      topics: [],
      publishedAt: new Date(),
      viewsCount: 3400,
      likesCount: 41,
      commentsCount: 2,
    },
  ]);

  console.log('Seed completed');
  console.log('Admin login: admin@datanews.mn / Admin1234');

  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error('Seed failed:', err.message);
  try {
    await mongoose.disconnect();
  } catch (e) {
    // ignore disconnect error
  }
  process.exit(1);
});
