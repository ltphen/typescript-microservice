import Router from "koa-router";
import { checkAuth } from "../middlewares/checkAuth";

const router = new Router()
router.use((ctx, next) => checkAuth(ctx, next, "admin"))
router.use("/", (ctx) => {
    ctx.body = "Hello world"
})


export default router;