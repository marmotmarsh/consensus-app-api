import util from 'util';

import { checkIfValidUUID4, createDBConnection, GLOBAL_HEADERS, makeNullableFieldSubquery } from '../../util';
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

    if (!checkIfValidUUID4(proposalId)) {
      throw new Error(`${proposalId} is not a valid Id.`);
    }

    const response: QueryResponseObject = await query(
      `UPDATE ${PROPOSAL_TABLE_NAME} SET ` +
        (!!proposal.Title ? `Title = '${proposal.Title}', ` : '') +
        (!!proposal.Description ? `Description = '${proposal.Description}', ` : '') +
        (!!proposal.Email ? `Email = ${makeNullableFieldSubquery(proposal.Email)}, ` : '') +
        (!!proposal.UserId ? `UserId = ${makeNullableFieldSubquery(proposal.UserId)}, ` : '') +
        (!!proposal.UserName ? `UserName = ${makeNullableFieldSubquery(proposal.UserName)}, ` : '') +
        `WHERE ID = ${proposalId};`
    );

    if (response.affectedRows !== 1) {
      throw new Error(`Failed to save Proposal with title: ${proposal.Title}`);
    }

    const proposals: DBOProposal[] = await query(`SELECT * FROM ${PROPOSAL_TABLE_NAME} WHERE ID="${proposalId}";`);

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
