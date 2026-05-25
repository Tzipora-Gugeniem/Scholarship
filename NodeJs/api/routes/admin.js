import express from 'express'
import { getAll, getAllWaiting, getDetails, updateRequestStatus} from '../controller/admin.js'
import {isAdmin,auth} from '../middlewares.js'
const router = express.Router() 
// פונקציות מנהל כולם נשלחות לההרשאה הבודקת האם זה מנהל


router.get('/all',auth, isAdmin, getAll)
router.get('/waiting', auth, isAdmin, getAllWaiting)
router.get('/getDetails/:id', auth, isAdmin, getDetails) // נקודת קצה לקבלת פרטי בקשה מסוימת לפי ID שלה, נשתמש בה ב-Details.jsx
router.put('/updateStatus/:id/status', auth, isAdmin, updateRequestStatus);
export default router