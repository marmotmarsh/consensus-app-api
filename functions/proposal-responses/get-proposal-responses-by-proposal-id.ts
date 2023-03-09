import util from 'util';

import {
  buildQueryString,
  checkIfValidUUID4,
  createDBConnection,
  GLOBAL_HEADERS,
  handleError,
  MethodEnum,
  transformFromDBOProposalResponse,
} from '../../util';
import { Event, Context, DBOProposalResponse } from '../../types';
import { PROPOSAL_RESPONSE_TABLE_NAME } from '../../const';

export async function getProposalResponsesByProposalId(event: Event, context: Context) {
  const connection = createDBConnection();
  const query = util.promisify(connection.query).bind(connection);

  console.log(`Getting all Proposal Responses for a Proposal`);

  try {
    const proposalId = event.path.split('/')[5];

    if (!checkIfValidUUID4(proposalId)) {
      throw new Error(`Invalid syntax for Id: ${proposalId}.`);
    }

    const queryString = buildQueryString<DBOProposalResponse>({
      method: MethodEnum.SELECT,
      tableName: PROPOSAL_RESPONSE_TABLE_NAME,
      fieldValues: {},
      where: {
        ProposalId: proposalId,
      },
    });

    const proposalResponses: DBOProposalResponse[] = await query(queryString);

    return {
      statusCode: 200,
      headers: GLOBAL_HEADERS,
      body: JSON.stringify(proposalResponses.map(transformFromDBOProposalResponse)),
    };
  } catch (error) {
    return handleError(error);
  } finally {
    connection.end();
  }
}
