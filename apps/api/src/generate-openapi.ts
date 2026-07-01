import 'reflect-metadata';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function generateOpenApiSpec() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    logger: false,
  });

  const config = new DocumentBuilder()
    .setTitle('ProcureWiz API')
    .setDescription('ProcureWiz API documentation')
    .setVersion('0.0.2')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const outputDir = join(process.cwd(), 'openapi');
  const outputPath = join(outputDir, 'openapi.json');

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, JSON.stringify(document, null, 2), 'utf8');
  await app.close();

  process.stdout.write(`OpenAPI spec generated at ${outputPath}\n`);
}

generateOpenApiSpec();
