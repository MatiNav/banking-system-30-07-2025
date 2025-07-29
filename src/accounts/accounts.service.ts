import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { CreateMovementDto } from './dto/create-movement.dto';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountsService {
  private readonly logger = new Logger('AccountService');

  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    try {
      const account = this.accountRepository.create(createAccountDto);
      return await this.accountRepository.save(account);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  createMovement(createMovementDto: CreateMovementDto) {
    return 'This action adds a new account';
  }

  findOne(id: string) {
    return `This action returns a #${id} account`;
  }

  remove(id: string) {
    return `This action removes a #${id} account`;
  }

  private handleExceptions(error: any) {
    // if('status' in error && error.status == ...){}
    this.logger.log(error.message || 'An error ocurred');

    throw error;
  }
}
