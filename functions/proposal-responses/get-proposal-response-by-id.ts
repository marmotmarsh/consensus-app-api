import util from 'util';

import {
  buildQueryString,
  checkIfValidUUID4,
  createDBConnection,
  GLOBAL_HEADERS,
  MethodEnum,
  transformFromDBOProposalResponse,
} from '../../util';
import { Event, Context, DBOProposalResponse } from '../../types';
import { PROPOSAL_RESPONSE_TABLE_NAME } from '../../const';

export async function getProposalResponseById(event: Event, context: Context) {
  const connection = createDBConnection();
  const query = util.promisify(connection.query).bind(connection);

  try {
    const proposalResponseId = event.path.split('/')[4];

    if (!checkIfValidUUID4(proposalResponseId)) {
      throw new Error(`Invalud syntax for Id: ${proposalResponseId}.`);
    }

    const queryString = buildQueryString<DBOProposalResponse>({
      method: MethodEnum.SELECT,
      tableName: PROPOSAL_RESPONSE_TABLE_NAME,
      fieldValues: {},
      where: {
        ID: proposalResponseId,
      },
    });

    const proposalResponses: DBOProposalResponse[] = await query(queryString);

    return {
      statusCode: 200,
      headers: GLOBAL_HEADERS,
      body: JSON.stringify(transformFromDBOProposalResponse(proposalResponses[0])),
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
