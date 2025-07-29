import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { CreateMovementDto } from './dto/create-movement.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto);
  }

  @Post(':accountId/movements')
  createMovement(
    @Param('accountId') accountId: string,
    @Body() createMovementDto: CreateMovementDto,
  ) {
    return this.accountsService.createMovement(accountId, createMovementDto);
  }

  @Get(':accountId')
  findOne(@Param('accountId') accountId: string) {
    return this.accountsService.findOne(accountId);
  }

  @Delete(':accountId')
  remove(@Param('accountId') accountId: string) {
    return this.accountsService.remove(accountId);
  }
}
