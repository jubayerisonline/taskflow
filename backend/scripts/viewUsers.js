import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { memoryStore } from '../config/memoryStore.js';

dotenv.config();

const viewUsers = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern_todo_app';

  console.log('\n======================================================');
  console.log('🔍 FETCHING USERS FROM DATABASE');
  console.log('======================================================\n');

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log(`[Connected to MongoDB] Database: ${conn.connection.name}\n`);

    const users = await mongoose.connection.collection('users').find({}).toArray();

    if (users.length === 0) {
      console.log('No users found in MongoDB collection "users".');
    } else {
      console.log(`Found ${users.length} user(s) in MongoDB:\n`);
      users.forEach((u, i) => {
        console.log(`[User #${i + 1}]`);
        console.log(`  ID:        ${u._id}`);
        console.log(`  Name:      ${u.name}`);
        console.log(`  Email:     ${u.email}`);
        console.log(`  Created:   ${u.createdAt}`);
        console.log('------------------------------------------------------');
      });
    }

    process.exit(0);
  } catch (error) {
    console.warn(`Could not connect to external MongoDB: ${error.message}`);
    console.log('\n[Development Store Users]:');
    memoryStore.users.forEach((u, i) => {
      console.log(`[User #${i + 1}]`);
      console.log(`  ID:        ${u._id}`);
      console.log(`  Name:      ${u.name}`);
      console.log(`  Email:     ${u.email}`);
      console.log(`  Created:   ${u.createdAt}`);
      console.log('------------------------------------------------------');
    });
    process.exit(0);
  }
};

viewUsers();
