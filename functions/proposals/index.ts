import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  // const { name = 'stranger' } = event.queryStringParameters;
  const path = event.path;

  const proposal = event.body;
  const method = event.httpMethod;

  // Create new Proposal

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello, you used method: ${method}!`,
    }),
  };
};
