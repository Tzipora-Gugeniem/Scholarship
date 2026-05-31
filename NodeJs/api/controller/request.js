

import requestModel from "../models/request.js";
import fs from 'fs';

    // קבלת בקשה קיימת עבור משתמש מחובר על פי העוגיה רק עבור בקשה בסטטוס טיוטה 
    // עבור בקשה שכבר הוגשה יחזיר רק סטטוס
    export const getRequest = async (req, res) => {
  try {
    const request = await requestModel.findOne({ user_id: req.user._id });
// אם לא קיימת בקשה - מחזירים אובייקט נקי עם דגל false
    if (!request) {
      return res.status(200).json({ exists: false });
    }
    if(request.status !== "draft") return res.status(200).json({ exists: true,status: request.status,lastSavedAt:request.lastSavedAt,isSubmitted:true });
    
    return res.status(200).json({ request:request, isSubmitted: false });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// שמירה ועדכון הבקשה + מחיקת קבצים ישנים
export const saveRequest = (status) => async (req, res) => {
  try {
    // 1. הנתונים שעברו parseFormData
    const self = req.body.self || {};
    const family = req.body.family || {};
    const skill = req.body.skill || {};
    const bank = req.body.bank || {};

    // 2. נשלוף את הבקשה הקיימת מהמסד (אם יש כזו) כדי לבדוק קבצים ישנים
    const existingRequest = await requestModel.findOne({ user_id: req.user._id });

    // 3. טיפול בתעודת זהות
    if (req.files?.idCardFile) {
      // אם המשתמש העלה קובץ חדש ויש קובץ ישן בשרת -> נמחק את הישן מהדיסק
      if (existingRequest?.self?.idCardFile && fs.existsSync(existingRequest.self.idCardFile)) {
        fs.unlinkSync(existingRequest.self.idCardFile);
      }
      self.idCardFile = req.files.idCardFile[0].path; // ← התיקון: שימוש ב-
    } else if (existingRequest?.self?.idCardFile) {
      // אם לא הועלה קובץ חדש, נשמור על הקישור הקיים שלא יימחק מהטופס
      self.idCardFile = existingRequest.self.idCardFile;
    }

    // 4. טיפול באישור בנק
    if (req.files?.bankAuthFile) {
      if (existingRequest?.bank?.authFile && fs.existsSync(existingRequest.bank.authFile)) {
        fs.unlinkSync(existingRequest.bank.authFile);
      }
      bank.authFile = req.files.bankAuthFile[0].path; // ← התיקון: שימוש ב-
    } else if (existingRequest?.bank?.authFile) {
      bank.authFile = existingRequest.bank.authFile;
    }

    // 5. טיפול באישור לימודים
    if (req.files?.studyPermitFile) {
      if (existingRequest?.skill?.studyPermitFile && fs.existsSync(existingRequest.skill.studyPermitFile)) {
        fs.unlinkSync(existingRequest.skill.studyPermitFile);
      }
      skill.studyPermitFile = req.files.studyPermitFile[0].path; // ← התיקון: שימוש ב-
    } else if (existingRequest?.skill?.studyPermitFile) {
      skill.studyPermitFile = existingRequest.skill.studyPermitFile;
    }

    // 6. בניית האובייקט לעדכון
    const updateData = { 
      self, 
      family, 
      skill, 
      bank,
      status,
      lastSavedAt: new Date()
    };

    // 7. עדכון או יצירה במונגו
    const updated = await requestModel.findOneAndUpdate(
      { user_id: req.user._id },
      { $set: updateData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
console.log(updated);

    res.status(200).json({ message: "Request saved successfully", request: updated });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

