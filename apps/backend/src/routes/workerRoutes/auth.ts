import { Router } from "express";
import { workermiddleware } from "../../middleware/authmiddleware";
import { usersignup } from "../../controllers/workerController/auth";
const router = Router()

router.post('/signup',workermiddleware,usersignup)

export default router