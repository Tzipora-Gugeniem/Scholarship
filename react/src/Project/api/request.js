import api from "./api"

 export const save=async(formData)=>{
   try{
     const res = await api.post('request/save', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }  
      
    })
    return res.data
   }
   catch(err){
    throw err
   }
  }
 export const saveDraft=async(formData)=>{
    try{
      const res = await api.post('request/draft', formData, {
       headers: { 'Content-Type': 'multipart/form-data' }      
      })
      return res.data
    } 
    catch(err){
      throw err 
    }
 }
  
//  קבלת בקשה קיימת
export const getRequest=async()=>{
  try{
    const res=await api.get('request/MyReq')

    return res.data
  }   
      catch(err){
      throw err 
    }
 }
  