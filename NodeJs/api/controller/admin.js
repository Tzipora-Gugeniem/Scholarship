// כל הפעולות שהמנהל היחיד שמורשה לבצע
import requestModel from "../models/request.js";
// צפו בכל הבקשות שלא בסטטוס טיוטה
export const getAll =(req,res)=>{
    requestModel.find({ status: { $ne: "draft" } }).then(data=>
    {
        res.status(200).send(data)
        })
        .catch(error=>{
          return res.status(500).send(error)   
        })
    }
//כל הבקשות שהם בסטטוס ממתינים
export const getAllWaiting =(req,res)=>{
    requestModel.find({ status: "waiting" }, 'self.name self.LName self.idUser skill.major status')
        .then(data => {
            res.status(200).json(data);
        })
        .catch(error=>{
          return res.status(500).send(error)   
        })  
       }

//עדכון סטטוס של בקשה מסוימת
//סרוב או אישור

export const updateRequestStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'allowed' או 'rejected'

    // ולידציה בסיסית - הגנה מפני סטטוסים לא חוקיים
    if (!['allowed', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    try {
        const updated = await requestModel.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const getDetails = async (req, res) => {
    const { id } = req.params;  
    try {
        const request = await requestModel.findById(id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }       
        res.status(200).json(request);
    } catch (err) {
        res.status(500).json(err);
    }     }
