import {
  Check,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.entity';

@Entity('deposits')
export class Deposit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('float')
  @Check('amount > 0')
  amount: number;

  @ManyToOne(() => Account, (account) => account.deposits)
  @Index('deposits_account_index')
  account: Account;
}
