import { PrismaService } from '@/prisma';
import { Injectable } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { CreateTransactionDto, UpdateTransactionDto } from '../dto';

@Injectable()
export class TransactionRepository {
  constructor(private prisma: PrismaService) {}

  create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    return this.prisma.transaction.create({
      data: createTransactionDto,
      include: { transactionType: true },
    });
  }

  update({ id, status }: UpdateTransactionDto): Promise<Transaction> {
    return this.prisma.transaction.update({
      where: { id },
      data: { status },
    });
  }

  findAll(): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { transactionType: true },
    });
  }

  findById(id: string): Promise<Transaction | null> {
    return this.prisma.transaction.findFirst({
      where: { id },
      include: { transactionType: true },
    });
  }
}
