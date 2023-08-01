const mongoose = require('mongoose');
const { Track } = require('../model');
const config = require('../config');

const uri = config.db.name;

async function seedDatabase() {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Data to be inserted
    const tracksData = [
      { track: 'Backend Engineering' },
      { track: 'Cloud Engineering' },
      { track: 'Data Analysis' },
      { track: 'Data Engineering' },
      { track: 'Data Science' },
      { track: 'Frontend Engineering' },
      { track: 'Product Design' },
      { track: 'Product Management' },
      { track: 'Product Marketing' },
    ];

    // Drop the "tracks" collection if it exists
    await Track.collection.drop().catch(() => {});

    // Insert the data into the "tracks" collection
    const result = await Track.insertMany(tracksData);
    console.log(`${result.length} documents inserted.`);

    // Close the MongoDB connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

seedDatabase();
