import { Router } from "express";
import { workermiddleware } from "../../middleware/authmiddleware";
import { balance, nextsubmission, nextTask, usersignup } from "../../controllers/workerController/auth";
const router = Router()

router.post('/signup',workermiddleware,usersignup)
router.post('/nextTask',workermiddleware,nextTask)
router.post('/submission',workermiddleware,nextsubmission)
router.get('/balance',workermiddleware, balance)

export default router