import { Handler } from '@netlify/functions';

import { GLOBAL_HEADERS } from '../../util';
import { createProposal } from './create-proposal';
import { getProposal } from './get-proposal';
import { updateProposal } from './update-proposal';

export const handler: Handler = async (event, context) => {
  const { path, httpMethod, queryStringParameters } = event;
  const subPaths = path.split('/');

  if (subPaths[1] === '.netlify' && subPaths[2] === 'functions') {
    switch (httpMethod) {
      case 'POST': {
        if (subPaths[3] === 'proposals' && subPaths[4] === 'create') {
          // Create New Proposal
          return await createProposal(event, context);
        } else if (subPaths[3] === 'proposals' && subPaths[4] === 'update') {
          // Update Proposal
          return await updateProposal(event, context);
        }
      }
      case 'GET': {
        // Get Proposal by ProposalId
        if (subPaths[3] === 'proposals') {
          return await getProposal(event, context);
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
