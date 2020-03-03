import mongoose from 'mongoose';

const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database Connected!!');
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default connection;
