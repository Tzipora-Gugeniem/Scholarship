import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },

 
  self: {idUser:String,name:String, LName:String, dateBorn: Date, address: String, phone: String, idUser: String, name: String  ,idCardFile: { type: String }}, 
  family:{ father: String, mother: String, numChildren: Number, numAdult: Number },
  skill: { major: String, tuition: Number, years: Number,studyPermitFile: { type: String }},

   bank:{hName:String,account:String,bName:String,branch:String, authFile:{ type: String }},
 
   lastSavedAt: { type: Date, default: null },
 status: {
    type: String,
    default: "draft"
}
});

export default mongoose.model('Request', requestSchema);
