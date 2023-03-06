import util from 'util';
import { v4 as uuid4 } from 'uuid';

import {
  createDBConnection,
  GLOBAL_HEADERS,
  buildQueryString,
  MethodEnum,
  transformToDBOProposal,
  transformFromDBOProposal,
} from '../../util';
import { Event, Context, DBOProposal, QueryResponseObject } from '../../types';
import { PROPOSAL_TABLE_NAME } from '../../const';

export async function createProposal(event: Event, context: Context) {
  const connection = createDBConnection();
  const query = util.promisify(connection.query).bind(connection);

  try {
    const method = event.httpMethod;
    const path = event.path;

    console.log('Saving a New Proposal');

    const newProposal: DBOProposal = transformToDBOProposal(JSON.parse(event.body || ''));
    const newProposalId = uuid4();

    const queryString = buildQueryString<DBOProposal>({
      method: MethodEnum.INSERT,
      tableName: PROPOSAL_TABLE_NAME,
      fieldValues: {
        ...newProposal,
        ID: newProposalId,
      },
      where: {},
    });

    const response: QueryResponseObject = await query(queryString);

    if (response.affectedRows !== 1) {
      throw new Error(`Failed to save Proposal with title: ${newProposal.Title}`);
    }

    const proposals: DBOProposal[] = await query(`SELECT * FROM ${PROPOSAL_TABLE_NAME} WHERE ID = "${newProposalId}";`);

    return {
      statusCode: 200,
      headers: GLOBAL_HEADERS,
      body: JSON.stringify(transformFromDBOProposal(proposals[0]) || {}),
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
