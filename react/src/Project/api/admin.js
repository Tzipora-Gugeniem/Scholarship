import api from './api'

export const getAllReq=async()=>{
    try{
        const res=await api.get('admin/all')    
        return res
    }
        catch(err){
            throw err
        }   }


export const getAllWaitingReq=async()=>{
    try{
        const res=await api.get('admin/waiting') 
      
         
        return res;
    }
        catch(err){
            throw err
        }   }