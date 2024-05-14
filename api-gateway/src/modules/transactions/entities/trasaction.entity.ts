import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { TypeEntity } from './type.entity';

@ObjectType({ description: 'Transaction' })
export class TransactionEntity {
  @Field(() => ID)
  transactionExternalId: string;

  @Field(() => TypeEntity)
  transactionType: TypeEntity;

  @Field(() => TypeEntity)
  transactionStatus: TypeEntity;

  @Field(() => Float)
  value: number;

  @Field(() => String)
  createdAt: string;
}
