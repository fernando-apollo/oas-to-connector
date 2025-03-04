import CircularRef from '../nodes/circular_ref';
import En from '../nodes/en';
import Prop from '../nodes/props/prop';
import PropArray from '../nodes/props/prop_array';
import PropScalar from '../nodes/props/prop_scalar';
import { IType } from '../nodes/type';

export class T {
  public static isLeaf(type: IType): boolean {
    return (
      type instanceof PropScalar ||
      type instanceof En ||
      type instanceof CircularRef ||
      (type instanceof PropArray && type.items instanceof PropScalar)
    );
  }

  public static isPropScalar(type: IType): boolean {
    return type instanceof PropScalar;
  }

  public static traverse(node: IType, callback: (node: IType) => void): void {
    const traverseNode = (n: IType): void => {
      callback(n);

      for (const c of n.children) {
        traverseNode(c);
      }
    };

    traverseNode(node);
  }
}
