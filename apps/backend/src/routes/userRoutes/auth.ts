import { Router } from "express";
import { usersignup } from "../../controllers/userController/auth"; // Check if this path is correct
const router = Router();

router.post('/signup', usersignup);

export default router;
