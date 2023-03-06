import util from 'util';
import _ from 'lodash';

import {
  checkIfValidUUID4,
  createDBConnection,
  GLOBAL_HEADERS,
  buildQueryString,
  MethodEnum,
  transformToDBOProposal,
  transformFromDBOProposal,
  handleError,
} from '../../util';
import { Event, Context, DBOProposal, QueryResponseObject } from '../../types';
import { PROPOSAL_TABLE_NAME } from '../../const';

export async function updateProposal(event: Event, context: Context) {
  const connection = createDBConnection();
  const query = util.promisify(connection.query).bind(connection);

  console.log(`Updating a Proposal`);

  try {
    const method = event.httpMethod;
    const path = event.path;

    const proposal: DBOProposal = transformToDBOProposal(JSON.parse(event.body || ''));
    const proposalId = proposal.ID;

    if (!checkIfValidUUID4(proposalId)) {
      throw new Error(`${proposalId} is not a valid Id.`);
    }

    const queryString = buildQueryString<DBOProposal>({
      method: MethodEnum.UPDATE,
      tableName: PROPOSAL_TABLE_NAME,
      fieldValues: _.omit(proposal, 'ID'),
      where: { ID: proposalId },
    });

    const response: QueryResponseObject = await query(queryString);

    if (response.affectedRows !== 1) {
      throw new Error(`Failed to save Proposal with title: ${proposal.Title}`);
    }

    const proposals: DBOProposal[] = await query(`SELECT * FROM ${PROPOSAL_TABLE_NAME} WHERE ID="${proposalId}";`);

    return {
      statusCode: 200,
      headers: GLOBAL_HEADERS,
      body: JSON.stringify(transformFromDBOProposal(proposals[0]) || {}),
    };
  } catch (error) {
    return handleError(error);
  } finally {
    connection.end();
  }
}
