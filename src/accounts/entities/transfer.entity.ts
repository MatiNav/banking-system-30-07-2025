import {
  Check,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.entity';

@Entity('transfers')
export class Transfer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('float')
  @Check('amount > 0')
  amount: number;

  @ManyToOne(() => Account, (account) => account.transfersIn)
  @Index('transfer_account_to_index')
  accountTo: Account;

  @ManyToOne(() => Account, (account) => account.transfersOut)
  @Index('transfer_account_from_index')
  accountFrom: Account;
}
