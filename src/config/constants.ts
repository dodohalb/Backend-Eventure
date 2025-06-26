export const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:devpass@localhost:5432/eventure_dev';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";