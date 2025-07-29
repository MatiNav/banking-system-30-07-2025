import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { CreateMovementDto } from './dto/create-movement.dto';
import { Account } from './entities/account.entity';
import { Deposit } from './entities/deposit.entity';
import { Withdrawal } from './entities/withdrawal.entity';

@Injectable()
export class AccountsService {
  private readonly logger = new Logger('AccountService');

  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    try {
      const account = this.accountRepository.create(createAccountDto);
      return await this.accountRepository.save(account);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async createMovement(
    accountId: string,
    createMovementDto: CreateMovementDto,
  ) {
    try {
      if (createMovementDto.type === 'transfer') {
        //todo:  return await this.createTransfer(accountId, createMovementDto);
      } else {
        await this.createDepositOrWithdrawal(accountId, createMovementDto);
      }
    } catch (error) {
      this.handleExceptions(error);
    }

    return this.findOne(accountId);
  }

  async createDepositOrWithdrawal(
    accountFromId: string,
    createMovementDto: CreateMovementDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const accountFrom = await queryRunner.manager.findOne(Account, {
        where: { id: accountFromId },
        relations: {
          deposits: true,
          withdrawals: true,
        },
      });
      if (!accountFrom)
        throw new NotFoundException(
          `Account with id: "${accountFromId}" not found.`,
        );

      const movementEntity =
        createMovementDto.type === 'deposit' ? Deposit : Withdrawal;

      const movement = queryRunner.manager.create(movementEntity, {
        amount: createMovementDto.amount,
      });

      const movementsFromEntity =
        createMovementDto.type === 'deposit'
          ? accountFrom.deposits
          : accountFrom.withdrawals;

      accountFrom.balance =
        createMovementDto.type === 'deposit'
          ? accountFrom.balance + createMovementDto.amount
          : accountFrom.balance - createMovementDto.amount;

      if (accountFrom.balance < 0)
        throw new BadRequestException('Balance can not be less than 0.');

      movementsFromEntity.push(movement);

      await queryRunner.manager.save(accountFrom);
      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      throw error;
    }
  }

  async findOne(accountId: string) {
    try {
      const account = await this.accountRepository.findOne({
        where: { id: accountId },
        relations: {
          deposits: true,
          withdrawals: true,
          transfersIn: true,
          transfersOut: true,
        },
      });

      if (!account)
        throw new NotFoundException(
          `Account with id: "${accountId}" not found.`,
        );

      return account;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  remove(accountId: string) {
    return `This action removes a #${accountId} account`;
  }

  private handleExceptions(error: any) {
    // if('status' in error && error.status == ...){}
    this.logger.log(error.message || 'An error ocurred');

    throw error;
  }
}
