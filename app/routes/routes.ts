import Router from "koa-router";
import projectRoutes from "./project.routes"
import deploymentRoutes from "./deployment.routes"

const router = new Router()

router.use("/projects", projectRoutes.routes(), projectRoutes.allowedMethods())
router.use("/", deploymentRoutes.routes(), deploymentRoutes.allowedMethods())


export default router;