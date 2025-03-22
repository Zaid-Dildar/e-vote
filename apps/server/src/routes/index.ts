import { Router } from "express";
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";
import electionRoutes from "./election.routes";
import voteRoutes from "./vote.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/elections", electionRoutes);
router.use("/votes", voteRoutes);

export default router;
