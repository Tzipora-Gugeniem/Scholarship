import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { setCurrent } from "../redux/Users";
import { Box, Typography } from "@mui/material";
import { getRequest } from "../api/request";


export const SeeStatus=()=>{

    

  const currentUser = useSelector((state) => state.User?.Current);
  const [req, setReq] = useState(null);
  // סימון טעינה בזמן שליפת הנתונים מהשרת
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let isMounted = true;
    const fetchReq = async () => {
      try {
      
        const res  = await getRequest();
        console.log(res.status);
        if (isMounted) setReq(res); 
        
      } catch (err) {
        console.error("Error fetching request:", err);
        if (isMounted) setReq("not_found");
      }
       finally {
        setLoading(false);
      } 
    };

    fetchReq();
    return () => {
      isMounted = false;
    };
  }, [currentUser?.id]);
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
    return <div style={{ marginTop: '25vh', textAlign: 'center' }}>Loading your request status...</div>;
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
        {req && req !== "not_found" && req.isSubmitted ? (
          <>
        
            {/* סטטוס הבקשה גדול ושחור */}
            <Typography variant="h4" sx={{ color: "#000000", fontWeight: "bold", mb: 2 }}>
              {req?.status?.toUpperCase()}
              <br></br>
        
            </Typography>

<p>{req?.status==="waiting"?<span> {statusStyles.waiting.message}</span>:req?.status==="allowed"?<span> {statusStyles.allowed.message}</span>:<span> {statusStyles.rejected.message}</span>}</p>
            {/* שם פרטי ושם משפחה */}
            <Typography variant="h6" sx={{ color: "#141616ff", mb: 1 }}>
              {currentUser?.name} {currentUser?.LName}

            </Typography>
           
          </>
        ):  (req==="not_found"&&
        

          <Typography variant="h6" sx={{ color: "#000" }}>
            No request found for current user.
          </Typography>
        )}
      </Box>
    </Box>

 
    </>
}