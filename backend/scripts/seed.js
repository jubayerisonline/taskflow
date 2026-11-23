import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Todo from '../models/Todo.js';
import { connectDB } from '../config/db.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seed] Clearing existing Users and Todos...');
    await Todo.deleteMany({});
    await User.deleteMany({});

    console.log('[Seed] Creating demo users...');
    const demoUser = await User.create({
      name: 'Alex Johnson',
      email: 'demo@taskflow.dev',
      password: 'password123',
      bio: 'Full-Stack Developer & Product Enthusiast. Getting things done every day!',
      preferences: {
        theme: 'light',
        notificationsEnabled: true,
      },
    });

    const secondUser = await User.create({
      name: 'Sarah Connor',
      email: 'sarah@example.com',
      password: 'password123',
      bio: 'Systems Architect & Security Engineer',
      preferences: {
        theme: 'dark',
        notificationsEnabled: false,
      },
    });

    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    console.log('[Seed] Creating sample todos for Alex Johnson...');
    const demoTodos = [
      {
        title: 'Complete SaaS Dashboard UI Redesign',
        description: 'Implement modern glassmorphism styling, Tailwind theme variables, and responsive layout.',
        category: 'Work',
        priority: 'High',
        status: 'Pending',
        dueDate: new Date(now.getTime() + oneDay),
        user: demoUser._id,
      },
      {
        title: 'Review Pull Request for MongoDB Indexing',
        description: 'Verify compound index on user and status fields to guarantee fast queries.',
        category: 'Work',
        priority: 'High',
        status: 'Completed',
        dueDate: new Date(now.getTime() - oneDay),
        completedAt: new Date(now.getTime() - oneDay / 2),
        user: demoUser._id,
      },
      {
        title: 'Morning 5km Jog & Stretch',
        description: 'Stay fit and clear the mind before starting sprint planning.',
        category: 'Health',
        priority: 'Medium',
        status: 'Completed',
        dueDate: new Date(now.getTime() - oneDay),
        completedAt: new Date(now.getTime() - 2 * oneDay),
        user: demoUser._id,
      },
      {
        title: 'Learn Advanced KaTeX & Mathematical Modeling',
        description: 'Study formulas and system dynamics for algorithm optimization.',
        category: 'Study',
        priority: 'Low',
        status: 'Pending',
        dueDate: new Date(now.getTime() + 4 * oneDay),
        user: demoUser._id,
      },
      {
        title: 'Submit Quarterly Tax Documents',
        description: 'Collect all invoices and receipts from Q3 and upload to accountant portal.',
        category: 'Finance',
        priority: 'High',
        status: 'Pending',
        dueDate: new Date(now.getTime() - 2 * oneDay), // Overdue!
        user: demoUser._id,
      },
      {
        title: 'Weekly Grocery Shopping',
        description: 'Buy fresh vegetables, fruits, almond milk, and whole grains.',
        category: 'Shopping',
        priority: 'Medium',
        status: 'Pending',
        dueDate: new Date(now.getTime() + 2 * oneDay),
        user: demoUser._id,
      },
      {
        title: 'Plan Weekend Trip to Mountain Resort',
        description: 'Book cabin, map out hiking trails, and pack hiking gear.',
        category: 'Personal',
        priority: 'Low',
        status: 'Pending',
        dueDate: new Date(now.getTime() + 5 * oneDay),
        user: demoUser._id,
      },
    ];

    await Todo.insertMany(demoTodos);

    console.log('[Seed] Creating sample todos for Sarah Connor (Data Isolation check)...');
    await Todo.create({
      title: 'Confidential System Audit for Skynet Prevention',
      description: 'Private task belonging only to Sarah Connor.',
      category: 'Work',
      priority: 'High',
      status: 'Pending',
      dueDate: new Date(now.getTime() + 3 * oneDay),
      user: secondUser._id,
    });

    console.log('----------------------------------------------------');
    console.log('✅ Database seeded successfully!');
    console.log('Demo Credentials:');
    console.log('Email:    demo@taskflow.dev');
    console.log('Password: password123');
    console.log('----------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
