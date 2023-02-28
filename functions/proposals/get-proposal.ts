import util from 'util';

import {
  checkIfValidUUID4,
  createDBConnection,
  GLOBAL_HEADERS,
} from '../../util';
import { Event, Context, DBOProposal } from '../../types';
import { PROPOSAL_TABLE_NAME } from '../../const';

export async function getProposal(event: Event, context: Context) {
  const connection = createDBConnection();
  const query = util.promisify(connection.query).bind(connection);

  try {
    const proposalId = event.path.split('/')[4];

    if (!checkIfValidUUID4(proposalId)) {
      throw new Error(`${proposalId} is not a valid Id.`);
    }

    const result = await query(
      `SELECT * FROM ${PROPOSAL_TABLE_NAME} WHERE ID="${proposalId}";`
    );
    const proposal: DBOProposal = result[0] || {};

    return {
      statusCode: 200,
      headers: GLOBAL_HEADERS,
      body: JSON.stringify(proposal),
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
