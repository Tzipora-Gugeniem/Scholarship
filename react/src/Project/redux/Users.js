
// טיפול בפונקציות המשתמשים והמשתמש הנוכחי
import { createSlice } from "@reduxjs/toolkit"

const initialState = {


   Current: null,
isLoading: true,
}
const userSlice = createSlice({
  name: 'User',
  initialState,
  
  //הפונקציות שיופעלו על מערך המשתמשים הוספה ועדכון משתמש נוכחי
  reducers: {

    setCurrent: (state, action) => {
      state.Current = action.payload;
      state.isLoading = false
    },
    setLoadingDone: (state) => {
      state.isLoading = false  // ← למקרה שאין טוקן (catch)
    }
  }
})
//יצוא הפעולות המוגדרות ברדיוסר
export const {setCurrent,setLoadingDone } = userSlice.actions
//הגדרת ברירת מחדל
export default userSlice.reducer