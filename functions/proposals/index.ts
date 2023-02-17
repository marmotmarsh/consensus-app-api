import { Handler } from '@netlify/functions';
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
          headers: {
            // 'Access-Control-Allow-Origin': 'https://dev.consensuscheck.com',
            'Access-Control-Allow-Origin': '*', // TODO: Allow any origin for now. Switch to above line later.
            'Access-Control-Allow-Methods': 'GET, DELETE, HEAD, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
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
