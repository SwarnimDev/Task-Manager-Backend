import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";
import auth from "../middleware/authMiddleware";

const router = express.Router();

// Protect all task routes
router.use(auth);

router.route("/project/:projectId")
  .post(createTask)
  .get(getTasks);

// SINGLE TASK MANAGEMENT
router.route("/:taskId")
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

export default router;
