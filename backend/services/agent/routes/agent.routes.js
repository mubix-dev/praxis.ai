import {Router} from "express"
import { agent, generateTitle } from "../controllers/agent.controller.js"
const router = Router()

router.post("/chat",agent)
router.post("/title", generateTitle)

export default router