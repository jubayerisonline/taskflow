import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern_todo_app';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error to ${uri}: ${error.message}`);
    console.warn('\n================================================================');
    console.warn('⚠️  MONGODB CONNECTION NOTICE');
    console.warn('Could not establish connection to MongoDB at:');
    console.warn(`  ${uri}`);
    console.warn('\nTo connect to MongoDB:');
    console.warn('1. For Local MongoDB: Ensure mongod is running on port 27017.');
    console.warn('2. For MongoDB Atlas (Free Cloud): Set MONGO_URI in backend/.env:');
    console.warn('   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mern_todo_app?retryWrites=true&w=majority');
    console.warn('================================================================\n');
    return null;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('[MongoDB] Disconnected successfully');
  } catch (error) {
    console.error('[MongoDB] Disconnect error:', error.message);
  }
};
