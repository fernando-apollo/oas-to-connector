import {IType} from './nodes/type';
import {trace} from '../log/trace';
import Oas from 'oas';
import {ParameterObject, ResponseObject, SchemaObject} from 'oas/dist/types';
import {ReferenceObject} from './nodes/props/types';
import Naming from './utils/naming';

export default class Context {
  public static readonly COMPONENTS_SCHEMAS: string = '#/components/schemas/';
  public static readonly COMPONENTS_RESPONSES: string = '#/components/responses/';
  public static readonly PARAMETER_SCHEMAS: string = '#/components/parameters/';

  private parser: Oas;
  // private prompt: Prompt;
  public generatedSet: Set<string> = new Set();
  public indent: number;

  constructor(parser: Oas) {
    this.parser = parser;
    // this.prompt = prompt;
    this.indent = 0;
  }

  public stack: Array<IType> = new Array<IType>();
  public types: Map<string, IType> = new Map();

  enter(type: IType): void {
    this.stack.push(type);
    trace(this, '-> [context::enter]', type.id);
  }

  leave(type: IType): void {
    this.stack.pop();
    trace(this, '<- [context::leave]', type.id);
  }

  size() {
    return this.stack.length;
  }

  store(name: string, type: IType): void {
    trace(this, '[context::store]', 'store ' + type.id);
    this.types.set(name, type);
  }

  public lookupResponse(ref: string): ResponseObject | ReferenceObject | null {
    if (ref && ref.startsWith(Context.COMPONENTS_RESPONSES)) {
      const definition = this.parser.getDefinition();
      const responses = definition.components?.responses ?? {};

      // get the response schema
      return responses[Naming.getRefName(ref)!] ?? null;
    }

    return null;
  }

  public lookupRef(ref: string | null): SchemaObject | null {
    if (ref && ref.startsWith(Context.COMPONENTS_SCHEMAS)) {
      const definition = this.parser.getDefinition();
      const schemas = definition.components?.schemas ?? {};

      return schemas ? schemas[Naming.getRefName(ref)!] : null;
    }
    return null;
  }

  public lookupParam(ref: string): ParameterObject | boolean {
    if (ref && ref.startsWith(Context.PARAMETER_SCHEMAS)) {
      const definition = this.parser.getDefinition();
      const parameters = definition.components?.parameters ?? {};

      // get the parameter schema
      const name = Naming.getRefName(ref)!;
      return parameters[name] as ParameterObject ?? false;
    }

    return false;
  }

  inContextOf(type: string, node: IType): boolean {
    // console
    for (let i = this.stack.length - 1; i >= 0; i--) {
      if (this.stack[i] === node)
        continue;

      if (this.stack[i].constructor.name === type) {
        return true;
      }
    }

    return false;
  }
}
