import { createSlice, current } from "@reduxjs/toolkit"



//אובייקט המכיל את מערך בקשות מיועד לשימוש גלובאלי
const initialState = {
    list: [],
 
    Current:{}
}
//הגדרת הפונקציות בהם נשתמש על מערך הבקשות
const requestSlice = createSlice({
    name: 'request',
    initialState,

    reducers: {
// פונקציה  מכניסה את כל הרשימה שהגיעה מהשרת
        setList: (state, action) => {
            state.list = action.payload;
        },
      
        //פונקציות מחליפות סטטוס
        allow: (state, action) => {
            let index = state.list.findIndex(x => x._id === action.payload)
            state.list[index].status = "allowed"
           
        },
        reject: (state, action) => {
            let index = state.list.findIndex(x => x._id === action.payload)
            state.list[index].status = "rejected"
        }
        ,
    
            // פונקציה לעדכון פרטי המשתמש הנוכחי
    updateCurrentDetails: (state, action) => {
      
   
  
      state.Current = action.payload }
,
    clearAll: (state) => {
    state.list = []
    state.Current = {}
}
    
    }


})
//ייצוא הפעולות
export const {  clearAll,allow, reject,updateCurrentDetails,setList } = requestSlice.actions

export const selectWaiting = state => state.request.list.filter(x => x.status === "waiting")


export default requestSlice.reducer