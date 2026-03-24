import { Router } from "express";
import { signup, login } from "../controllers/auth.controller";
import { confirmSignup } from "../controllers/auth.controller";


const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/confirm", confirmSignup);

export default router;