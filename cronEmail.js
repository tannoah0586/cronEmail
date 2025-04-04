const cron = require('node-cron');
const mongoose = require('mongoose');
const { processSavedAwbsEmail } = require('./controllers/emailController'); 
require('dotenv').config(); // Load environment variables
const fs = require('fs');


async function runEmailTask() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for cron job.');
    const users = await mongoose.model('User').find({});
    for (const user of users) {
      await processSavedAwbsEmail(user._id);
    }
    await mongoose.disconnect();
    console.log('Email task completed by cron.');
  } catch (error) {
    console.error('Error in cron job:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }
}

// Schedule the task (e.g., every day at 5:30 PM Singapore time)
cron.schedule('30 17 * * *', runEmailTask, {
  scheduled: true,
  timezone: 'Asia/Singapore',
});

console.log('Cron job scheduled.');
console.log("Current Directory Contents:", fs.readdirSync('.'));