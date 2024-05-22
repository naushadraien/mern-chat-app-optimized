import mongoose from 'mongoose';

const connectDB = async (uri: string): Promise<void> => {
  try {
    const connect = await mongoose.connect(uri, {
      dbName: 'mern-chat-master',
      connectTimeoutMS: 30000,
      socketTimeoutMS: 60000,
    });
    console.log(`Connected to DB at ${connect.connection.host}`);
    console.log('\x1b[92m' + '💾 Connected to MongoDB' + '\x1b[0m');
    console.log('\x1b[91m' + '🔴 Press CTRL-C to stop\n' + '\x1b[0m');
  } catch (error) {
    console.log('Error while connecting with DB', error);
    throw error;
  }
};

export default connectDB;
