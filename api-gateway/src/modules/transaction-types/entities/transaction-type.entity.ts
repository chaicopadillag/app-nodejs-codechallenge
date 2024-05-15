import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Transaction Types' })
export class TransactionTypeEntity {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  code: string;

  @Field(() => String)
  name: string;
}
