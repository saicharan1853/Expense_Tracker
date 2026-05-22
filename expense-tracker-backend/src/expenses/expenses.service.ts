import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Expense } from './expense.entity';

import { User } from '../users/user.entity';

import { CreateExpenseDto } from './dto/create-expense.dto';

import { UpdateExpenseDto } from './dto/update-expense.dto';

import { NotFoundException } from '@nestjs/common';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
  ) {}

  async createExpense(
    createExpenseDto: CreateExpenseDto,
    user: User,
  ) {
    const expense = this.expenseRepository.create({
      ...createExpenseDto,
      userId: user.id,
    });

    return await this.expenseRepository.save(expense);
  }

 async updateExpense(
  id: number,
  updateExpenseDto: UpdateExpenseDto,
  user: User,
) {
  const expense = await this.expenseRepository.findOne({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!expense) {
    throw new NotFoundException('Expense not found');
  }

  Object.assign(expense, updateExpenseDto);

  return await this.expenseRepository.save(expense);
}
async deleteExpense(id: number, user: User) {
  const expense = await this.expenseRepository.findOne({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!expense) {
    throw new Error('Expense not found');
  }

  await this.expenseRepository.remove(expense);

  return {
    message: 'Expense deleted successfully',
  };
}
async getExpenses(
  user: User,
  category?: string,
  page = 1,
  limit = 10,
  sort: 'ASC' | 'DESC' = 'DESC',
) {
  const query = this.expenseRepository.createQueryBuilder('expense');

  query.where('expense.userId = :userId', {
    userId: user.id,
  });

  if (category) {
    query.andWhere('expense.category = :category', {
      category,
    });
  }

  query.orderBy('expense.createdAt', sort);

  query.skip((page - 1) * limit);

  query.take(limit);

  const [expenses, total] = await query.getManyAndCount();

  return {
    data: expenses,
    total,
    page,
    limit,
  };
}
async getSummary(user: User) {
  const totalExpenses = await this.expenseRepository
    .createQueryBuilder('expense')
    .select('SUM(expense.amount)', 'total')
    .where('expense.userId = :userId', {
      userId: user.id,
    })
    .getRawOne();

  const totalTransactions = await this.expenseRepository
    .createQueryBuilder('expense')
    .where('expense.userId = :userId', {
      userId: user.id,
    })
    .getCount();

  const categoryBreakdown = await this.expenseRepository
    .createQueryBuilder('expense')
    .select('expense.category', 'category')
    .addSelect('SUM(expense.amount)', 'total')
    .where('expense.userId = :userId', {
      userId: user.id,
    })
    .groupBy('expense.category')
    .getRawMany();

  return {
    totalExpenses:
      Number(totalExpenses.total) || 0,

    totalTransactions,

    categoryBreakdown,
  };
}
}