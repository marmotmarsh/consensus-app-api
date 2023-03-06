import util from 'util';
import { v4 as uuid4 } from 'uuid';

import {
  createDBConnection,
  GLOBAL_HEADERS,
  buildQueryString,
  MethodEnum,
  handleError,
  transformToDBOProposalResponse,
} from '../../util';
import { Event, Context, DBOProposalResponse, QueryResponseObject, DBOProposal } from '../../types';
import { PROPOSAL_RESPONSE_TABLE_NAME, PROPOSAL_TABLE_NAME } from '../../const';

export async function createProposalResponse(event: Event, context: Context) {
  const connection = createDBConnection();
  const query = util.promisify(connection.query).bind(connection);

  console.log(`Creating a new Proposal Response`);

  try {
    const method = event.httpMethod;
    const path = event.path;

    const proposalResponse: DBOProposalResponse = transformToDBOProposalResponse(JSON.parse(event.body || ''));

    const getProposalQueryString = buildQueryString<DBOProposalResponse>({
      method: MethodEnum.SELECT,
      tableName: PROPOSAL_TABLE_NAME,
      fieldValues: {},
      where: {
        ID: proposalResponse.ProposalId,
      },
    });

    const proposals: DBOProposal[] = await query(getProposalQueryString);

    if (proposals.length < 1) {
      throw new Error(`Invalid ProposalId: ${proposalResponse.ProposalId}`);
    }

    const newProposalResponseId = uuid4();

    const queryString = buildQueryString<DBOProposalResponse>({
      method: MethodEnum.SELECT,
      tableName: PROPOSAL_RESPONSE_TABLE_NAME,
      fieldValues: {
        ...proposalResponse,
        ID: newProposalResponseId,
      },
      where: {},
    });

    const response: QueryResponseObject = await query(queryString);

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
    return handleError(error);
  } finally {
    connection.end();
  }
}
