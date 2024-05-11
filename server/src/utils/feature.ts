import mongoose from 'mongoose';

const connectDB = async (uri: string) => {
  try {
    const connect = await mongoose.connect(uri, {
      dbName: 'mern-chat',
    });
    console.log(`Connected to DB at ${connect.connection.host}`);
  } catch (error) {
    console.log('Error while connecting with DB', error);
  }
};

export default connectDB;
