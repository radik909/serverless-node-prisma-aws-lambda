import { formatJSONResponse } from '@libs/api-gateway';
import { createPrismaClient } from '@libs/createPrismaClient';
import { middyfy } from '@libs/lambda';
import type { APIGatewayProxyResult } from 'aws-lambda';

const userList = async (): Promise<APIGatewayProxyResult> => {
  const prisma = createPrismaClient();

  try {
    const users = await prisma.user.findMany();
    return formatJSONResponse({
      data: users,
    });
  } catch (e) {
    console.error(e);
    return formatJSONResponse({
      error: e.message,
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const main = middyfy(userList);
