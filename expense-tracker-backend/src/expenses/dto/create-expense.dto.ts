import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsEnum,
} from 'class-validator';

import { ExpenseCategory } from '../enums/expense-category.enum';

export class CreateExpenseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;

  @IsOptional()
  @IsString()
  description?: string;
}