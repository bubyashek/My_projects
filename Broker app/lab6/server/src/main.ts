import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';

// Load config.env if exists
const configPath = path.join(__dirname, '../config.env');
if (fs.existsSync(configPath)) {
  const config = fs.readFileSync(configPath, 'utf-8');
  config.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...values] = trimmed.split('=');
      if (key && values.length) {
        process.env[key] = values.join('=');
      }
    }
  });
  console.log('✅ Loaded config from config.env');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📁 Data path: ${process.env.DATA_PATH || '../../lab5/server/data'}`);
}

bootstrap();

