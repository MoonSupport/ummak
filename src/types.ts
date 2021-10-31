import { Request, Response, NextFunction } from 'express';
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
  db: Low;
}
export interface UmmmakRequest extends Request {
  context: UmmakContext;
}

export interface IJSONServer {
  use: (callback: any) => void;
  listen: (port: number, callback: any, token: symbol) => void;
  injectContext: InjectContext;
  get: (name: string, hanlder: UmmakHanlder) => void;
  post: (name: string, hanlder?: UmmakHanlder) => void;
}
