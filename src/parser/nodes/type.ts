import Context from "../context";
import Prop from "./props/prop";
import Writer from "../io/writer";
import {trace} from "../../log/trace";
import Factory from "./factory";

export interface IType {
  name: string;
  parent?: IType;
  children: IType[];
  circularRef?: IType;
  props: Map<string, Prop>;
  id: string;

  forPrompt(context: Context): string;

  add(child: IType): void;

  ancestors(): IType[];

  visit(context: Context): void;

  generate(context: Context, writer: Writer, selection: string[]): void;

  pathToRoot(): string;

  path(): string;

  expand(context: Context): IType[];

  find(path: string, collection: Array<IType>): IType | boolean;

  select(context: Context, writer: Writer, selection: string[]): void;
}

export abstract class Type implements IType {
  public parent?: IType;
  public name: string;
  public children: IType[];
  circularRef?: IType;
  public visited: boolean;

  private readonly _props: Map<string, Prop>;

  protected constructor(parent: IType | undefined, name: string) {
    this.parent = parent;
    this.name = name;
    this.children = [];
    this.visited = false;
    this._props = new Map<string, Prop>();
  }

  abstract visit(context: Context): void;

  abstract forPrompt(context: Context): string;

  abstract select(context: Context, writer: Writer, selection: string[]): void;

  find(path: string, collection: Array<IType>): IType | boolean {
    const parts = path.split(">");
    let current: IType | undefined;

    let i = 0;
    do {
      const part = parts[i];

      current = collection.find(t => t.id === part);
      if (!current) return false;

      collection = Array.from(current!.children.values())
        || Array.from(current!.props.values())
        || [];
      // console.log("found", current);

      i++;
    } while (i < parts.length);

    return current || false;
  }

  expand(context: Context): IType[] {
    trace(context, '-> [expand]', `in: path: ${this.path()}`);
    if (!this.visited) {
      this.visit(context);
    }

    trace(context, '<- [expand]', `out: path: ${this.path()}`);

    // TODO:
    // if ((type instanceof Composed || type instanceof Union) && !type.getProps().isEmpty()) {
    //   return type.props?.values() || [];
    // }
    // else {
    return this.children;
    // }
  }

  abstract generate(context: Context, writer: Writer, selection: string[]): void;

  get id() { return this.name; }
  get props() { return this._props; }

  ancestors(): IType[] {
    const result: Array<IType> = [];
    result.push(this);

    let parent: IType | undefined = this;
    while (parent.parent) {
      parent = parent.parent;
      result.unshift(parent);
    }

    return result;
  }

  public path(): string {
    const ancestors = this.ancestors();
    return ancestors
      .map((t) => t.id)
      .join('>')
      .replace(/#\/components\/schemas/g, '#/c/s');
  }

  pathToRoot(): string {
    let builder = '';
    let current: IType | undefined = this;
    let indent = 0;

    while (current) {
      builder += ' <- ' + ' '.repeat(indent++) + current.id + ' (' + current.constructor.name + ')\n';
      current = current.parent;
    }

    return builder;
  }

  public add(child: IType): void {
    const paths: IType[] = this.ancestors();
    const contains: boolean = paths.map(p => p.id).includes(child.id);

    if (contains) {
      trace(null, '-> [type:add]', 'already contains child: ' + child.id);
      const ancestor: IType = paths[paths.map(p => p.id).indexOf(child.id)];
      const wrapper = Factory.fromCircularRef(this, ancestor);
      this.children.push(wrapper);
    }
    else
      this.children.push(child);
  };

  /*
    remove = (value: IType): void => {
      const index = this.children.findIndex(child => child === value);
      if (index !== -1) {
        this.children.splice(index, 1);
      }
    };

*/

  /*traverseB(callback: (node: IType) => void): void {
    const queue: IType[] = [this];

    while (queue.length > 0) {
      const node = queue.shift()!;
      callback(node);
      queue.push(...node.children);
    }
  }*/

  public selectedProps(selection: string[]) {
    return Array.from(this.props.values())
      .filter((prop) => selection.find(s => s.startsWith(prop.path())));
  }
}