import jsonServer from 'json-server';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { Low, JSONFile } from './cjs_lowdb/bin/index';
import {
  IUmmak,
  NextFunction,
  Application,
  UmmakHanlder,
  InjectContext,
  Request,
  Response,
  RequestHandler,
  ILow,
} from './types';
import { WarningInitConstructorMessage, WarningInitFunctionMessage } from '.';
import { NODE_ENV } from './constants';
import {
  defaultPostHandler,
  defaultPutHandler,
  defaultDeleteHandler,
  listenCallback,
  defaultLoginHandler,
  defaultLogoutHandler,
  defaultAuthHandler,
  defaultAuthMiddleware,
} from './defaultHandler';

const __UMMAK_TOKEN = Symbol('UMMAK');
const validateInnerFunction = (token: symbol, errMessage: string) => {
  return __UMMAK_TOKEN === token
    ? void 0
    : void (function () {
        throw new Error(errMessage);
      })();
};

export class Ummak implements IUmmak {
  public readonly server: Application;
  private readonly db: ILow;
  constructor(filename: string, token: symbol) {
    validateInnerFunction(token, WarningInitConstructorMessage());
    const adapter = new JSONFile(filename);
    this.db = new Low(adapter);
    this.server = jsonServer.create();
  }

  static init(port = 3000, callback = listenCallback, filename = 'db.json') {
    const _instance: IUmmak = new Ummak(filename, __UMMAK_TOKEN);

    const defaultHomepageMiddleWare = jsonServer.defaults();
    _instance.use(defaultHomepageMiddleWare);
    _instance.use(_instance.injectContext(__UMMAK_TOKEN));
    _instance.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );
    _instance.use(bodyParser.json());
    _instance.use(cookieParser());
    process.nextTick(() => _instance.use(jsonServer.router(filename)));

    if (process.env.NODE_ENV !== NODE_ENV.TEST)
      _instance.listen(port, callback(port), __UMMAK_TOKEN);
    return _instance;
  }

  public use(handler) {
    this.server.get;
    this.server.use(handler);
  }

  public listen(port: number, callback: () => void, token: symbol) {
    validateInnerFunction(token, WarningInitFunctionMessage('listen'));
    this.server.listen(port, callback);
  }

  public get(name: string, handler: UmmakHanlder) {
    this.server.get(name, handler as unknown as RequestHandler);
  }

  public post(
    name: string,
    handler: UmmakHanlder = defaultPostHandler(name.substr(1))
  ) {
    this.server.post(name, handler as unknown as RequestHandler);
  }

  public put(
    name: string,
    handler: UmmakHanlder = defaultPutHandler(name.substr(1).split('/')[0])
  ) {
    this.server.put(name, handler as unknown as RequestHandler);
  }

  public delete(
    name: string,
    handler: UmmakHanlder = defaultDeleteHandler(name.substr(1).split('/')[0])
  ) {
    this.server.delete(name, handler as unknown as RequestHandler);
  }

  public auth(name: string = 'users') {
    this.server.post('/login', defaultLoginHandler(name));
    this.server.post('/auth', defaultAuthHandler(name));
    this.server.post('/logout', defaultLogoutHandler(name));
    this.use(defaultAuthMiddleware(name));
  }

  public injectContext: InjectContext = (token: symbol) => {
    validateInnerFunction(token, WarningInitFunctionMessage('injectContext'));
    return (req: Request, res: Response, next: NextFunction) => {
      Object.assign(req, {
        context: { db: this.db },
      });
      next();
    };
  };
}
