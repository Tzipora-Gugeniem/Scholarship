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

//קבלת כל הבקשות לפי פילטרים
export const getAllWaitingReq = (queryParams) => {
    // קריאה לנתיב של הפונקציה המאוחדת שמתמודדת עם כל הסינונים והטאבים בשרת
    return api.get(`admin/getfiltered?${queryParams}`); 
};
export const updateStatus=async(id,status)=>{
   
        const res=await api.put(`admin/updateStatus/${id}/status`,{status}) 
        return res;
    }
// אישור בקשות רבות
export const bulkUpdateStatusAPI = async (ids, status) => {
    // מניח שאתה משתמש ב-axios או fetch, שלח בקשת PUT או POST עם ה-Body
    return await api.put("/admin/bulk-status", { ids, status }); 
};

// פתיחת פרטים של בקשה מסוימת לפי ID שלה
export const getDetails = async (id) => {

        const res = await api.get(`admin/getDetails/${id}`);
        return res;
   
    }
// מחיקת בקשה ספציפית כולל הקבצים הקשורים אליה
export const deleteRequest = async (id) => {
    try{
    const res= await api.delete(`admin/delete/${id}`) ;
    return res;}
    catch(err){
        throw err
    }   
}

export const bulkDeleteRequests = async (ids) => {
    try {
        const res = await api.delete('/admin/deleteAll', { data: { ids } });
        return res;
    } catch (err) {
        throw err;
    }
}
