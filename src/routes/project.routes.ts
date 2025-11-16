import express from "express";
import auth from "../middleware/authMiddleware";
import { createProject, getProjects, getProjectById, updateProject, deleteProject } from "../controllers/project.controller";

const router = express.Router();

router.use(auth); // Protect all project routes

router.route("/")
  .post(createProject)
  .get(getProjects);

router.route("/:id")
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

export default router;
