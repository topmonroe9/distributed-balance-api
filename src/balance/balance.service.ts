import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { TransactionHelper } from '../utils/transaction.helper';
import { InsufficientFundsException } from 'src/exceptions/insufficient-funds.exception';

@Injectable()
export class BalanceService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private transactionHelper: TransactionHelper,
  ) {}

  async updateBalance(userId: number, amount: number) {
    return this.transactionHelper.withTransaction(async (transaction) => {
      // Using FOR UPDATE to lock only the specific row
      // This is better than transaction-level locks
      const user = await this.userModel.findOne({
        where: { id: userId },
        lock: true,
        transaction,
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const currentBalance = parseFloat(user.balance.toString());
      const newBalance = currentBalance + parseFloat(amount.toString());

      if (newBalance < 0) {
        throw new InsufficientFundsException();
      }

      // Using increment/decrement is better than setting the value
      // as it's atomic and less prone to race conditions
      if (amount >= 0) {
        await user.increment('balance', {
          by: amount,
          transaction,
        });
      } else {
        await user.decrement('balance', {
          by: Math.abs(amount),
          transaction,
        });
      }

      // Get the updated user to return the latest balance
      const updatedUser = await this.userModel.findByPk(userId, {
        transaction,
      });

      return {
        userId: updatedUser.id,
        newBalance: updatedUser.balance,
      };
    });
  }
}
