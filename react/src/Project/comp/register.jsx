import { useState } from "react"
import { useNavigate } from "react-router"
import '../css/login.css'
import swal from "sweetalert"
import { useDispatch, useSelector } from "react-redux"
import { setCurrent } from '../redux/Users'
import { register } from "../api/user"
import { current } from "@reduxjs/toolkit"


export const Register = () => {
    const [Obj, setObj] = useState({})
    //יש להשתמש ב dispatch כדי לעדכן את המצב ברידקס
    const dispatch = useDispatch()
    //ייבוא הstate של המשתמש הנוכחי
    // טיפןל בניתובים 
    const navigate = useNavigate()
    
    
    // להתריע למשתמש אם ניסה לשלוח טופס ללא מילוי שדה חובה  
    const [submitted, setSubmitted] = useState(false);
  //ייבוא הstate של המשתמשים
    const state = useSelector((state) => state.User)
    const stateReq=useSelector((state) => state.request.Current)
    //פונקציה לבדיקת תקינות תז
    const validId = (Id) => {
        // בדיקה: בדיוק 9 ספרות
        if (!/^\d{9}$/.test(Id)) return false;

        let sum = 0;
        for (let i = 0; i < 9; i++) {
            let num = Number(Id[i]) * ((i % 2) + 1);
            if (num > 9) num -= 9; // חישוב סכום ספרות
            sum += num;
        }

        return sum % 10 === 0;
    }
    // תקינות סיסמא: לפחות אות אחת ושתי ספרות
    const validPas = (pwd) => {
        if(!pwd) return false;
        return  /[a-zA-Z]/.test(pwd) && (pwd.match(/\d/g) || []).length >= 2;
    }
// //שמירת המשתמש החדש לשרת

const save=async(e)=> {
     e.preventDefault()
     setSubmitted(true);
     const dataForServer = {
            id_user: Obj.Id,
            selfName: Obj.name,
            familyName: Obj.LName,
            password: Obj.password
        };
      if (validId(Obj.Id) && validPas(Obj.password) && Obj.name && Obj.LName) {
        try{
            const data=await register(dataForServer);
            console.log(data);
            
            dispatch(setCurrent(data.user))
            console.log(current);
            
            swal("Welcome!", "You have successfully registered.", "success");
            navigate('/home');

        }
        catch(error){
            // אם המשתמש כבר רשום
            if (error.response?.status === 409) {
                swal("User already exists!", "You will be redirected to the login page.", "info");
                navigate('/logIn');
            }
            // אם השרת החזיר שגיאה (למשל: ת"ז כבר קיימת)
            const msg = error.response?.data?.message || "An error occurred during registration.";
            swal("Oops!", msg, "error");
        }}
        else 
        swal("Check again", "  there are some errors in the form, please correct them and try again.","warning");
}
    return <>
        <div className='container'>
            <form>

                <h3>sigh up  Here</h3>

                <div className="field">
                    <label htmlFor="username">input your id:</label>
                    <input type="text" placeholder="ID" id="username" onChange={(e) =>  setObj({ ...Obj, Id: e.target.value }) }
                      value={Obj.Id || ""} required ></input>
                    {submitted && !Obj.Id && <p style={{ color: "red" }}>please input id</p>}
                    {
                        (Obj.Id && !validId(Obj.Id)) &&
                        <p hidden={validId(Obj.Id)} style={{ color: 'red' }}>  id is not valid</p>
                    }
                 </div>
                <div className="field">
                    <label htmlFor="fn">input your first name:</label>
                    <input type="text" placeholder="first-name" id="fn" onChange={(event) => { setObj({ ...Obj, name: event.target.value }) }} value={Obj.name || ""}  ></input>
                </div>

                <div className="field">
                    <label htmlFor="ln" >input your last name:</label>
                    <input type="text" placeholder="last-name" id="ln" onChange={(event) => { setObj({ ...Obj, LName: event.target.value }) }} value={Obj.LName || ""}  ></input>
                </div>
                <div className="field">
                    <label htmlFor="password">Your password</label>
                    <input type="password" placeholder="Password" id="password" onChange={(event) => { setObj({ ...Obj, password: event.target.value }) }} value={Obj.password || ""} required  ></input>
                    {submitted && !Obj.password && <p style={{ color: "red" }}>please input password</p>}
                    {
                        (Obj.password && !validPas(Obj.password)) &&
                        <p hidden={validPas(Obj.password)} style={{ color: 'red' }}>insert a valid password at least 2 digits and 1 letter       </p>
                    }
                </div>
                <button className="btn btn-light" type="submit" onClick={save} >sigh up</button>
                <button className="btn btn-light" onClick={() => { navigate('/logIn') }} > Do you  have count? login</button>

                <div className="social">
                             <div className="go" color="black"> <img src='./google.png' style={{width:"10%"}}></img>google</div>
          <div className="fb"><img src='./facebook.png' style={{width:"10%"}}></img>facebook</div>
                </div>

            </form> 
        </div>
    </>
}