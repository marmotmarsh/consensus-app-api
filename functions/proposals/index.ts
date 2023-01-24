import { Handler } from '@netlify/functions';
import { createProposal } from './create-proposal';

export const handler: Handler = async (event, context) => {
  const { path, httpMethod } = event;
  const subPaths = path.split('/');

  // Create New Proposal
  if (
    subPaths[0] === '' &&
    subPaths[1] === '.netlify' &&
    subPaths[2] === 'functions' &&
    subPaths[3] === 'proposals' &&
    subPaths[4] === 'create' &&
    httpMethod === 'POST'
  ) {
    return await createProposal(event, context);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello, you used method: ${httpMethod} and path: ${path}, which do not exist`,
    }),
  };
};
