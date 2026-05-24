import userModel from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// הגדרת העוגיה
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // auto-switches for prod/dev
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000 // 24 hours — must match JWT expiry below
}
// צפיה בכל המשתמשים מנהל בלבד
export const getAll=(req,res)=>{
  userModel.find().then(data=>
     {
         res.status(200).send(data)
         })
         .catch(error=>{
           return res.status(500).send(error)   
         })
        }

// הוספת משתמש חדש 
export const register = async (req, res) => {
    try {
        const { id_user, selfName, familyName, password } = req.body;

        // בדיקה אם קיים
        const existingUser = await userModel.findOne({ id_user });
        if (existingUser) return res.status(409).send('User already exists!');

        // הצפנה ושמירה
        const hashedPass = await bcrypt.hash(password, 10);
        const newUser =await new userModel({ id_user, selfName, familyName, password: hashedPass }).save();
       
    const token = jwt.sign(
      { id_user, _id: newUser._id },
      process.env.SECRET,
      { expiresIn: '24h' } // 
    )
        // --- שתילת עוגיה (כדי שיכנס מחובר) ---
      
      res.cookie('token', token, COOKIE_OPTIONS);
      res.status(200).json({ message: "User registered and logged in successfully",user:{
      Id:newUser.id_user,
      name:newUser.selfName,
      LName:newUser.familyName,
      role: newUser.role
      }});
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// התחברות
export const login=async (req,res)=>{
try{
  const {id_user,password}=req.body
  // מציאת המשתמש
 
  const user=await userModel.findOne({id_user})
  if(!user)  { return res.status(404).json({ message: 'User not found' }) }

    // בדיקת סיסמה
    const result=user && await bcrypt.compare(password,user.password)
    if(!result)
    { return res.status(401).json({ message: 'Invalid credentials' })}
    // יצירת טוקן
    const token=jwt.sign({id_user,_id:user._id},process.env.SECRET,{
      expiresIn:'24h'
    })
 
    res.cookie('token', token, COOKIE_OPTIONS)
   res.status(200).json({ message: 'Login successful', user: {
          
                Id: user.id_user,      // התאמה ל-State בריאקט
                name: user.selfName,
                LName: user.familyName,
                role: user.role
            }});
  }
  catch(err){
 res.status(500).json({ message: 'Server error', error: err.message })
  }
  
}
//שימוש בטוקן לשמירת המשתמש המחובר
export const getMe = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: 'No token' });

        const decoded = jwt.verify(token, process.env.SECRET);
        const user = await userModel.findById(decoded._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ user: {
            Id: user.id_user,
            name: user.selfName,
            LName: user.familyName,
            role: user.role
        }});
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
}
//יציאה מהמערכת
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', COOKIE_OPTIONS);
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error during logout', error: err.message });
    }
}