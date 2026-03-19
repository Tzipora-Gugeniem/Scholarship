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

      
        //פונקציות מחליפות סטטוס
        allow: (state, action) => {
            let index = state.list.findIndex(x => x.id === action.payload)
            state.list[index].status = "allowed"
           
        },
        reject: (state, action) => {
            let index = state.list.findIndex(x => x.id === action.payload)
            state.list[index].status = "rejected"
        }
        ,
    
            // פונקציה לעדכון פרטי המשתמש הנוכחי
    updateCurrentDetails: (state, action) => {
      
   
  
      state.Current = action.payload }
,
    
    }

})
//ייצוא הפעולות
export const {  allow, reject,updateCurrentDetails } = requestSlice.actions

export const selectWaiting = state => state.request.list.filter(x => x.status === "waiting")


export default requestSlice.reducer