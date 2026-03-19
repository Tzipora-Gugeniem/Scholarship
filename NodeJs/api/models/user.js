import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    id_user:String,
    selfName:String,
    familyName:String,
    password:String,
      role: { 
    type: String, 
    enum: ["student", "admin"],
    default: "student"  // כל משתמש חדש = student אוטומטית
  }

    
})
export default  mongoose.model('user',userSchema)