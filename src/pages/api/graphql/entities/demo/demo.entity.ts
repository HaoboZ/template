import { Entity } from '@mikro-orm/core';
import { ObjectType } from 'type-graphql';
import DemoBase from './demo.base';

@ObjectType()
@Entity()
export default class Demo extends DemoBase<Demo> {
}
