import express from 'express'
import { getAll, getAllWaiting, updateRequestStatus} from '../controller/admin.js'
import {isAdmin,auth} from '../middlewares.js'
const router = express.Router() 
// פונקציות מנהל כולם נשלחות לההרשאה הבודקת האם זה מנהל


router.get('/all',auth, isAdmin, getAll)
router.get('/waiting', auth, isAdmin, getAllWaiting)

router.put('/updateStatus/:id/status', auth, isAdmin, updateRequestStatus);
export default router