async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://expense-tracker-dun-six-19.vercel.app',
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
