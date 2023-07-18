import ProjectController from "../controllers/project.controller";
import Router from "koa-router";


const project = new ProjectController()
const router = new Router()

router.get("/", project.getAll)
router.get("/:id", project.getOne)
router.post("/:id/deployment", project.createDeployment)

export default router;