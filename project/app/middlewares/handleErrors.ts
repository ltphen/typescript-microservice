import { Context, Next } from 'koa';


/**
 * Middleware to handle errors during request processing
 * @param ctx Contains request and response context
 * @param next The callback to proceed to the next middleware or route handler
 * @returns void. In case of an error during execution of the request, it modifies the response context with the error details and appropriate HTTP status code
 */
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
