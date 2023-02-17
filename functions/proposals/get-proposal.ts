import util from 'util';
import { v4 as uuid4 } from 'uuid';

import { createDBConnection, GLOBAL_HEADERS } from '../../util';
import { Proposal, Event, Context } from '../../types';

export async function getProposal(event: Event, context: Context) {
  const connection = createDBConnection();
  const query = util.promisify(connection.query).bind(connection);

  try {
    const proposalId = event.path.split('/')[4];

    const result: Proposal = await query(
      `SELECT * FROM proposals WHERE ID="${proposalId}";`
    );

    return {
      statusCode: 200,
      headers: GLOBAL_HEADERS,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: GLOBAL_HEADERS,
      body: JSON.stringify(error),
    };
  } finally {
    connection.end();
  }
}
