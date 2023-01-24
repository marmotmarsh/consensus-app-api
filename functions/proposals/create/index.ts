import { Handler } from '@netlify/functions';
import mysql from 'mysql2';
import util from 'util';
import { v4 as uuid4 } from 'uuid';

import { createDBConnection } from '../../../util';
import { NewProposal, Proposal } from '../../../types';

const connection = createDBConnection();
const query = util.promisify(connection.query).bind(connection);

export const handler: Handler = async (event, context) => {
  // const { name = 'stranger' } = event.queryStringParameters;
  try {
    const method = event.httpMethod;
    const path = event.path;

    const proposal: NewProposal = JSON.parse(event.body || '');
    const { title, description, email, userId, userName } = proposal;

    const result: Proposal = await query(
      `INSERT INTO proposals (ID, Title, Description, Email, UserId, UserName) VALUES (${
        (uuid4(), title, description, email, userId, userName)
      });`
    );

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } finally {
    connection.end();
  }
};
