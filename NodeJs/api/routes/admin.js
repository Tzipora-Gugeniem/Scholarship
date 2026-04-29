import express from 'express'
import { getAll, getAllWaiting } from '../controller/admin.js'
import {isAdmin,auth} from '../middlewares.js'
const router = express.Router() 
// פונקציות מנהל כולם נשלחות לההרשאה הבודקת האם זה מנהל

import { getAll, getAllWaiting } from '../controller/admin.js'
router.get('/all',auth, isAdmin, getAll)
router.get('/waiting', auth, isAdmin, getAllWaiting)

export default router