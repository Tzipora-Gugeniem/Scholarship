import express from 'express'
import {  bulkUpdateStatus, getAllFilteredRequests, getDetails, updateRequestStatus} from '../controller/admin.js'
import {isAdmin,auth} from '../middlewares.js'
const router = express.Router() 
// פונקציות מנהל כולם נשלחות להרשאה הבודקת האם זה מנהל


router.get('/getfiltered', auth, isAdmin, getAllFilteredRequests) // נקודת קצה לקבלת כל הבקשות עם אפשרות לסינון לפי סטטוס, תאריכים, גיל וכו' - נשתמש בה ב-AllRequests.jsx
router.get('/getDetails/:id', auth, isAdmin, getDetails) // נקודת קצה לקבלת פרטי בקשה מסוימת לפי ID שלה, נשתמש בה ב-Details.jsx
router.put('/updateStatus/:id/status', auth, isAdmin, updateRequestStatus);
router.put('/bulk-status', auth, isAdmin, bulkUpdateStatus)
export default router