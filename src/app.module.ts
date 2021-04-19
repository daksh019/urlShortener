import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlModule } from '@url-svcs/url/url.module';
import { ConfigModule } from '@url-svcs/core/config/config.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost/urls'),
    UrlModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
