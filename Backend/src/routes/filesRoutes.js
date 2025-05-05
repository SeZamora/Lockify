import { Router } from "express";
import { createFile, deleteFile, getAllFiles, getFilesById, updateFile } from "../controllers/files.js";

const router = Router();

router.get('/', getAllFiles);
router.get('/:id', getFilesById);
router.post('/', createFile);
router.put('/:id', updateFile);
router.delete('/:id', deleteFile);

export default router;