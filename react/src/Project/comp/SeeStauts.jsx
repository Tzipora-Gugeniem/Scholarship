import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { setCurrent } from "../redux/Users";
import { Box, Typography } from "@mui/material";
import { getRequest } from "../api/request";
import { Loading } from "./Loading";


export const SeeStatus=()=>{

    

  const currentUser = useSelector((state) => state.User?.Current);
  const [req, setReq] = useState(null);
  // סימון טעינה בזמן שליפת הנתונים מהשרת
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let isMounted = true;

    // ✅ אם אין משתמש — נקה ואל תשלח בקשה
    if (!currentUser) {
        setReq(null);
        setLoading(false);
        return;
    }

    setLoading(true); // ✅ איפוס loading בכל פעם שמשתמש משתנה

    const fetchReq = async () => {
        try {
            const res = await getRequest();
            if (isMounted) setReq(res);
        } catch (err) {
            console.error("Error fetching request:", err);
            if (isMounted) setReq(null);
        } finally {
            if (isMounted) setLoading(false);
        }
    };

    fetchReq();
    return () => { isMounted = false; };

}, [currentUser]); // ✅ מקשיב לכל שינוי במשתמש, כולל null
 //בהתאם לסטטוס הבקשה עיצובי סטטוס
  const statusStyles = {
  waiting: {
    border: "2px solid #f1c40f",
    backgroundColor: "#fffbea",
    color: "#f39c12",
    message: "Your request is still under review",
  },
  allowed: {
    border: "2px solid #2ecc71",
    backgroundColor: "#eafaf1",
    color: "#27ae60",
    message: "Your request has been approved",
  },
  rejected: {
    border: "2px solid #e74c3c",
    backgroundColor: "#fdecea",
    color: "#c0392b",
    message: "We’re sorry, your request has been rejected.",
  },
};
if (loading) {
    return <Loading></Loading>
  }
    return<>
    
<div style={{ height: '20vh' }}></div> {/* רווח מעל הקופסה */}

    <Box
      sx={{
        
        display: "flex",
        justifyContent: "center", // מרכז אופקי
                           // רווח מהתפריט Navbar
      }}
 >
      <Box    style={statusStyles[req?.status]}
        sx={{
          width: { xs: "90%", sm: "60%", md: "40%" }, // רוחב גמיש לפי מסך
          
          borderRadius: 3,      // פינות עגולות
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          backgroundColor: "#ffffff", // לבן
          textAlign: "center",
          border: "2px solid #1abc9c" 
        }}
      >
        {!req ? (
    <Typography variant="h6">No request found for current user.</Typography>
) : (
    <>
        <Typography variant="h4" sx={{ color: "#000000", fontWeight: "bold", mb: 2 }}>
            {req?.status?.toUpperCase()}
        </Typography>
        <p>{statusStyles[req.status]?.message}</p>
        <Typography variant="h6">
            {currentUser?.name} {currentUser?.LName}
        </Typography>
    </>
)}
      </Box>
    </Box>

 
    </>
}