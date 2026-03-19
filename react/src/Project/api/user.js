import api from "./api"
// פונקציות הקשורות למשתמשים -חיבורם לשרת

// הרשמה-גישה לשרת
export const register=async (userData)=>{
    try{
        const response=await api.post('/user/register',userData)
        return response.data
    }
    catch (error)
    {
       throw error
    }
}
// התחברות- גישה לשרת
export const login = async(userDet)=>{
    try{
        const response = await api.post('/user/login',userDet)
        return response.data
    }
    catch(error){
        throw error
    }
}