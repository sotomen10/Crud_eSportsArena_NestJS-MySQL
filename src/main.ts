import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';




const PORT=process.env.PORT
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT,()=>{
    console.log(`server run on port:${PORT} http://localhost:${PORT}`);
    



  });
}
bootstrap();
