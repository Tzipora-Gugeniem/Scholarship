import 'dotenv/config';
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import requestRouter from './api/routes/request.js'
import userRouter from './api/routes/user.js'

//4 יצירת שרת
const app=express()
// הוספת יכולת לקרוא עוגיות
app.use(cookieParser())
//
app.use(express.json())
// פתרון בעיית הcors
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
// חיבור למסד הנתונים
console.log('MongoDB URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('connect to mongoDB');
    })
    .catch(error => {
        console.error(error);
    })
app.use('/request', requestRouter)
app.use('/user', userRouter)

const port=3001


//הרצת פרויקט 
app.listen(port,()=>{console.log(`my app is running on 
    http://localhost:${port}`);
})

