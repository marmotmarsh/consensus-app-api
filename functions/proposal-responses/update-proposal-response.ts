import util from 'util';

import {
  checkIfValidUUID4,
  createDBConnection,
  GLOBAL_HEADERS,
  makeNullableFieldSubquery,
  sanitizeString,
} from '../../util';
import { Event, Context, QueryResponseObject, DBOProposalResponse } from '../../types';
import { PROPOSAL_RESPONSE_TABLE_NAME } from '../../const';

export async function updateProposalResponse(event: Event, context: Context) {
  const connection = createDBConnection();
  const query = util.promisify(connection.query).bind(connection);

  try {
    const method = event.httpMethod;
    const path = event.path;

    const proposalResponse: DBOProposalResponse = JSON.parse(event.body || '');
    const proposalResponseId = proposalResponse.ID;

    if (!checkIfValidUUID4(proposalResponseId)) {
      throw new Error(`Invalud syntax for Id: ${proposalResponseId}.`);
    }

    const response: QueryResponseObject = await query(
      `UPDATE ${PROPOSAL_RESPONSE_TABLE_NAME} SET ` +
        `UserName = '${sanitizeString(proposalResponse.UserName)}', ` +
        `Thumb = '${proposalResponse.Thumb}', ` +
        `Comment = ${makeNullableFieldSubquery(sanitizeString(proposalResponse.Comment))} ` +
        `WHERE ID = ${proposalResponseId};`
    );

    if (response.affectedRows !== 1) {
      throw new Error(`Failed to save ProposalResponse for user: ${proposalResponse.UserName}`);
    }

    const proposalResponses: DBOProposalResponse[] = await query(
      `SELECT * FROM ${PROPOSAL_RESPONSE_TABLE_NAME} WHERE ID="${proposalResponseId}";`
    );

    return {
      statusCode: 200,
      headers: GLOBAL_HEADERS,
      body: JSON.stringify(proposalResponses[0] || {}),
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
