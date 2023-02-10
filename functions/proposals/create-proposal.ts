import util from 'util';
import { v4 as uuid4 } from 'uuid';

import { createDBConnection } from '../../util';
import { NewProposal, Proposal, Event, Context } from '../../types';

export async function createProposal(event: Event, context: Context) {
  const connection = createDBConnection();
  const query = util.promisify(connection.query).bind(connection);

  try {
    const method = event.httpMethod;
    const path = event.path;

    const proposal: NewProposal = JSON.parse(event.body || '');
    const { title, description, email, userId, userName } = proposal;

    const result: Proposal = await query(
      `INSERT INTO proposals (ID, Title, Description, Email, UserId, UserName) VALUES ('${uuid4()}', '${title}', '${description}', ` +
        `'${email || null}', '${userId || null}', '${userName || null}');`
    );

    return {
      statusCode: 200,
      headers: {
        'access-control-allow-origin': '*',
      },
      body: JSON.stringify(result),
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: {
        'access-control-allow-origin': '*',
      },
      body: JSON.stringify(error),
    };
  } finally {
    connection.end();
  }
}
