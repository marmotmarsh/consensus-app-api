import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  // const { name = 'stranger' } = event.queryStringParameters;
  const proposal = event.body;
  const method = event.httpMethod;

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello, you used method: ${method}!`,
    }),
  };
};
