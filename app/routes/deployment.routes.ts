import DeploymentController from "../controllers/deployment.controller";
import Router from "koa-router";


const deployment = new DeploymentController()
const router = new Router()

router.get("deployments", deployment.getAll)
router.get("deployments/:id", deployment.getOne)
router.post("deployments/:id/cancel", deployment.cancel)
router.post("deployment/webhook", deployment.webhook)
export default router;