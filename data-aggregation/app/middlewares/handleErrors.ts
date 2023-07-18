import { Context, Next } from 'koa';

const handleErrors = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.log(err)
    ctx.status = err.status || 500;
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      name: err.name,
      message: err.message
    };
  }
};

export default handleErrors;
