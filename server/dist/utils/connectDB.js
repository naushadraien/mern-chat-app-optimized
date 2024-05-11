import mongoose from "mongoose";
const connectDB = async (uri) => {
    try {
        const connection = await mongoose.connect(uri, {
            dbName: "mern-chat",
        });
    }
    catch (error) {
        console.log("Some error while connecting DB", error);
    }
};
export { connectDB };
