import _ from 'lodash';
import { trace } from '../../log/trace';
import { RenderContext } from '../../prompts/theme';
import Context from '../context';
import Writer from '../io/writer';
import Naming from '../utils/naming';
import { IType, Type } from './type';

export default class CircularRef extends Type {
  constructor(
    parent: IType,
    public ref: IType,
  ) {
    super(parent, ref.name);
    // this.children = parent.children;
  }

  get id(): string {
    return `circular-ref:#${this.ref.id}`;
    // return this.child.id;
  }

  public forPrompt(_: Context): string {
    return `${Naming.getRefName(this.ref.name)} (Circular Ref in: ${this.parent?.id})`;
  }

  public add(child: IType): void {
    throw new Error('Should not be adding a child to a circular ref');
  }

  public visit(context: Context): void {
    trace(context, '-> [circular-ref:visit]', `-> in: ${this.name}`);
    // Do nothing, this type is always visited.
    trace(context, '<- [circular-ref:visit]', `-> out: ${this.name}`);
  }

  public generate(context: Context, writer: Writer): void {
    trace(context, '-> [circular-ref:generate]', `-> in: ${this.name}`);
    // Do nothing, we can't really generate a circular reference.
    trace(context, '<- [circular-ref:generate]', `-> out: ${this.name}`);
  }

  public select(context: Context, writer: Writer): void {
    trace(context, '-> [circular-ref:select]', `-> in: ${this.name}`);

    writer
      .append(' '.repeat(context.indent + context.stack.length))
      .append(
        `# Circular reference to '${this.name}' detected! Please re-visit the schema and remove the reference.\n`,
      );

    trace(context, '<- [circular-ref:select]', `-> out: ${this.name}`);
  }
}
