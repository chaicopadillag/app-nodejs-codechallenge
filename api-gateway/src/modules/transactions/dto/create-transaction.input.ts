import { Field, Float, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsPositive, IsUUID, Min } from 'class-validator';

@InputType()
export class CreateTransactionInput {
  @IsNotEmpty()
  @IsUUID()
  @Field(() => ID)
  accountExternalIdDebit: string;

  @IsNotEmpty()
  @IsUUID()
  @Field(() => ID)
  accountExternalIdCredit: string;

  @IsNotEmpty()
  @IsUUID()
  @Field(() => ID)
  transferTypeId: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Field(() => Float)
  value: number;
}
