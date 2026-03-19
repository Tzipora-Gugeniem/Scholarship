import { useSelector } from "react-redux";
import { setCurrent } from "../redux/Users";
import { Box, Typography } from "@mui/material";

export const SeeStatus=()=>{

    
  // שליפת המשתמש הנוכחי
  const currentUser = useSelector(state => state.User?.Current);

  // רשימת כל הבקשות
  const allRequests = useSelector(state => state.request?.list || []);

  // מחפש את הבקשה של המשתמש הנוכחי
  const req = currentUser ? allRequests.find(r => r.self.idUser === currentUser.Id) : null;
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
        {req ? (
          <>
        
            {/* סטטוס הבקשה גדול ושחור */}
            <Typography variant="h4" sx={{ color: "#000000", fontWeight: "bold", mb: 2 }}>
              {req.status.toUpperCase()}
              <br></br>
        
            </Typography>

<p>{req.status==="waiting"?<span> Your request is still under review</span>:req.status==="allowed"?<span> Your request has been approved</span>:<span>  We’re sorry, your request has been rejected.</span>}</p>
            {/* שם פרטי ושם משפחה */}
            <Typography variant="h6" sx={{ color: "#141616ff", mb: 1 }}>
              {currentUser.name} {currentUser.LName}
            </Typography>
           
          </>
        ) : (
          <Typography variant="h6" sx={{ color: "#000" }}>
            No request found for current user.
          </Typography>
        )}
      </Box>
    </Box>
  {/* <Box     sx={{
          // גמישות לרוחב מסך
          p: 4,
          borderRadius: 2,
          boxShadow: "0 0 40px rgba(8, 7, 16, 0.6)",
          backgroundColor: "#fff",
          textAlign: "center"
        }}>
    {req?.status}
    </Box>
    {
        console.log(req?.status)
        
    } */}
    </>
}