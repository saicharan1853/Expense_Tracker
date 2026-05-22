import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  Query,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { ExpensesService } from './expenses.service';

import { CreateExpenseDto } from './dto/create-expense.dto';

import { UpdateExpenseDto } from './dto/update-expense.dto';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';

@Controller('expenses')
export class ExpensesController {
  constructor(
    private readonly expensesService: ExpensesService,
  ) {}
  @UseGuards(AuthGuard('jwt'))
@Get('summary')
getSummary(@Req() req) {
  return this.expensesService.getSummary(req.user);
}
  @UseGuards(JwtAuthGuard)
  @Post()
  createExpense(
    @Body() createExpenseDto: CreateExpenseDto,

    @Req() req: any,
  ) {
    console.log(req.user);

    return this.expensesService.createExpense(
      createExpenseDto,
      req.user,
    );
  }


  @UseGuards(JwtAuthGuard)
@Patch(':id')
updateExpense(
  @Param('id', ParseIntPipe) id: number,

  @Body() updateExpenseDto: UpdateExpenseDto,

  @Req() req: any,
) {
  return this.expensesService.updateExpense(
    id,
    updateExpenseDto,
    req.user,
  );
 }

 @UseGuards(AuthGuard('jwt'))
@Delete(':id')
deleteExpense(
  @Param('id') id: string,
  @Req() req,
) {
  return this.expensesService.deleteExpense(
    Number(id),
    req.user,
  );
}
@UseGuards(AuthGuard('jwt'))
@Get()
getExpenses(
  @Req() req,
  @Query('category') category?: string,
  @Query('page') page?: string,
  @Query('limit') limit?: string,
  @Query('sort') sort?: 'ASC' | 'DESC',
) {
  return this.expensesService.getExpenses(
    req.user,
    category,
    Number(page) || 1,
    Number(limit) || 10,
    sort || 'DESC',
  );
}
}