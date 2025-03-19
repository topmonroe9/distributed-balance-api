import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BalanceService } from './balance.service';
import { UpdateBalanceDto } from './dto/update-balance.dto';

@Controller('api')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Post('balance/update')
  async updateBalance(@Body() updateBalanceDto: UpdateBalanceDto) {
    try {
      const result = await this.balanceService.updateBalance(
        updateBalanceDto.userId,
        updateBalanceDto.amount,
      );
      return result;
    } catch (error) {
      if (error.message === 'User not found') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      if (error.message === 'Insufficient funds') {
        throw new HttpException('Insufficient funds', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
