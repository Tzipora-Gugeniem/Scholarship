
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from 'react-router';
import swal from 'sweetalert';
import { useDispatch, useSelector } from 'react-redux';

import '../css/nav.css';
import { logout } from '../api/user';
import { setCurrent } from '../redux/Users';
import { clearAll, updateCurrentDetails } from '../redux/request';

export const Nav = () => {
    const state = useSelector((state) => state.User); 
      //הגדרת dispatch
  const dispatch = useDispatch()
    // בדיקה האם המשתמש הנוכחי מנהל
    const manager=()=>{ 
        if(state.Current && (state.Current.role==='admin')){
   
         return   ( 
        <> 
             <li className="nav-item">
                        <NavLink to="AllRequests" className="nav-link" >see Request</NavLink>
              </li>
         </>  
       ) } 
       return null
    }

    // פונקציה לטיפול בהתנתקות עם דיאלוג אישור
   const handleLogout = async () => {
  // 1. מציגים את הדיאלוג ומחכים לתשובה של המשתמש 
  const isConfirmed = await swal({
    title: "Are you sure you want to log out?",
    text: "You will need to log in again to access your account.",
    icon: "warning",
    buttons: {
      cancel: { text: "Cancel", value: false, visible: true },
      confirm: { text: "Confirm", value: true }
    }
  });

  // 2. אם המשתמש התחרט או לחץ cancel, עוצרים מיד (Early Return)
  if (!isConfirmed) return;

  // 3. אם הוא אישר, מבצעים את תהליך ההתנתקות בראש שקט
  try {
    await logout(); // קריאה לשרת
    dispatch(setCurrent(null)); // איפוס רידקס
    dispatch(clearAll());
    swal("Logged out", "You have been successfully logged out.", "success");
    // כאן תוכלי להוסיף ניווט אם תרצי, למשל: navigate('/login');
  } catch (err) {
    console.error("Logout failed:", err);
    swal("Error", "An error occurred while logging out. Please try again.", "error");
  }
};
    return (
    
        <nav className="navbar navbar-expand navbar-dark bg-dark" >
            {console.log(state.Current)}
            
           <NavLink className="nav-link" to="home">   <img src="../logo7.png" className="navbar-brand" width={70} ></img> </NavLink>
            
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav mr-auto" style={{ width: '100%', justifyContent: 'space-evenly' }}>
                    <li className="nav-item active">
                        <NavLink className="nav-link" to="home">  Home</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="SendRequest"className="nav-link">SendRequest</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="MyStatus" className="nav-link" >See status</NavLink>
                    </li>
                     {manager()}
                     {/* יציג רק כששם שמשתמש מלא */}
                     {state.Current?.name? <li className="nav-item nav-link" style={{border:" 5px solid #59d3deff"}}> Hello {state.Current.name}</li>:null}
                    <div className="ml-auto">
                        {state.Current ? (
                            <div className="btn btn-light" onClick={handleLogout  } >Log Out</div>
                        ) : (
                            <>
                    <NavLink to="register"> <div className="btn btn-outline-light mr-2" >Sign Up</div></NavLink>
                    <NavLink to="logIn"> <div className="btn btn-light" >Login</div></NavLink></>)}
                    </div>
                </ul>

            </div>
        </nav>
        
    );
};








