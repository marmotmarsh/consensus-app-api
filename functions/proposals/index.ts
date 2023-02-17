import { Handler } from '@netlify/functions';
import { GLOBAL_HEADERS } from '../../util';
import { createProposal } from './create-proposal';

export const handler: Handler = async (event, context) => {
  const { path, httpMethod } = event;
  const subPaths = path.split('/');

  if (subPaths[1] === '.netlify' && subPaths[2] === 'functions') {
    switch (httpMethod) {
      case 'POST': {
        // Create New Proposal
        if (subPaths[3] === 'proposals' && subPaths[4] === 'create') {
          return await createProposal(event, context);
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
