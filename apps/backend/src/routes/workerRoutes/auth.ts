import { Router } from "express";
import { workermiddleware } from "../../middleware/authmiddleware";
import { nextsubmission, nextTask, usersignup } from "../../controllers/workerController/auth";
const router = Router()

router.post('/signup',workermiddleware,usersignup)
router.post('/nextTask',workermiddleware,nextTask)
router.post('/submission',workermiddleware,nextsubmission)

export default router