import 'reflect-metadata';
import compress from '@fastify/compress';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { GlobalExceptionFilter } from './platform/global-exception.filter.js';
import { PlatformConfigService } from './platform/platform-config.service.js';
import { PlatformLoggerService } from './platform/platform-logger.service.js';

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
  const platformConfig = app.get(PlatformConfigService);
  const platformLogger = app.get(PlatformLoggerService);

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
    origin: platformConfig.corsOrigin,
    credentials: true,
  } as never);
  await app.register(compress as never, { global: true } as never);
  await app.register(rateLimit as never, {
    max: platformConfig.rateLimitMax,
    timeWindow: platformConfig.rateLimitWindow,
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

      platformLogger.logEvent('http.request', {
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        durationMs: duration,
        requestId: context?.requestId,
        correlationId: context?.correlationId,
      });
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

  await app.listen(platformConfig.port, '0.0.0.0');
}

bootstrap();
