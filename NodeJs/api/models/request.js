import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },

 
  self: {idUser:String,name:String, LName:String, dateBorn: Date, address: String, phone: String, idUser: String, name: String  ,idCardFile: {
    data: Buffer,       // הקובץ בפורמט בינארי
    contentType: String // סוג הקובץ (image/png, application/pdf וכו')
  },}, 
  family:{ father: String, mother: String, numChildren: Number, numAdult: Number },
  skill: { major: String, tuition: Number, years: Number,studyPermitFile: {
      data: Buffer,
    contentType: String
  }},

   bank:{hName:String,account:String,bName:String,branch:String, authFile: {
        data: Buffer,
        contentType: String
  }},
 
   lastSavedAt: { type: Date, default: null },
  status: { type: ["waiting", "approved", "rejected"], default: "waiting" }
});

export default mongoose.model('Request', requestSchema);
