import express from "express"
import { getAll, getRequest, saveRequest } from "../controller/request.js"
import { requestSchema } from "../validation/request.validator.js"
import { auth, parseFormData, uploadFiles, validate } from "../middlewares.js"
const router = express.Router()

router.get('', getAll)
router.get('/myReq', auth, getRequest)
//  משירת טיוטה ושמירת בקשה ישתמשו באותה הפונקציה אך יפעילו בדיקות תקינות שונות וישלחו סטטוס מתאים
router.post('/save', auth,uploadFiles, parseFormData, validate(requestSchema), saveRequest('waiting'))
router.post('/draft',auth,uploadFiles, parseFormData,  saveRequest('draft'))
export default router

