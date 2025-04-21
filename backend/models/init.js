const mongoose = require('mongoose');
const Group = require('./groups'); // Replace with the actual path to your Group model

const mongoURL = 'mongodb+srv://Heramb_Rallapally:heramb3112@cluster0.luz4m.mongodb.net/Similarity_HAM?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose
  .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    return seedDatabase();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

// Seed the database with initial data
async function seedDatabase() {
  try {
    const testData = [
      { GID:1,
        Sports: 'Football',
        Binge_watch: 'Netflix Original',
        Technology: 'Coding',
        Music: 'Classical',
        Movies: 'Tollywood'
      },
      { GID:2,
        Sports: 'Cricket',
        Binge_watch: 'Netflix Original',
        Technology: 'Coding',
        Music: 'Classical',
        Movies: 'Tollywood'
      },
      { GID:3,
        Sports: 'Cricket',
        Binge_watch: 'Anime',
        Technology: 'Coding',
        Music: 'Classical',
        Movies: 'Bollywood'
      }
    ];

    await Group.insertMany(testData);
    console.log('Test data added successfully.');

    mongoose.connection.close(); // Close the connection after seeding
  } catch (error) {
    console.error('Error seeding the database:', error);
    mongoose.connection.close();
  }
}
