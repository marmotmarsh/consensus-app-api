import mysql, { Connection } from 'mysql2';

export function createDBConnection(): Connection {
  const url = process.env.DATABASE_URL;
  if (url === undefined) {
    throw new Error('Server Error');
  }
  const connection = mysql.createConnection(url);
  return connection;
}
