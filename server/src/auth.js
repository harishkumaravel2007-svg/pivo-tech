import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'pivo-tech-secure-jwt-super-secret-key-2025';
const SESSION_EXPIRES_IN = process.env.SESSION_EXPIRES_IN || '7d';

if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'pivo-tech-secure-jwt-super-secret-key-2025')) {
  console.warn('⚠️ [SECURITY WARNING] Default JWT_SECRET is active in production! Configure a strong, unique JWT_SECRET in your production environment settings.');
}

export function hashPassword(plainPassword) {
  return bcrypt.hashSync(plainPassword, 10);
}

export function comparePassword(plainPassword, hash) {
  return bcrypt.compareSync(plainPassword, hash);
}

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: SESSION_EXPIRES_IN });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}
