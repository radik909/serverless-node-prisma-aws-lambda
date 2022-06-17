import type { AWS } from '@serverless/typescript';
import functions from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'chaos',
  frameworkVersion: '3',
  functions,
  plugins: ['serverless-dotenv-plugin', 'serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    region: 'ap-southeast-1',
    runtime: 'nodejs16.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  package: {
    individually: true,
    patterns: ['node_modules/.prisma/**/*'],
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
