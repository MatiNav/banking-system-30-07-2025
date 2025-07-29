import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateMovementDto {
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  amount: number;

  @IsString()
  @IsOptional()
  accountToId?: string; // for transfers'
}
