import express from "express"
import { getAll, login, register } from "../controller/user.js"
import { registerSchema } from "../validation/user.validator.js"
import { validate } from "../middlewares.js"
const router = express.Router()

router.get('', getAll)
router.post('/register', validate(registerSchema), register)
router.post('/login',login)

export default router
