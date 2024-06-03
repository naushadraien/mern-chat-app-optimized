import mongoose from 'mongoose';

import { logWithIcon } from './logServerWithIcon';

const connectDB = (uri: string) => {
  mongoose
    .connect(uri, {
      dbName: 'mern-chat-master',
      connectTimeoutMS: 30000,
      socketTimeoutMS: 60000,
    })
    .then((connect) => {
      logWithIcon('\n💾', '92', `Connected to MongoDB at ${connect.connection.host}`);
      logWithIcon('🔴', '91', 'Press CTRL-C to stop\n');
    })
    .catch((error) => {
      console.log('Error while connecting with DB', error);
      throw error;
    });
};

// with try catch block

// const connectDB = async (uri: string): Promise<void> => {
//   try {
//     const connect = await mongoose.connect(uri, {
//       dbName: 'mern-chat-master',
//       connectTimeoutMS: 30000,
//       socketTimeoutMS: 60000,
//     });
//     logWithIcon('\n💾', '92', `Connected to MongoDB at ${connect.connection.host}`);
//     logWithIcon('🔴', '91', 'Press CTRL-C to stop\n');
//   } catch (error) {
//     console.log('Error while connecting with DB', error);
//     throw error;
//   }
// };

export default connectDB;
