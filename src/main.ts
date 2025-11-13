import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
  // Cria a aplicação a partir do módulo raiz (habilita o container de DI do AppModule)
  const app = await NestFactory.create(AppModule);

  // Pipe global de validação: aplica class-validator nos DTOs automaticamente
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // converte payloads para os tipos dos DTOs
      whitelist: true, // remove campos não listados nos DTOs
      forbidNonWhitelisted: true, // retorna erro se vier campo não permitido
    }),
  );

  // Permite que validators (class-validator) usem o container de DI do Nest
  // Necessário para injetar UserRepository em UniqueEmailValidator
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Sobe o servidor na porta definida (ou 3000)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
