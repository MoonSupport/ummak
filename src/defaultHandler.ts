import { UmmakHanlder, UmmmakRequest } from '.';
import lodash from 'lodash';
import jwt from 'jsonwebtoken';
import { JWT_TOKEN } from './constants';
import { Response, NextFunction } from './types';
export const listenCallback = (port: number) => () => {
  console.log(`🚀Server running: http://localhost:${port}`);
};

export const defaultPostHandler =
  (name: string): UmmakHanlder =>
  async (req, res) => {
    const { db } = req.context;
    await db.read();
    const resources = db.data[name];
    if (!req.body.id) {
      const incrementID = resources[resources.length - 1].id + 1 || 1;
      Object.assign(req.body, { id: incrementID });
    }
    resources.push(req.body);
    await db.write();
    res.send(`successful create data`);
  };

export const defaultPutHandler =
  (name: string): UmmakHanlder =>
  async (req, res) => {
    const { db } = req.context;
    const { id } = req.params;
    const body = req.body;
    await db.read();
    db.chain = lodash.chain(db.data);
    const target = db.chain
      .get(name)
      .find({ id: parseInt(id) })
      .value();
    if (!target) {
      res.status(403).send(`Can not find object id: ${id}`);
      return;
    }
    Object.assign(target, { ...body });
    await db.write();
    res.send(`successful update data id: ${id}`);
  };

export const defaultDeleteHandler =
  (name: string): UmmakHanlder =>
  async (req, res) => {
    const { db } = req.context;
    const { id } = req.params;

    await db.read();
    db.chain = lodash.chain(db.data);

    await db.chain
      .get(name)
      .remove({ id: parseInt(id) })
      .value();

    await db.write();

    res.send(`successful delete data id: ${id}`);
  };

export const defaultLoginHandler =
  (name: string = 'users'): UmmakHanlder =>
  async (req, res) => {
    const payload = req.body;
    const { db } = req.context;
    await db.read();
    db.chain = lodash.chain(db.data);
    const user = db.chain.get(name).find(payload).value();
    if (!user) {
      res.status(400).send('Can not find User');
      return;
    }
    const token = jwt.sign(user, JWT_TOKEN);
    res.cookie(name, token);
    res.status(201).send(token);
  };

export const defaultLogoutHandler =
  (name: string = 'users'): UmmakHanlder =>
  async (req, res) => {
    res.clearCookie(name);
    delete req.user;
    res.status(200).send('logout');
  };

export const defaultAuthHandler =
  (name: string): UmmakHanlder =>
  async (req, res) => {
    const token = req.cookies && req.cookies[name];
    if (!token) {
      return res.status(403).send('You need to login for authenticate');
    }
    const decoded = jwt.verify(token, JWT_TOKEN);
    return res.status(200).send(decoded);
  };

export const defaultAuthMiddleware =
  (name: string = 'users') =>
  async (req: UmmmakRequest, res: Response, next: NextFunction) => {
    const token = req.cookies && req.cookies[name];
    if (!token) {
      next();
      return;
    }
    const decoded = jwt.verify(token, JWT_TOKEN);
    if (decoded) {
      req.user = decoded;
    }
    next();
  };
