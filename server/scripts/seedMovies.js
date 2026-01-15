import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config';

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-recommendation';

const SAMPLE_MOVIES = [
  {
    title: 'Inception',
    description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.',
    genres: ['Sci-Fi', 'Action', 'Thriller'],
    year: 2010,
    poster_url: 'https://via.placeholder.com/300x450?text=Inception',
    director: 'Christopher Nolan',
    cast_members: ['Leonardo DiCaprio', 'Marion Cotillard', 'Ellen Page'],
    averageRating: 8.8,
    ratingCount: 2000000,
  },
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc on Gotham, Batman must confront one of the greatest tests.',
    genres: ['Action', 'Crime', 'Drama'],
    year: 2008,
    poster_url: 'https://via.placeholder.com/300x450?text=The+Dark+Knight',
    director: 'Christopher Nolan',
    cast_members: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    averageRating: 9.0,
    ratingCount: 2500000,
  },
  {
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    genres: ['Sci-Fi', 'Drama', 'Adventure'],
    year: 2014,
    poster_url: 'https://via.placeholder.com/300x450?text=Interstellar',
    director: 'Christopher Nolan',
    cast_members: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    averageRating: 8.7,
    ratingCount: 1800000,
  },
  {
    title: 'Pulp Fiction',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence.',
    genres: ['Crime', 'Drama'],
    year: 1994,
    poster_url: 'https://via.placeholder.com/300x450?text=Pulp+Fiction',
    director: 'Quentin Tarantino',
    cast_members: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson'],
    averageRating: 8.9,
    ratingCount: 1900000,
  },
  {
    title: 'The Shawshank Redemption',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption.',
    genres: ['Drama'],
    year: 1994,
    poster_url: 'https://via.placeholder.com/300x450?text=The+Shawshank+Redemption',
    director: 'Frank Darabont',
    cast_members: ['Tim Robbins', 'Morgan Freeman'],
    averageRating: 9.3,
    ratingCount: 2300000,
  },
  {
    title: 'Forrest Gump',
    description: 'The presidencies of Kennedy and Johnson unfold from the perspective of an Alabama man with an IQ of 75.',
    genres: ['Drama', 'Romance'],
    year: 1994,
    poster_url: 'https://via.placeholder.com/300x450?text=Forrest+Gump',
    director: 'Robert Zemeckis',
    cast_members: ['Tom Hanks', 'Gary Sinise', 'Sally Field'],
    averageRating: 8.8,
    ratingCount: 1800000,
  },
  {
    title: 'The Matrix',
    description: 'A computer programmer discovers that reality as he knows it is a simulation.',
    genres: ['Sci-Fi', 'Action'],
    year: 1999,
    poster_url: 'https://via.placeholder.com/300x450?text=The+Matrix',
    director: 'The Wachowskis',
    cast_members: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
    averageRating: 8.7,
    ratingCount: 1600000,
  },
  {
    title: 'Gladiator',
    description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family.',
    genres: ['Action', 'Adventure', 'Drama'],
    year: 2000,
    poster_url: 'https://via.placeholder.com/300x450?text=Gladiator',
    director: 'Ridley Scott',
    cast_members: ['Russell Crowe', 'Joaquin Phoenix', 'Lucilla'],
    averageRating: 8.5,
    ratingCount: 1500000,
  },
  {
    title: 'The Avengers',
    description: 'Earth\'s mightiest heroes must come together and learn to fight as a team to save the planet.',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    year: 2012,
    poster_url: 'https://via.placeholder.com/300x450?text=The+Avengers',
    director: 'Joss Whedon',
    cast_members: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo'],
    averageRating: 8.0,
    ratingCount: 1400000,
  },
  {
    title: 'The Godfather',
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire.',
    genres: ['Crime', 'Drama'],
    year: 1972,
    poster_url: 'https://via.placeholder.com/300x450?text=The+Godfather',
    director: 'Francis Ford Coppola',
    cast_members: ['Marlon Brando', 'Al Pacino', 'James Caan'],
    averageRating: 9.2,
    ratingCount: 1700000,
  },
];

async function seedMovies() {
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db();
    const moviesCollection = db.collection('movies');

    console.log('Clearing existing movies...');
    await moviesCollection.deleteMany({});

    console.log('Inserting sample movies...');
    const result = await moviesCollection.insertMany(SAMPLE_MOVIES);

    console.log(`✅ Successfully inserted ${result.insertedCount} movies`);
    console.log('Sample movies added:');
    SAMPLE_MOVIES.forEach((movie, i) => {
      console.log(`  ${i + 1}. ${movie.title} (${movie.year})`);
    });
  } catch (error) {
    console.error('❌ Error seeding movies:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedMovies();
