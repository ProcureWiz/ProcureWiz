import 'reflect-metadata';
import compress from '@fastify/compress';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { GlobalExceptionFilter } from './platform/global-exception.filter.js';

type RequestContext = {
  requestId: string;
  correlationId: string;
  startedAt: number;
};

type RequestWithContext = {
  id: string;
  method: string;
  url: string;
  headers: Record<string, string | string[] | undefined>;
  requestContext?: RequestContext;
};

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const configService = app.get(ConfigService);
  const logger = new Logger('HttpLogger');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.register(helmet as never);
  await app.register(cors as never, {
    origin: configService.get<string>('CORS_ORIGIN', '*'),
    credentials: true,
  } as never);
  await app.register(compress as never, { global: true } as never);
  await app.register(rateLimit as never, {
    max: configService.get<number>('RATE_LIMIT_MAX', 100),
    timeWindow: configService.get<string>('RATE_LIMIT_TIME_WINDOW', '1 minute'),
  } as never);

  const fastify = app.getHttpAdapter().getInstance();
  fastify.addHook('onRequest', (request: RequestWithContext, reply: { header: (name: string, value: string) => void }, done: () => void) => {
    const requestId = request.id;
    const rawCorrelationId = request.headers['x-correlation-id'];
    const correlationId = Array.isArray(rawCorrelationId)
      ? rawCorrelationId[0] ?? requestId
      : rawCorrelationId ?? requestId;

    request.requestContext = {
      requestId,
      correlationId,
      startedAt: Date.now(),
    };

    reply.header('x-request-id', requestId);
    reply.header('x-correlation-id', correlationId);
    done();
  });

  fastify.addHook(
    'onResponse',
    (
      request: RequestWithContext,
      reply: { statusCode: number },
      done: () => void,
    ) => {
      const context = request.requestContext;
      const duration = context ? Date.now() - context.startedAt : 0;

      logger.log(
        JSON.stringify({
          event: 'http.request',
          method: request.method,
          url: request.url,
          statusCode: reply.statusCode,
          durationMs: duration,
          requestId: context?.requestId,
          correlationId: context?.correlationId,
        }),
      );
      done();
    },
  );

  const config = new DocumentBuilder()
    .setTitle('ProcureWiz API')
    .setDescription('ProcureWiz API documentation')
    .setVersion('0.0.2')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(configService.get<number>('PORT', 3000), '0.0.0.0');
}

bootstrap();
