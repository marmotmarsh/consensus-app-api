import mysql, { Connection, ConnectionOptions } from 'mysql2';
import _ from 'lodash';

import { DBOProposal, Proposal } from '../types';

export const GLOBAL_HEADERS = {
  // 'Access-Control-Allow-Origin': 'https://dev.consensuscheck.com',
  'Access-Control-Allow-Origin': '*', // TODO: Allow any origin for now. Switch to above line later.
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

export function sanitizeString(str: any | null): string | null {
  if (str === null) {
    return str;
  }
  return str.replace(/(?<!\\)'/g, `\'`);
}

export function sqlifyQuery(field: any | null): string {
  if (field === null) {
    return 'NULL';
  } else {
    return `'${sanitizeString(field)}'`;
  }
}

export enum MethodEnum {
  INSERT = 'INSERT',
  SELECT = 'SELECT',
  UPDATE = 'UPDATE',
}

export interface QueryOptions<T> {
  method: MethodEnum;
  tableName: string;
  fieldValues: Partial<T>;
  where: Partial<T>;
}

export function buildQueryString<T>(options: QueryOptions<T>): string {
  const { method, tableName, fieldValues, where } = options;
  const compactedFieldValues = _.reduce(
    fieldValues,
    (accum, v, k) => ({ ...accum, ...(v === undefined ? {} : { [k]: v }) }),
    {}
  );
  let query = '';

  switch (method) {
    case MethodEnum.INSERT: {
      query += 'INSERT INTO ' + tableName + ' (';
      const keys = _.keys(compactedFieldValues);
      _.map(keys, (key, i) => (query += (i === 0 ? '' : ', ') + key));
      query += ') VALUES (';
      _.map(keys, (key, i) => (query += (i === 0 ? '' : ', ') + sqlifyQuery(compactedFieldValues[key])));
      query += ');';
      return query;
    }
    case MethodEnum.UPDATE: {
      query += 'UPDATE ' + tableName + ' SET ';
      const keys = _.keys(compactedFieldValues);
      _.map(keys, (key, i) => (query += (i === 0 ? '' : ', ') + key + ' = ' + sqlifyQuery(compactedFieldValues[key])));
      if (!!where) {
        const whereKeys = _.keys(where);
        query += ' WHERE ';
        _.map(whereKeys, (key, i) => (query += (i === 0 ? '' : ', ') + key + ' = ' + sqlifyQuery(where[key])));
      }
      query += ';';
      return query;
    }
    case MethodEnum.SELECT: {
      query += 'SELECT * FROM ' + tableName;
      if (!!where) {
        const whereKeys = _.keys(where);
        query += ' WHERE ';
        _.map(whereKeys, (key, i) => (query += (i === 0 ? '' : ', ') + key + ' = ' + sqlifyQuery(where[key])));
      }
      query += ';';
      return query;
    }
    default:
      return query;
  }
}
