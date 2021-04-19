import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestJSConfigModule } from '@nestjs/config';
import { schema } from './config.schema';
import { AppConfigService } from './config.service';

@Global()
@Module({})
export class ConfigModule {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static forRoot() {
    return {
      module: ConfigModule,
      global: true,
      imports: [
        NestJSConfigModule.forRoot({
          envFilePath: ['.env'],
          isGlobal: true,
          validationSchema: schema,
          validationOptions: {
            allowUnknown: true,
            abortEarly: true,
          },
        }),
      ],
      providers: [AppConfigService],
      exports: [AppConfigService],
    };
  }
}
