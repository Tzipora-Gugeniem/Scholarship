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

//שימוש בטוקן לשמירת המשתמש המחובר
export const getMe = async () => {
    try{
        const response = await api.get('/user/me')
        return response.data
    }
    catch(error){
        throw error
    }
}
//התנתקות- 
export const logout = async () => {
    try{
        const response = await api.post('/user/logout')    
        return response.data
    }
    catch(error){
        throw error
    }   }