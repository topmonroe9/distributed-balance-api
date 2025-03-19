import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { User } from '../models/user.model';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [BalanceController],
  providers: [BalanceService],
})
export class BalanceModule {}
