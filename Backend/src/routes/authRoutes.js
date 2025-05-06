import { Router } from "express";
import { register, login, verifyFace } from "../controllers/auth.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/2fa', verifyFace);

export default router;