import { SchemaObject, ParameterObject } from 'oas/dist/types';
import Writer from '../../io/writer';
import Naming from '../../utils/naming';
import {IType, Type} from "../type";
import Context from "../../context";
import {trace} from "../../../log/trace";
import Factory from "../factory";

export default class Param extends Type {
  public resultType!: IType;

  constructor(
      parent: IType,
      name: string,
      public schema: SchemaObject,
      public required: boolean,
      public defaultValue: any,
      public parameter: ParameterObject
  ) {
    super(parent, name);
  }

  public visit(context: Context): void {
    if (this.visited) return;

    context.enter(this);
    trace(context, '-> [param:visit]', 'in: ' + this.name);

    this.resultType = Factory.fromSchema(this, this.schema);
    trace(context, '   [param:visit]', 'type: ' + this.resultType);
    this.resultType.visit(context);

    trace(context, '<- [param:visit]', 'out: ' + this.name);
    context.leave(this);
  }

  public generate(context: Context, writer: Writer, selection: string[]): void {
    context.enter(this);
    trace(context, '-> [param::generate]', `-> in: ${this.name}`);

    writer.write(Naming.genParamName(this.name));
    writer.write(': ');

    this.resultType.generate(context, writer, selection);

    if (this.required) {
      writer.write('!');
    }

    if (this.defaultValue !== null && this.defaultValue !== undefined) {
      this.writeDefaultValue(writer);
    }

    trace(context, '<- [param::generate]', `-> out: ${this.name}`);
    context.leave(this);
  }

  private writeDefaultValue(writer: Writer): void {
    writer.write(' = ');
    const value = this.defaultValue;

    if (typeof value === 'number') {
      writer.write(value.toString());
    } else if (typeof value === 'string') {
      writer.write('"');
      writer.write(String(value));
      writer.write('"');
    }
  }

  public describe(): string {
    return `Param{ name=${this.name}, required=${this.required}, defaultValue=${this.defaultValue}, props=${this.props}, resultType=${this.resultType} }`;
  }

  select(context: Context, writer: Writer, selection: string[]) {
    // do nothing
  }
}
