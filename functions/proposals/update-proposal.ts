import util from 'util';

import {
  createDBConnection,
  GLOBAL_HEADERS,
  makeNullableFieldSubquery,
} from '../../util';
import { Event, Context, DBOProposal, QueryResponseObject } from '../../types';
import { PROPOSAL_TABLE_NAME } from '../../const';

export async function updateProposal(event: Event, context: Context) {
  const connection = createDBConnection();
  const query = util.promisify(connection.query).bind(connection);

  try {
    const method = event.httpMethod;
    const path = event.path;

    const proposal: DBOProposal = JSON.parse(event.body || '');
    const proposalId = proposal.ID;

    const response: QueryResponseObject = await query(
      `UPDATE ${PROPOSAL_TABLE_NAME} SET ` +
        `Title = '${proposal.Title}', ` +
        `Description = '${proposal.Description}', ` +
        `Email = ${makeNullableFieldSubquery(proposal.Email)}, ` +
        `UserId = ${makeNullableFieldSubquery(proposal.UserId)}, ` +
        `UserName = ${makeNullableFieldSubquery(proposal.UserName)} ` +
        `WHERE ID = ${proposalId};`
    );

    if (response.affectedRows !== 1) {
      throw new Error(`Failed to save Proposal with title: ${proposal.Title}`);
    }

    const proposals: DBOProposal[] = await query(
      `SELECT * FROM ${PROPOSAL_TABLE_NAME} WHERE ID="${proposalId}";`
    );

    return {
      statusCode: 200,
      headers: GLOBAL_HEADERS,
      body: JSON.stringify(proposals[0] || {}),
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
