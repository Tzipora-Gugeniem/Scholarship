

import requestModel from "../models/request.js";


export const getAll =(req,res)=>{
    requestModel.find().then(data=>
    {
        res.status(200).send(data)
        })
        .catch(error=>{
          return res.status(500).send(error)   
        })
    }
    
    // קבלת בקשה קיימת עבור משתמש מחובר על פי העוגיה רק עבור בקשה בסטטוס טיוטה 
    // עבור בקשה שכבר הוגשה יחזיר רק סטטוס
    export const getRequest = async (req, res) => {
  try {
    const request = await requestModel.findOne({ user_id: req.user._id });
    if (!request) return res.status(201).json({ message: 'not exists yet' });
    if(request.status !== "draft") return res.status(200).json({ status: request.status,lastSavedAt:request.lastSavedAt,isSubmitted:true });
    
    return res.status(200).json({ request:request, isSubmitted: false });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// שמירת בקשה/טיוטה
export const saveRequest = (status) => async (req, res) => {
  try {
    // parseFormData כבר המיר - משתמשים ישירות
    const self = req.body.self || {}
    const family = req.body.family || {}
    const skill = req.body.skill || {}
    const bank = req.body.bank || {}

    // מכניסים קבצים לתוך האובייקט המתאים
    if (req.files?.idCardFile) {
      self.idCardFile = {
        data: req.files.idCardFile[0].buffer,
        contentType: req.files.idCardFile[0].mimetype
      }
    }
    if (req.files?.bankAuthFile) {
      bank.authFile = {
        data: req.files.bankAuthFile[0].buffer,
        contentType: req.files.bankAuthFile[0].mimetype
      }
    }
    if (req.files?.studyPermitFile) {
      skill.studyPermitFile = {
        data: req.files.studyPermitFile[0].buffer,
        contentType: req.files.studyPermitFile[0].mimetype
      }
    }

    // עכשיו בונים updateData - אחרי שהקבצים כבר בפנים
    const updateData = { 
      self, family, skill, bank,
      status,
      lastSavedAt: new Date()
    }

    const updated = await requestModel.findOneAndUpdate(
      { user_id: req.user._id },
      { $set: updateData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )

    res.status(200).json({ message: "Request saved successfully", request: updated })

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}