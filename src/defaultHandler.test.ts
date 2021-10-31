import { strict as assert } from 'assert';
import { existsSync, unlinkSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { UmmmakRequest, Response } from '.';
import { JSONFile } from './cjs_lowdb/bin/adapters/JSONFile';
import { Low } from './cjs_lowdb/bin/Low';
import {
  defaultAuthMiddleware,
  defaultDeleteHandler,
  defaultLoginHandler,
  defaultPostHandler,
  defaultPutHandler,
} from './defaultHandler';

const file = join(__dirname, 'db.json');
const createMockConnection = (obj: Object) => {
  if (existsSync(file)) {
    unlinkSync(file);
  }

  writeFileSync(file, JSON.stringify(obj));
  const adapter = new JSONFile(file);
  const db = new Low(adapter);
  return db;
};

export async function testDefaultPostHandler() {
  const db = createMockConnection({
    test: [{ id: 1, content: 'mock' }],
  });
  await defaultPostHandler('test')(
    {
      body: {
        id: 2,
        content: 'test',
      },
      context: {
        db,
      },
    } as unknown as UmmmakRequest,
    {
      send: () => {},
    } as unknown as Response
  );
  const result = JSON.parse(readFileSync(file, 'utf-8'));
  assert.deepEqual(result, {
    test: [
      { id: 1, content: 'mock' },
      {
        id: 2,
        content: 'test',
      },
    ],
  });
  unlinkSync(file);
}

export async function testDefaultAutoIncrementHandler() {
  const db = createMockConnection({
    test: [{ id: 1, content: 'mock' }],
  });
  await defaultPostHandler('test')(
    {
      body: {
        content: 'test',
      },
      context: {
        db,
      },
    } as unknown as UmmmakRequest,
    {
      send: () => {},
    } as unknown as Response
  );
  const result = JSON.parse(readFileSync(file, 'utf-8'));
  assert.deepEqual(result, {
    test: [
      { id: 1, content: 'mock' },
      {
        id: 2,
        content: 'test',
      },
    ],
  });
  unlinkSync(file);
}

export async function testDefaultPutHandler() {
  const db = createMockConnection({
    test: [{ id: 1, content: 'mock' }],
  });
  await defaultPutHandler('test')(
    {
      params: {
        id: 1,
      },
      body: {
        content: 'test',
      },
      context: {
        db,
      },
    } as unknown as UmmmakRequest,
    {
      send: () => {},
    } as unknown as Response
  );
  const result = JSON.parse(readFileSync(file, 'utf-8'));
  assert.deepEqual(result, {
    test: [{ id: 1, content: 'test' }],
  });
  unlinkSync(file);
}

export async function testDefaultDeleteHandler() {
  const db = createMockConnection({
    test: [{ id: 1, content: 'mock' }],
  });
  await defaultDeleteHandler('test')(
    {
      params: {
        id: 1,
      },
      context: {
        db,
      },
    } as unknown as UmmmakRequest,
    {
      send: () => {},
    } as unknown as Response
  );
  const result = JSON.parse(readFileSync(file, 'utf-8'));
  assert.deepEqual(result, {
    test: [],
  });
  unlinkSync(file);
}

export async function testDefaultLoginHandler() {
  const userinfo = { username: 'test', content: 'ummak' };
  const db = createMockConnection({
    users: [userinfo],
  });
  const req = {
    body: userinfo,
    context: {
      db,
    },
    cookies: {},
  } as unknown as UmmmakRequest;
  const next = () => {};
  const res = {
    send: () => {},
    status: (num: number) => res,
    cookie: (name, token) => {
      req.cookies[name] = token;
    },
  } as unknown as Response;

  await defaultLoginHandler()(req, res);
  await defaultAuthMiddleware()(req, res, next);
  assert.equal(req.user['username'], userinfo['username']);
  assert.equal(req.user['content'], userinfo['content']);
}

export async function testDefaultNoLoginHandler() {
  const userinfo = { username: 'test', content: 'ummak' };
  const db = createMockConnection({
    users: [userinfo],
  });
  const req = {
    body: userinfo,
    context: {
      db,
    },
    cookies: {},
  } as unknown as UmmmakRequest;
  const next = () => {};
  const res = {
    send: () => {},
    status: (num: number) => res,
    cookie: (name, token) => {
      req.cookies[name] = token;
    },
  } as unknown as Response;

  await defaultAuthMiddleware()(req, res, next);
  assert.equal(req.user, undefined);
}
