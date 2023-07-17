import { checkAuth } from "../middlewares/checkAuth";
import DeploymentController from "../controllers/deployment.controller";
import Router from "koa-router";


const deployment = new DeploymentController()
const router = new Router()
// Check webhook key
router.post("deployment/webhook", (ctx, next) => checkAuth(ctx, next, "webhook"), deployment.webhook)

// Middleware for the rest of the project
router.use((ctx, next) => checkAuth(ctx, next, "admin"))
router.get("deployments", deployment.getAll)
router.get("deployments/:id", deployment.getOne)
router.post("deployments/:id/cancel", deployment.cancel)

export default router;