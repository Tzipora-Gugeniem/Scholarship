import api from './api'
// קבלת כל הבקשות
export const getAllReq=async()=>{
    try{
        const res=await api.get('admin/all')    
        return res
    }
        catch(err){
            throw err
        }   }

// קבלת כל הבקשות שממתינות לאישור
export const getAllWaitingReq=async()=>{
    try{
        const res=await api.get('admin/waiting') 
      
         
        return res;
    }
        catch(err){
            throw err
        }   }
// עד כאן פונקציות הקשורות למנהל לקבלת נתונים מהשרת
export const updateStatus=async(id,status)=>{
   
        const res=await api.put(`admin/updateStatus/${id}/status`,{status}) 
        return res;
    }


// פתיחת פרטים של בקשה מסוימת לפי ID שלה
export const getDetails = async (id) => {

        const res = await api.get(`admin/getDetails/${id}`);
        return res;
   
    }