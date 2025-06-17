import { Router } from "express";
import { home } from "../controllers/homeController";
import { db } from "../controllers/db";


const router = Router()
router.get('/', home)
router.get('/test-db',db)

export default router
