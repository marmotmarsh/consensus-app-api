import util from 'util';

import {
  checkIfValidUUID4,
  createDBConnection,
  GLOBAL_HEADERS,
} from '../../util';
import { Event, Context, DBOProposalResponse } from '../../types';
import { PROPOSAL_RESPONSE_TABLE_NAME } from '../../const';

export async function getProposalResponsesByProposalId(
  event: Event,
  context: Context
) {
  const connection = createDBConnection();
  const query = util.promisify(connection.query).bind(connection);

  try {
    const proposalResponseId = event.path.split('/')[4];

    if (!checkIfValidUUID4(proposalResponseId)) {
      throw new Error(`Invalud syntax for Id: ${proposalResponseId}.`);
    }

    const proposalResponses: DBOProposalResponse[] = await query(
      `SELECT * FROM ${PROPOSAL_RESPONSE_TABLE_NAME} WHERE ProposalId="${proposalResponseId}";`
    );

    return {
      statusCode: 200,
      headers: GLOBAL_HEADERS,
      body: JSON.stringify(proposalResponses),
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