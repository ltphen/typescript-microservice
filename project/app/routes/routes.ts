import Router from "koa-router";
import projectRoutes from "./project.routes"
import deploymentRoutes from "./deployment.routes"

const router = new Router()

router.use("/", deploymentRoutes.routes(), deploymentRoutes.allowedMethods())
router.use("/projects", projectRoutes.routes(), projectRoutes.allowedMethods())


export default router;