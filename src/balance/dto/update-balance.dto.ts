import { IsInt, IsNotEmpty, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBalanceDto {
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  readonly userId: number;

  @IsNotEmpty()
  @Type(() => Number)
  @Min(-1000000) // Adding reasonable limits
  @Max(1000000) // to prevent extreme values
  readonly amount: number;
}
