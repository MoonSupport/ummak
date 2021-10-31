import { UmmakHanlder } from '.';

export const listenCallback = (port: number) => () => {
  console.log(`🚀Server running: http://localhost:${port}`);
};

export const defaultPostHandler =
  (name: string): UmmakHanlder =>
  async (req, res) => {
    const { db } = req.context;
    await db.read();
    db.data[name] = req.body;
    await db.write();
    res.send(`successful create data`);
  };
