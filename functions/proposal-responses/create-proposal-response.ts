import util from 'util';
import { v4 as uuid4 } from 'uuid';

import { createDBConnection, GLOBAL_HEADERS } from '../../util';
import {
  NewProposal,
  Proposal,
  Event,
  Context,
  NewProposalResponse,
} from '../../types';

export async function createProposalResponse(event: Event, context: Context) {
  const connection = createDBConnection();
  const query = util.promisify(connection.query).bind(connection);

  try {
    const method = event.httpMethod;
    const path = event.path;

    const proposalResponse: NewProposalResponse = JSON.parse(event.body || '');
    const { proposalId, userName, thumb, comment } = proposalResponse;

    const result: Proposal = await query(
      `INSERT INTO proposals (ID, ProposalId, UserName, Thumb, Comment) VALUES ('${uuid4()}', '${proposalId}', '${userName}', ` +
        `'${thumb || null}', '${comment || null}');`
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
