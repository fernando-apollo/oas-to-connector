import { SchemaObject } from 'oas/dist/types';
import { trace } from '../../log/trace';
import { RenderContext } from '../../prompts/theme';
import Context from '../context';
import Writer from '../io/writer';
import { IType, Type } from './type';

export class Scalar extends Type {
  constructor(
    parent: IType | undefined,
    name: string,
    public schema: SchemaObject,
  ) {
    super(parent, name);
  }
  public visit(_context: Context): void {
    this.visited = true;
  }

  public forPrompt(context: Context): string {
    return `Scalar Node - Name: ${this.name}, Value: ${this.schema}`;
  }

  public generate(context: Context, writer: Writer, selection: string[]): void {
    context.enter(this);
    trace(context, '-> [scalar::generate]', `-> in: ${this.name}`);
    writer.write(this.name);
    trace(context, '<- [scalar::generate]', `-> out: ${this.name}`);
    context.leave(this);
  }

  public select(context: Context, writer: Writer, selection: string[]) {
    // Scalars do not need to be selected.
  }
}
