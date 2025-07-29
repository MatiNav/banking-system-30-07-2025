import { Type } from 'class-transformer';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

const MOVEMENTS = ['deposit', 'withdrawal', 'transfer'] as const;
type MOVEMENT_TYPES = (typeof MOVEMENTS)[number];

export class CreateMovementDto {
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  amount: number;

  @IsString()
  @IsOptional()
  accountToId?: string; // for transfers'

  @IsIn(MOVEMENTS)
  type: MOVEMENT_TYPES;
}
