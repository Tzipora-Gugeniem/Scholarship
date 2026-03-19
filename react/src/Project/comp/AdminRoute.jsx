
//פונקמיה זה להגן שמי שאינו מנהל לא יוכל לגשת אל הדפים של המנהלים
import React from "react"
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom"

export const AdminRoute = ({ children }) => {
    const state = useSelector((state) => state.User); 
    // בודק האם מנהל אם כן ממשיך כרגיל אם לא מחזיר לבית
    if(state.Current && (state.Current.Id === '325454767' || state.Current.Id === '215893132')){
  
    return children;
   }
    else
     return <Navigate to="/home" replace />
}
