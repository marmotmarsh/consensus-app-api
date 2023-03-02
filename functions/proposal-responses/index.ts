import { Handler } from '@netlify/functions';
import { GLOBAL_HEADERS } from '../../util';
import { createProposalResponse } from './create-proposal-response';
import { getProposalResponsesByProposalId } from './get-proposal-responses-by-proposal-id';
import { updateProposalResponse } from './update-proposal-response';

export const handler: Handler = async (event, context) => {
  const { path, httpMethod } = event;
  const subPaths = path.split('/');

  if (subPaths[1] === '.netlify' && subPaths[2] === 'functions') {
    switch (httpMethod) {
      case 'POST': {
        if (subPaths[3] === 'proposal-responses' && subPaths[4] === 'create') {
          // Create New Proposal Response
          return await createProposalResponse(event, context);
        } else if (
          // Update Proposal Response
          subPaths[3] === 'proposal-responses' &&
          subPaths[4] === 'update'
        ) {
          return await updateProposalResponse(event, context);
        }
      }
      case 'GET': {
        // Get Proposal Responses by ProposalId
        if (subPaths[3] === 'proposal-responses' && subPaths[4] === 'byProposalId') {
          return await getProposalResponsesByProposalId(event, context);
        }
      }
      case 'OPTIONS': {
        // Pre-Flight Response
        return {
          statusCode: 200,
          headers: GLOBAL_HEADERS,
        };
      }
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: `Hello, you used method: ${httpMethod} and path: ${path}, which do not exist`,
    }),
  };
};
