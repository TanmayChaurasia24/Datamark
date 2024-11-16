import { Router } from "express";
import { usersignup,task, taskk } from "../../controllers/userController/auth";
import { authmiddleware } from "../../middleware/authmiddleware";

const router = Router();

router.post('/signup', usersignup);
router.post('/task',authmiddleware, task);
router.get('/task',authmiddleware, taskk);

export default router;
