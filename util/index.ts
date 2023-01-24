import mysql, { Connection, ConnectionOptions } from 'mysql2';

export function createDBConnection(): Connection {
  const connectionOptions: ConnectionOptions = {
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    ssl: {
      rejectUnauthorized: true,
    },
  };
  const url = process.env.DATABASE_URL;
  if (url === undefined) {
    throw new Error('Server Error');
  }
  const connection = mysql.createConnection(connectionOptions);
  return connection;
}
