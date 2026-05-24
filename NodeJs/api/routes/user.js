import express from "express"
import { getAll, getMe, login, logout, register } from "../controller/user.js"
import { registerSchema } from "../validation/user.validator.js"
import { validate } from "../middlewares.js"
const router = express.Router()

router.get('', getAll)
router.post('/register', validate(registerSchema), register)
router.post('/login',login)
router.post('/logout',logout)
router.get('/me', getMe) // נשתמש בפונקציה הזו גם כדי לקבל את פרטי המשתמש המחובר על ידי שליחת הטוקן שלו לשרת ונבדוק אותו שם

export default router
