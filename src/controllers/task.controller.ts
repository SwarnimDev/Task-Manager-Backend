import { Request, Response } from "express";
import Project from "../models/project.model";
import Task from "../models/tasks.model";
import { AuthRequest } from "../middleware/authMiddleware";

// CREATE TASK
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const { name, description, status, priority, dueDate } = req.body;

    const project = await Project.findOne({
      _id: projectId,
      owner: req.user!.id,
    });

    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found or unauthorized" });
    }

    const task = await Task.create({
      project: projectId,
      user: req.user!.id,
      name,
      description,
      status,
      priority,
      dueDate,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Error creating task", error: err });
  }
};

// GET TASKS FOR PROJECT
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({ project: projectId }).sort({
      createdAt: -1,
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err });
  }
};

// GET SINGLE TASK
export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task)
      return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Error fetching task", error: err });
  }
};

// UPDATE TASK
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task)
      return res.status(404).json({ message: "Task not found" });

    // Validate task belongs to logged-in user
    const project = await Project.findById(task.project);

    if (!project || project.owner.toString() !== req.user!.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to edit this task" });
    }

    const updated = await Task.findByIdAndUpdate(taskId, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating task", error: err });
  }
};

// DELETE TASK
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task)
      return res.status(404).json({ message: "Task not found" });

    const project = await Project.findById(task.project);

    if (!project || project.owner.toString() !== req.user!.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this task" });
    }

    await task.deleteOne();

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task", error: err });
  }
};
