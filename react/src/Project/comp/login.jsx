
import { useNavigate } from 'react-router'
import '../css/login.css'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrent } from '../redux/Users'
import { useState } from 'react'
import swal from 'sweetalert'
import { login } from '../api/user'
import { updateCurrentDetails } from '../redux/request'
import { getRequest } from '../api/request'
export const LogIn = () => {
  //נשתמש ב usestateכדי להקל על שמירת הנתונים
  const [obj, setObj] = useState({})
  const navigate = useNavigate()
  //הגדרת state
  const state = useSelector((state) => state.User)
  //הגדרת dispatch
  const dispatch = useDispatch()
  //פונקציות לעיצוב הכפתורים

  //פונקציה שמוודאת שהמספר תז שהוכנס קיים במערכת והסיסמא מתאימה

const send = async (e)=>{
if(obj.Id!=null &&obj.Pas)
{
  try{
    const  userData={
       id_user: obj.Id,
      password: obj.Pas
    }
    const data= await login(userData)
    // אנחנו שומרים את המשתמש ברידקס
        dispatch(setCurrent(data.user)); 
      
      
     

        swal("welcome","jknk","success");
        navigate('/home');
    } 
    catch (error) {
      if(error.response?.status===404)
      {
         swal("User isn't exists!", "You will be redirected to the register page.", "info");
          navigate('/register');
      }
     else{  //  תופס כאן שגיאות כמו 401  )
        const errorMsg = error.response?.data?.message||"error";
        swal("Ooops...", errorMsg, "error");} 
    }
}
else
  swal("you need send password and id")
}
  return <>
    <div className='container'>
      <form>

        <h3>Login Here</h3>
        {/* (e)=()=>{e.value}) */}
        <div className="field">
          <label htmlFor="username">Username</label>
          <input type="text" placeholder="Email or Phone" id="username" onChange={(e) => { setObj({ ...obj, Id: e.target.value }) }} value={obj.Id ||""}></input>
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input type="password" placeholder="Password" id="password" onChange={(e) => { setObj({ ...obj, Pas: e.target.value }) }}></input>
        </div>
        <button className="btn btn-light" type="button" onClick={send}>Log In</button>
        <button className="btn btn-light" onClick={() => { navigate('/register') }} >You don't have count? sighin</button>

        <div className="social">
          <div className="go" color="black"> <img src='./google.png' style={{width:"10%"}}></img>google</div>
          <div className="fb"><img src='./facebook.png' style={{width:"10%"}}></img>facebook</div>
        </div>

      </form>
    </div>
  </>
}