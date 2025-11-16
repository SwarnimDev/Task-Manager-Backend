import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Project from "../models/project.model";

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Project name is required" });

    const project = await Project.create({
      name,
      description,
      owner: req.user!.id,
    });

    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const projects = await Project.find({ owner: req.user!.id }).sort({ updatedAt: -1 });
    res.json(projects);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user!.id,
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user!.id },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Project not found" });

    res.json(updated);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user!.id,
    });

    if (!deleted) return res.status(404).json({ message: "Project not found" });

    res.json({ message: "Project deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
