import {
  Check,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.entity';

@Entity('withdrawals')
export class Withdrawal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('float')
  @Check('amount > 0')
  amount: number;

  @ManyToOne(() => Account, (account) => account.withdrawals)
  @Index('withdrawals_account_index')
  account: Account;
}
