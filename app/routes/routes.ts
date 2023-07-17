import Router from "koa-router";
import projectRoutes from "./project.routes"

const router = new Router()

router.use("/projects", projectRoutes.routes(), projectRoutes.allowedMethods())


export default router;