import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BalanceModule } from './balance/balance.module';
import { User } from './models/user.model';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        models: [User],
        autoLoadModels: true,
        synchronize: false,
      }),
    }),
    BalanceModule,
  ],
})
export class AppModule {}
