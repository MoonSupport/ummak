import { UmmakHanlder } from '.';
import lodash from 'lodash';
export const listenCallback = (port: number) => () => {
  console.log(`🚀Server running: http://localhost:${port}`);
};

export const defaultPostHandler =
  (name: string): UmmakHanlder =>
  async (req, res) => {
    const { db } = req.context;
    await db.read();
    db.data[name].push(req.body);
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
