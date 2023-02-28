import util from 'util';
import { v4 as uuid4 } from 'uuid';

import { createDBConnection, GLOBAL_HEADERS, makeNullableFieldSubquery, sanitizeString } from '../../util';
import { Event, Context, DBOProposal, QueryResponseObject } from '../../types';
import { PROPOSAL_TABLE_NAME } from '../../const';

export async function createProposal(event: Event, context: Context) {
  const connection = createDBConnection();
  const query = util.promisify(connection.query).bind(connection);

  try {
    const method = event.httpMethod;
    const path = event.path;

    const newProposal: DBOProposal = JSON.parse(event.body || '');
    const newProposalId = uuid4();

    const response: QueryResponseObject = await query(
      `INSERT INTO ${PROPOSAL_TABLE_NAME} (ID, Title, Description, Email, UserId, UserName) VALUES ` +
        `('${newProposalId}', '${sanitizeString(newProposal.Title)}', '${sanitizeString(newProposal.Description)}', ` +
        `${makeNullableFieldSubquery(sanitizeString(newProposal.Email))}, ` +
        `${makeNullableFieldSubquery(newProposal.UserId)}, ` +
        `${makeNullableFieldSubquery(sanitizeString(newProposal.UserName))});`
    );

    if (response.affectedRows !== 1) {
      throw new Error(`Failed to save Proposal with title: ${newProposal.Title}`);
    }

    const proposals: DBOProposal[] = await query(`SELECT * FROM ${PROPOSAL_TABLE_NAME} WHERE ID = "${newProposalId}";`);

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
