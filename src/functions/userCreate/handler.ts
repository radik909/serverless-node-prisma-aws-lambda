import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { createPrismaClient } from '@libs/createPrismaClient';
import { middyfyWithValidation } from '@libs/lambda';
import { InferType } from 'yup';

import schema from './schema';

type User = InferType<typeof schema>;

const userCreate: ValidatedEventAPIGatewayProxyEvent<User> = async (event) => {
  const prisma = createPrismaClient();

  try {
    const user = await prisma.user.create({
      data: event.body,
    });
    return formatJSONResponse({
      data: user,
    });
  } catch (e) {
    console.error(e);
    return formatJSONResponse({
      error: e.message,
      event,
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const main = middyfyWithValidation(userCreate, { bodySchema: schema });
