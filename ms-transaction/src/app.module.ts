import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, envValidationSchema, kafkaConfig } from './config';
import { ModulesModule } from './modules/modules.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, kafkaConfig],
      validationSchema: envValidationSchema,
    }),
    ModulesModule,
  ],
})
export class AppModule {}
