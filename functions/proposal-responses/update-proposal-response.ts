import util from 'util';
import _ from 'lodash';

import {
  checkIfValidUUID4,
  createDBConnection,
  GLOBAL_HEADERS,
  buildQueryString,
  MethodEnum,
  transformToDBOProposalResponse,
  transformFromDBOProposalResponse,
  handleError,
} from '../../util';
import { Event, Context, QueryResponseObject, DBOProposalResponse } from '../../types';
import { PROPOSAL_RESPONSE_TABLE_NAME } from '../../const';

export async function updateProposalResponse(event: Event, context: Context) {
  const connection = createDBConnection();
  const query = util.promisify(connection.query).bind(connection);

  console.log(`Updating a Proposal Response`);

  try {
    const method = event.httpMethod;
    const path = event.path;

    const proposalResponse: DBOProposalResponse = transformToDBOProposalResponse(JSON.parse(event.body || ''));
    const proposalResponseId = proposalResponse.ID;

    if (!checkIfValidUUID4(proposalResponseId)) {
      throw new Error(`Invalid syntax for Id: ${proposalResponseId}.`);
    }

    const queryString = buildQueryString<DBOProposalResponse>({
      method: MethodEnum.UPDATE,
      tableName: PROPOSAL_RESPONSE_TABLE_NAME,
      fieldValues: _.omit(proposalResponse, 'ID', 'proposalId'),
      where: {
        ID: proposalResponseId,
      },
    });

    const response: QueryResponseObject = await query(queryString);

    if (response.affectedRows !== 1) {
      throw new Error(`Failed to save ProposalResponse for user: ${proposalResponse.UserName}`);
    }

    const proposalResponses: DBOProposalResponse[] = await query(
      `SELECT * FROM ${PROPOSAL_RESPONSE_TABLE_NAME} WHERE ID="${proposalResponseId}";`
    );

    return {
      statusCode: 200,
      headers: GLOBAL_HEADERS,
      body: JSON.stringify(transformFromDBOProposalResponse(proposalResponses[0]) || {}),
    };
  } catch (error) {
    return handleError(error);
  } finally {
    connection.end();
  }
}
