import Koa from "koa"
import { Middleware_Error } from "../utils/customErrors";
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import config from "../config/dotenv"


/**
 * Middleware to check user authorization
 * @param ctx Contains request and response context which includes the "authorization" header
 * @param next The callback to proceed to the next middleware or route handler
 * @param authType The type of authorization required: "webhook" or "admin"
 * @returns Promise of any type that proceeds to the next middleware if authorization is valid, or sends a 401 Unauthorized response if not
 */
export const checkAuth = async (ctx: Koa.Context, next: Function, authType: "webhook" | "admin"): Promise<any> => {
    try {
        const authorization: string = ctx.request.get("authorization").replace("Bearer ", "");
        if (!authorization)
            throw new Middleware_Error("Token not found");
        if (authType == "webhook") {
            if (authorization != config.appSecret)
                throw new Middleware_Error("Incorrect secret");
            return next()
        }
        const decoded: any = jwt.verify(authorization, config.jwtSecret);
        if (!decoded || decoded instanceof (JsonWebTokenError || TokenExpiredError)) {
            throw new Middleware_Error("Incorrect token");
        }
        return next()

    } catch (err: any) {
        // console.log(err)
        ctx.status = 401
        ctx.body = {
            name: "Unauthorized",
            message: err.message
        }
    }
}

