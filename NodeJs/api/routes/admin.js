import express from 'express'
import {  bulkDeleteRequests, bulkUpdateStatus, deleteRequest, getAllFilteredRequests, getDetails, updateRequestStatus} from '../controller/admin.js'
import {isAdmin,auth} from '../middlewares.js'
const router = express.Router() 
// פונקציות מנהל כולם נשלחות להרשאה הבודקת האם זה מנהל


router.get('/getfiltered', auth, isAdmin, getAllFilteredRequests) // נקודת קצה לקבלת כל הבקשות עם אפשרות לסינון לפי סטטוס, תאריכים, גיל וכו' - נשתמש בה ב-AllRequests.jsx
router.get('/getDetails/:id', auth, isAdmin, getDetails) // נקודת קצה לקבלת פרטי בקשה מסוימת לפי ID שלה, נשתמש בה ב-Details.jsx
router.put('/updateStatus/:id/status', auth, isAdmin, updateRequestStatus);
router.put('/bulk-status', auth, isAdmin, bulkUpdateStatus)
router.delete('/delete/:id', auth, isAdmin, deleteRequest) // נקודת קצה למחיקת בקשה ספציפית כולל הקבצים הקשורים אליה, נשתמש בה ב-Details.jsx
router.delete('/deleteAll', auth, isAdmin, bulkDeleteRequests) // נקודת קצה למחיקת בקשות רבות בו זמנית כולל הקבצים הקשורים אליהן, נשתמש בה ב-AllRequests.jsx
export default router