import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Type' })
export class TypeEntity {
  @Field(() => String)
  name: string;
}
