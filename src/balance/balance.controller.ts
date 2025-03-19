import { Controller, Post, Body } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { UpdateBalanceDto } from './dto/update-balance.dto';

@Controller('api')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Post('balance/update')
  async updateBalance(@Body() updateBalanceDto: UpdateBalanceDto) {
    return this.balanceService.updateBalance(
      updateBalanceDto.userId,
      updateBalanceDto.amount,
    );
  }
}
