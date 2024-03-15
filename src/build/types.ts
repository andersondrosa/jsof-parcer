//

type DestructValue = object | string | DestructValue[];

export type ConstNode = { _type: "const"; as: DestructValue };

export type LetNode = { _type: "let"; as: DestructValue };

export type PropNode = { _type: "prop"; path: string };

export type SettableNode = ConstNode | LetNode | PropNode;

export type SetterNode = {
  _type: "setter";
  from: GenericNode | any;
  to: SettableNode;
};

export type ReturnNode = {
  _type: "return";
  from: GenericNode | any;
};

export type FunctionNode = {
  _type: "function";
  name?: string;
  args: GenericNode[];
  steps: GenericNode[];
};

export type LambdaNode = {
  _type: "lambda";
  args: GenericNode[];
  steps: GenericNode[];
};

export type CallerNode = {
  _type: "caller";
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
