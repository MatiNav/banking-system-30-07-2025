import {
  Check,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Deposit } from './deposit.entity';
import { Transfer } from './transfer.entity';
import { Withdrawal } from './withdrawal.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('float', { default: 0 })
  @Check('balance >= 0')
  balance: number;

  @Column('text')
  name: string;

  @OneToMany(() => Deposit, (deposit) => deposit.account)
  deposits: Deposit[];

  @OneToMany(() => Withdrawal, (withdrawal) => withdrawal.account)
  withdrawals: Withdrawal[];

  @OneToMany(() => Transfer, (transfer) => transfer.accountTo)
  transfersIn: Transfer[];

  @OneToMany(() => Transfer, (transfer) => transfer.accountFrom)
  transfersOut: Transfer[];
}
