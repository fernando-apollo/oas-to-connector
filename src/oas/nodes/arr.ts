import { OpenAPIV3 } from 'openapi-types';
import ArraySchemaObject = OpenAPIV3.ArraySchemaObject;

import { trace } from '../log/trace.js';
import { OasContext } from '../oasContext.js';
import { Writer } from '../io/writer.js';
import { Naming } from '../utils/naming.js';
import { Factory } from './factory.js';
import { IType, Type } from './type.js';

export class Arr extends Type {
  public itemsType?: IType;

  constructor(
    parent: IType | undefined,
    name: string,
    public items: ArraySchemaObject,
  ) {
    super(parent, name);
    this.itemsType = Factory.fromSchema(this, this.items);
  }

  get id(): string {
    return 'array:' + (this.itemsType ? this.itemsType.name : 'unknown-yet');
  }

  public visit(context: OasContext): void {
    if (this.visited) {
      return;
    }

    context.enter(this);
    trace(context, '-> [array:visit]', 'in');

    this.itemsType?.visit(context);
    this.visited = true;

    trace(context, '-> [array:visit]', 'out');
    context.leave(this);
  }

  public forPrompt(_context: OasContext): string {
    return `${Naming.getRefName(this.name)} (Array)`;
  }

  public generate(context: OasContext, writer: Writer, selection: string[]): void {
    context.enter(this);
    trace(context, '-> [array::generate]', `-> in: ${this.name}`);

    writer.append('[');
    if (this.itemsType) {
      this.itemsType.generate(context, writer, selection);
    }
    writer.append(']');

    trace(context, '<- [array::generate]', `-> out: ${this.name}`);
    context.leave(this);
  }

  public select(context: OasContext, writer: Writer, selection: string[]) {
    trace(context, '-> [array::select]', `-> in: ${this.name}`);

    if (this.itemsType) {
      this.itemsType.select(context, writer, selection);
    }

    trace(context, '<- [array::select]', `-> out: ${this.name}`);
  }
}
