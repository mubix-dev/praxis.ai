import {Router} from "express"
import { agent, generateTitle } from "../controllers/agent.controller.js"
import multer from "../utils/multer.js"
const router = Router()

router.post("/chat",multer.single("file"),agent)
router.post("/title", generateTitle)

export default router