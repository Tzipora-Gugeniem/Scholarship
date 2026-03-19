import { configureStore } from "@reduxjs/toolkit";
import  UserReducer from './Users';
import requestReducer from './request';

//יצירת מחס


const store = configureStore({
  
    reducer: {
       
           User: UserReducer,
        request: requestReducer
    }
})
export default store