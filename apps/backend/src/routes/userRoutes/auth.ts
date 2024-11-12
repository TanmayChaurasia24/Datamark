import { Router } from "express";
import { usersignup,task } from "../../controllers/userController/auth";
import { authmiddleware } from "../../middleware/authmiddleware";

const router = Router();

router.post('/signup', usersignup);
router.post('/task',authmiddleware, task);

export default router;
