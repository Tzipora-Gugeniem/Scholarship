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
export const updateStatus = (status,req,res )=>{
    const { id } = req.params
    requestModel.findByIdAndUpdate(id, { status }, { new: true }).then(data=>
    {
        res.status(200).send(data)
        } )
        .catch(error=>{
          return res.status(500).send(error)   
        })
       }

