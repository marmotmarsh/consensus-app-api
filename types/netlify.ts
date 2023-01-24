interface EventHeaders {
  [name: string]: string | undefined;
}
interface EventMultiValueHeaders {
  [name: string]: string[] | undefined;
}
interface EventQueryStringParameters {
  [name: string]: string | undefined;
}
interface EventMultiValueQueryStringParameters {
  [name: string]: string[] | undefined;
}
export interface Event {
  rawUrl: string;
  rawQuery: string;
  path: string;
  httpMethod: string;
  headers: EventHeaders;
  multiValueHeaders: EventMultiValueHeaders;
  queryStringParameters: EventQueryStringParameters | null;
  multiValueQueryStringParameters: EventMultiValueQueryStringParameters | null;
  body: string | null;
  isBase64Encoded: boolean;
  netlifyGraphToken: string | undefined;
}

export interface Context {
  callbackWaitsForEmptyEventLoop: boolean;
  functionName: string;
  functionVersion: string;
  invokedFunctionArn: string;
  memoryLimitInMB: string;
  awsRequestId: string;
  logGroupName: string;
  logStreamName: string;
  identity?: {
    [key: string]: any;
  };
  clientContext?: {
    [key: string]: any;
  };
  getRemainingTimeInMillis(): number;
  /** @deprecated Use handler callback or promise result */
  done(error?: Error, result?: any): void;
  /** @deprecated Use handler callback with first argument or reject a promise result */
  fail(error: Error | string): void;
  /** @deprecated Use handler callback with second argument or resolve a promise result */
  succeed(messageOrObject: any): void;
  /** @deprecated Use handler callback or promise result */
  succeed(message: string, object: any): void;
}
