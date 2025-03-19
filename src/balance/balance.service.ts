import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class BalanceService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private sequelize: Sequelize,
  ) {}

  async updateBalance(userId: number, amount: number) {
    const transaction: Transaction = await this.sequelize.transaction();

    try {
      const user = await this.userModel.findByPk(userId, {
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      if (!user) {
        await transaction.rollback();
        throw new Error('User not found');
      }

      const newBalance =
        parseFloat(user.balance.toString()) + parseFloat(amount.toString());

      if (newBalance < 0) {
        await transaction.rollback();
        throw new Error('Insufficient funds');
      }

      user.balance = newBalance;
      await user.save({ transaction });

      await transaction.commit();

      return {
        userId: user.id,
        newBalance: user.balance,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
