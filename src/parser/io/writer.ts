import Gen from "../gen";
import Context from "../context";
import {IType, Type} from "../nodes/type";
import Naming from "../utils/naming";
import Oas from "oas";
import _ from "lodash";
import Get from "../nodes/get";
import Param from "../nodes/param/param";
import Prop from "../nodes/props/prop";
import Obj from "../nodes/obj";
import Union from "../nodes/union";
import Composed from "../nodes/comp";
import CircularRef from "../nodes/circular_ref";
import {T} from "../utils/type_utils";

export default class Writer {
  buffer: string[];

  constructor(public generator: Gen) {
    this.buffer = []
  }

  write(input: string): Writer {
    this.buffer.push(input);
    return this;
  }

  append(input: string): Writer {
    this.buffer.push(input);
    return this;
  }

  flush(): string {
    let result = this.buffer.join('');
    console.log(result);
    return result;
  }

  public writeSchema(writer: Writer, pending: Map<string, IType>, selection: string[]): void {
    const context = this.generator.context!;
    const generatedSet = context.generatedSet;
    // generatedSet.clear();

    this.writeDirectives(writer);
    this.writeJSONScalar(writer);

    pending.forEach((type: IType, _key: string) => {
      if (!generatedSet.has(type.id)) {
        type.generate(context, this, selection);
        generatedSet.add(type.id);
      }
    });

    // TODO: Pending
    // const counter = new RefCounter(this.context);
    // counter.addAll(this.collected);

    // const refs = counter.getCount();
    // this.printRefs(refs);

    // for (const type of this.context.types.ts.values()) {
    //   if (counter.getCount().has(type.name)) {
    //     await type.generate(this.context, writer);
    //     generatedSet.add(type.name);
    //   }
    // }

    this.writeQuery(context, writer, this.generator.paths, selection);
    writer.flush();
  }

  private writeJSONScalar(writer: Writer): void {
    writer.write('\nscalar JSON\n\n');
  }

  private writeQuery(context: Context, writer: Writer, collected: Map<string, IType>, selection: string[]): void {
    writer.write('type Query {\n');

    const selectionSet = new Set<string>(selection.map(s => s.split('>')[0]));

    let paths = Array.from(collected.values())
      .filter(path => selectionSet.has(path.id));

    for (const path of paths) {
      path.generate(context, writer, []);
      this.writeConnector(context, writer, path, selection);
      context.generatedSet.add(path.id);
    }

    writer.write('}\n\n');
  }

  private writeConnector(context: Context, writer: Writer, type: IType, selection: string[]): void {
    let indent = 0;
    const get = type as Get; // assume type is GetOp
    let spacing = ' '.repeat(indent + 4);
    writer.append(spacing).append('@connect(\n');

    const request = this.buildRequestMethodAndArgs(get);
    spacing = ' '.repeat(indent + 6);
    writer
      .append(spacing)
      .append('source: "api"\n')
      .append(spacing)
      .append('http: ' + request + '\n')
      .append(spacing)
      .append('selection: """\n');

    if (get.resultType) {
      this.writeSelection(context, writer, get.resultType, selection);
    }

    writer.append(spacing).append('"""\n');
    spacing = ' '.repeat(indent + 4);
    writer.append(spacing).append(')\n');
  }

  private buildRequestMethodAndArgs(get: Get): string {
    let builder = '';

    builder += '"' + get.operation.path.replace(/\{([a-zA-Z0-9]+)\}/g, '{$args.$1}');

    if (get.params.length > 0) {
      const params = get.params
        .filter((p: Param) => {
          return p.required && p.parameter.in && p.parameter.in.toLowerCase() === 'query';
        });

      if (params.length > 0) {
        builder += '?' + params
          .map((p: Param) => `${p.name}={$args.${Naming.genParamName(p.name)}}`)
          .join('&');
      }
      const headers = get.operation.getParameters()
        .filter(p => p.in && p.in.toLowerCase() === 'header')

      builder += '"\n';

      if (headers.length > 0) {
        let spacing = ' '.repeat(6);
        builder += spacing + 'headers: [\n';
        spacing = ' '.repeat(8);

        for (const p of headers) {
          let value: string | null = null;

          if (p.example != null) value = p.example.toString();

          if (p.examples && Object.keys(p.examples).length > 0)
            value = Object.keys(p.examples).join(',');

          if (value == null) value = '<placeholder>';

          builder += spacing + `{ name: "${p.name}", value: "${value}" }\n`;
        }

        spacing = ' '.repeat(6);
        builder += spacing + ']';
      }
    } else {
      builder += '"';
    }

    return `{ GET: ${builder} }`;
  }

