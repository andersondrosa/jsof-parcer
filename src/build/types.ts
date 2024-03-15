//

type DestructValue = object | string | DestructValue[];

export type ConstNode = { type: "const"; as: DestructValue };

export type LetNode = { type: "let"; as: DestructValue };

export type PropNode = { type: "prop"; path: string };

export type SettableNode = ConstNode | LetNode | PropNode;

export type SetterNode = {
  type: "setter";
  from: GenericNode | any;
  to: SettableNode;
};

export type ReturnNode = {
  type: "return";
  from: GenericNode | any;
};

export type FunctionNode = {
  type: "function";
  name?: string;
  args: GenericNode[];
  steps: GenericNode[];
};

export type LambdaNode = {
  type: "lambda";
  args: GenericNode[];
  steps: GenericNode[];
};

export type CallerNode = {
  type: "caller";
  into: PropNode | FunctionNode | LambdaNode;
  args: GenericNode[];
};

export type GenericNode =
  | FunctionNode
  | LambdaNode
  | CallerNode
  | PropNode
  | SetterNode
  | ReturnNode;
