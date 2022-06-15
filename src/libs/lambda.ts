import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import { BaseSchema } from 'yup';
import type { Handler } from 'aws-lambda';

export const middyfy = (handler: Handler) => {
  return middy(handler).use(middyJsonBodyParser());
};

export const schemaValidator = (schema: {
  body?: BaseSchema;
  queryStringParameters?: BaseSchema;
}) => {
  const before = async (request: any) => {
    try {
      const { body, queryStringParameters } = request.event;

      if (schema.body) {
        schema.body.validateSync(body);
      }

      if (schema.queryStringParameters) {
        schema.queryStringParameters.validateSync(queryStringParameters ?? {});
      }

      return Promise.resolve();
    } catch (e) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          errors: e.errors,
        }),
      };
    }
  };

  return {
    before,
  };
};

type RequestSchema = {
  bodySchema?: BaseSchema;
  queryStringSchema?: BaseSchema;
};

export const middyfyWithValidation = (
  handler: Handler,
  { bodySchema, queryStringSchema }: RequestSchema,
) => {
  return middyfy(handler).use(
    schemaValidator({
      body: bodySchema,
      queryStringParameters: queryStringSchema,
    }),
  );
};
