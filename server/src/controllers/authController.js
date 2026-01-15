import bcrypt from 'bcryptjs';
import { getDB } from '../database.js';
import { generateToken } from '../middleware/auth.js';
import { ObjectId } from 'mongodb';

export async function register(req, res) {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Email, password, and username are required' });
    }

    const db = getDB();
    const existingUser = await db.collection('users').findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = new ObjectId();

    const result = await db.collection('users').insertOne({
      _id: userId,
      email,
      password: hashedPassword,
      username,
      favoriteGenres: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const token = generateToken(userId.toString());

    res.status(201).json({
      user: {
        id: result.insertedId,
        email,
        username,
        favoriteGenres: [],
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = getDB();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id.toString());

    res.json({
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        favoriteGenres: user.favoriteGenres,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
}

export async function getProfile(req, res) {
  try {
    const db = getDB();
    const user = await db.collection('users').findOne({
      _id: new ObjectId(req.userId),
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id,
      email: user.email,
      username: user.username,
      favoriteGenres: user.favoriteGenres,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
}

export async function updateProfile(req, res) {
  try {
    const { username, favoriteGenres } = req.body;
    const db = getDB();

    const updateData = { updatedAt: new Date() };
    if (username) updateData.username = username;
    if (favoriteGenres) updateData.favoriteGenres = favoriteGenres;

    const result = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(req.userId) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: result.value._id,
      email: result.value.email,
      username: result.value.username,
      favoriteGenres: result.value.favoriteGenres,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
}
