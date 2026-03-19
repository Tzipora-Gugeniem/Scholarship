
// טיפול בפונקציות המשתמשים והמשתמש הנוכחי
import { createSlice } from "@reduxjs/toolkit"

const initialState = {


   Current: null

}
const userSlice = createSlice({
  name: 'User',
  initialState,
  //הפונקציות שיופעלו על מערך המשתמשים הוספה ועדכון משתמש נוכחי
  reducers: {

    setCurrent: (state, action) => {
      state.Current = action.payload;
    },

  }
})
//יצוא הפעולות המוגדרות ברדיוסר
export const {setCurrent } = userSlice.actions
//הגדרת ברירת מחדל
export default userSlice.reducer