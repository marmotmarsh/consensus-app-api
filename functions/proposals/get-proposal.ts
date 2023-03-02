import util from 'util';

import {
  buildQueryString,
  checkIfValidUUID4,
  createDBConnection,
  GLOBAL_HEADERS,
  MethodEnum,
  transformFromDBOProposal,
} from '../../util';
import { Event, Context, DBOProposal } from '../../types';
import { PROPOSAL_TABLE_NAME } from '../../const';

export async function getProposal(event: Event, context: Context) {
  const connection = createDBConnection();
  const query = util.promisify(connection.query).bind(connection);

  try {
    const proposalId = event.path.split('/')[4];

    if (!checkIfValidUUID4(proposalId)) {
      throw new Error(`${proposalId} is not a valid Id.`);
    }

    const queryString = buildQueryString<DBOProposal>({
      method: MethodEnum.SELECT,
      tableName: PROPOSAL_TABLE_NAME,
      fieldValues: {},
      where: {
        ID: proposalId,
      },
    });

    const result: DBOProposal[] = await query(queryString);

    return {
      statusCode: 200,
      headers: GLOBAL_HEADERS,
      body: JSON.stringify(transformFromDBOProposal(result[0]) || {}),
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
