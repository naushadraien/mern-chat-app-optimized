import { type Request } from 'express';

const emitEvent = <T>(req: Request, event: string, users: T, data?: string | T) => {
  console.log(req, event, users, data);
};

export { emitEvent };
