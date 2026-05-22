import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

import { ExpenseCategory } from './enums/expense-category.enum';
@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('decimal')
  amount: number;

 @Column({
  type: 'enum',
  enum: ExpenseCategory,
})
category: ExpenseCategory;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  userId: number;
}