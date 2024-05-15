import { PrismaService } from '@/prisma';
import { Injectable } from '@nestjs/common';
import { TransactionType } from '@prisma/client';

@Injectable()
export class TransactionTypeRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<TransactionType[]> {
    return this.prisma.transactionType.findMany();
  }
}
