import { Router } from "express";
import { signup, login, getCurrentUser, requestAccess } from "../controllers/authController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post('/request-access', requestAccess)
router.get('/me', authenticate, getCurrentUser)

export default router;
