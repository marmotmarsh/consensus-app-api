import mysql, { Connection, ConnectionOptions } from 'mysql2';

export const GLOBAL_HEADERS = {
  'Access-Control-Allow-Origin': 'https://dev.consensuscheck.com',
  'Access-Control-Allow-Methods': 'GET, DELETE, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

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