  private writeSelection(context: Context, writer: Writer, type: IType, selection: string[]): void {
    context.indent = 6;
    type.select(context, writer, selection);
  }

  private writeDirectives(writer: Writer): void {
    const api: Oas = this.generator.parser;
    const host = this.getServerUrl(api.getDefinition().servers?.[0]);
    writer
      .append('extend schema\n')
      .append(
        '  @link(url: "https://specs.apollo.dev/federation/v2.10", import: ["@key"])\n'
      )
      .append('  @link(\n')
      .append('    url: "https://specs.apollo.dev/connect/v0.1"\n')
      .append('    import: ["@connect", "@source"]\n')
      .append('  )\n')
      .append('  @source(name: "api", http: { baseURL: "')
      .append(host)
      .append('" })\n\n');
  }

  private getServerUrl(server: any): string {
    if (!server) return 'http://localhost:4010';
    let url: string = server.url;
    if (server.variables) {
      for (const key in server.variables) {
        url = url.replace('{' + key + '}', server.variables[key].default);
      }
    }
    return url;
  }

  generate(selection: string[]) {
    const pending: Map<string, IType> = new Map();

    for (const path of selection) {
      let collection = Array.from(this.generator.paths.values());
      const parts = path.split(">");
      let current, last: IType | undefined;

      let i = 0;
      do {
        const part = parts[i].replace(/#\/c\/s/g, '#/components/schemas');
        if (part === '*') {
          // remove the current path from the selection array
          selection = selection.filter(s => s !== path);

          // add all the props from the current node and exit loop
          current?.props.forEach(child => {
            if (T.isLeaf(child)) selection.push(child.path());
          });
          break;
        }
        else if (part === '**' && current) {
          // remove the current path from the selection array
          selection = selection.filter(s => s !== path);

          // add all the props from the current node and exit loop
          this.traverseTree(current, selection, pending);

          // and break the loop
          current = undefined;
          break;
        }
        else {
          current = collection.find(t => t.id === part);
          if (!current) {
            throw new Error("Could not find type: " + part + " from " + path + ", last: " + last?.pathToRoot());
          }

          // make sure we expand it before we move on to the next part
          this.generator.expand(current);
          last = current;

          collection = Array.from(current!.children.values())
            || Array.from(current!.props.values())
            || [];
          console.log("found", current);
        }

        i++;
      }
      while (i < parts.length);

      if (current) {
        let parentType = Writer.findNonPropParent(current as IType);

        if (!pending.has(parentType.id)) {
          pending.set(parentType.id, parentType);
        }

        parentType.ancestors()
          .filter(t => !pending.has(t.id) && this.isContainer(t))
          .forEach(dep => {
            // TODO: potential merge needed?
            pending.set(dep.id, dep);
          })
      }
    }

    if (!_.isEmpty(pending)) {
      // first pass is to consolidate all Composed & Union nodes
      const composed: (Composed | Union)[] = Array.from(pending.values())
        .filter(t => t instanceof Composed || t instanceof Union)
        .map(t => t as Composed);

      for (const comp of composed) {
        comp.consolidate(selection).forEach(id => pending.delete(id));
      }

      this.writeSchema(this, pending, selection);
    }
  }

  private traverseTree(current: IType, selection: string[], pending: Map<string, IType>) {
    T.traverse((current as Type), (child) => {
      if (T.isLeaf(child)) {
        // this is a weird take but if the child is an array of scalars
        // then we want to avoid adding it twice
        if (T.isLeaf(child.parent!)) return;
        selection.push(child.path());

        let parentType = Writer.findNonPropParent(child);
        if (!pending.has(parentType.id)) {
          pending.set(parentType.id, parentType);
        }
      } else {
        this.generator.expand(child);
      }
    });
  }

  static findNonPropParent(type: IType) {
    let parent = type;
    while (parent instanceof Prop) {
      parent = parent.parent!;
    }
    return parent;
  }

  static progressiveSplits(input: string): string[] {
    const parts = input.split(">");
    const results: string[] = [];
    for (let i = 1; i <= parts.length; i++) {
      results.push(parts.slice(0, i).join(">"));
    }
    return results;
  }

  private isContainer(type: IType) {
    return (
      type instanceof Obj ||
      type instanceof Union ||
      type instanceof Composed ||
      type instanceof CircularRef
    )
  }
}
