import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlModule } from '@url-svcs/url/url.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/urls'), UrlModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
