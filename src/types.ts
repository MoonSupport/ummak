import { Request, Response, NextFunction } from 'express';
import { PrimitiveChain } from 'lodash';
import { Low } from './cjs_lowdb/bin/index';
export type {
  RequestHandler,
  Request,
  Application,
  Response,
  NextFunction,
} from 'express';

export type InjectContext = (
  token: symbol
) => (req: Request, res: Response, next: NextFunction) => void;
export type UmmakHanlder = (req: UmmmakRequest, res: Response) => void;

export interface UmmakContext {
  db: ILow;
}
export interface UmmmakRequest extends Request {
  context: UmmakContext;
}

type Primitive = Number | String | Boolean | Object;

interface FindOption {
  [key: string]: Primitive;
}

interface IPrimitiveChain extends PrimitiveChain<unknown> {
  get?: (str: string) => IPrimitiveChain;
  find?: (options: FindOption) => IPrimitiveChain;
  remove?: (options: FindOption) => IPrimitiveChain;
}

export interface ILow extends Low {
  chain?: IPrimitiveChain;
}

export interface IUmmak {
  use: (callback: any) => void;
  listen: (port: number, callback: any, token: symbol) => void;
  injectContext: InjectContext;
  get: (name: string, hanlder: UmmakHanlder) => void;
  post: (name: string, hanlder?: UmmakHanlder) => void;
  put: (name: string, hanlder?: UmmakHanlder) => void;
  delete: (name: string, hanlder?: UmmakHanlder) => void;
}
