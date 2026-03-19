import jwt from 'jsonwebtoken'
import multer from "multer";
// בדיקות תקינות-פונקתיה גנרית המשתמשת בפונקציות תקינות שוננות עבור כל סכמה
export const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
        // מחזיר רשימה של כל השגיאות שנמצאו
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({ errors: errorMessages });
    }
    
    next(); // הכל תקין? עוברים לפונקציה הבאה (ה-Controller)
};


// בדיקת הרשאות
// בדיקה שהמשתמש מחובר
export const auth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });      
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded; // מוסיפים את המידע של המשתמש לבקשה
        next();
    } catch (err) {
        console.log(err.message);
        
        res.status(401).json({ message: 'Invalid token' });
    }   
};


// בדיקה האם המשתמש מנהל
export const isAdmin=(req,res,next)=>{
  if(req.user.role===!'admin'){
        return  res.status(403).send("you are not allowed")

    }
  
        next()
}

const storage = multer.memoryStorage();
// הגנה על המסד מפני חדירת קבצים מסוכנים
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowed.includes(file.mimetype)) cb(null, true)
  else cb(new Error('only pdf,png,jpeg files'))
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});
// הגדרת הקבצים בשדות
// middlewares.js
export const uploadFiles = upload.fields([
  { name: 'idCardFile', maxCount: 1 },
  { name: 'bankAuthFile', maxCount: 1 },
  { name: 'studyPermitFile', maxCount: 1 }
])
// המרה לגייסון את הקבצים שנשלחו מהלקוח
export const parseFormData = (req, res, next) => {
  try {
    if (req.body.self) req.body.self = JSON.parse(req.body.self)
    if (req.body.family) req.body.family = JSON.parse(req.body.family)
    if (req.body.skill) req.body.skill = JSON.parse(req.body.skill)
    if (req.body.bank) req.body.bank = JSON.parse(req.body.bank)
    next()
  } catch (err) {
    res.status(400).json({ message: 'נתונים לא תקינים' })
  }
}