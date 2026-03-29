import { Router } from "express";
import { signup, login, signout } from "../controllers/auth.controller";
import { confirmSignup } from "../controllers/auth.controller";


const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/confirm", confirmSignup);
router.post("/signout", signout);

export default router;