import util from 'util';
import { v4 as uuid4 } from 'uuid';

import { createDBConnection, GLOBAL_HEADERS, makeNullableFieldSubquery, sanitizeString } from '../../util';
import { Event, Context, DBOProposalResponse, QueryResponseObject, DBOProposal } from '../../types';
import { PROPOSAL_RESPONSE_TABLE_NAME, PROPOSAL_TABLE_NAME } from '../../const';

export async function createProposalResponse(event: Event, context: Context) {
  const connection = createDBConnection();
  const query = util.promisify(connection.query).bind(connection);

  try {
    const method = event.httpMethod;
    const path = event.path;

    const proposalResponse: DBOProposalResponse = JSON.parse(event.body || '');
    const newProposalResponseId = uuid4();

    const proposals: DBOProposal[] = await query(
      `SELECT * FROM ${PROPOSAL_TABLE_NAME} WHERE ID="${proposalResponse.ProposalId}";`
    );

    if (proposals.length < 1) {
      throw new Error(`Invalid ProposalId: ${proposalResponse.ProposalId}`);
    }

    const response: QueryResponseObject = await query(
      `INSERT INTO ${PROPOSAL_RESPONSE_TABLE_NAME} (ID, ProposalId, UserName, Thumb, Comment) VALUES ` +
        `('${newProposalResponseId}', ` +
        `'${proposalResponse.ProposalId}', ` +
        `'${sanitizeString(proposalResponse.UserName)}', ` +
        `${proposalResponse.Thumb}, ` +
        `${makeNullableFieldSubquery(sanitizeString(proposalResponse.Comment))});`
    );

    if (response.affectedRows !== 1) {
      throw new Error(`Failed to save Proposal Response for User: ${proposalResponse.UserName}`);
    }

    const proposalResponses: DBOProposalResponse[] = await query(
      `SELECT * FROM ${PROPOSAL_RESPONSE_TABLE_NAME} WHERE ID = "${newProposalResponseId}";`
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
