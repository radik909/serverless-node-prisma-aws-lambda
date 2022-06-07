import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { createPrismaClient } from '@libs/createPrismaClient';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const prisma = createPrismaClient();

  try {
    const user = await prisma.user.create({
      data: { name: event.body.name, age: event.body.age },
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

export const main = middyfy(hello);
