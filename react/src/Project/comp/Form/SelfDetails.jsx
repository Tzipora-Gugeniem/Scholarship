import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { updateCurrentDetails } from "../../redux/request"
import { useFiles } from "../../context/FileContext"
import { useFilePreview } from "../../hooks/useFilePreview"

export const SelfDetails = () => {
  //שליפת משתמש נוכחי
  const state = useSelector((state) => state.User?.Current)
  // ייבוא משתנים לטיפול בטפסים
  const {idCardFile, setIdCardFile}=useFiles()
    const { toggle: toggleId, Preview: IdPreview } = useFilePreview(idCardFile)
  const stateReq=useSelector((state)=>state?.request?.Current)
  const initialSelfDetails ={...stateReq?.self ,idUser: state?.Id, name: state?.name  ,LName:state?.LName} ;

  const [self, setSelf] = useState({

    ...initialSelfDetails
  });



  //הגדרת dispatch
  const dispatch = useDispatch()
//משתנים לסיוע בבדיקות תקינות
const [correctPhone,setCorrectPhone]=useState(true)
const [correctDate,setCorrectDate]=useState(true)
  const isComplete = !!(self.dateBorn && self.address && self.phone&&correctPhone&&correctDate&&idCardFile)+!!(correctPhone&&correctDate)
  
  //בעת שינוי של אחד הערכים שמירה ברידקס  

  useEffect(() => {

    
  if (stateReq) {
        dispatch(updateCurrentDetails({ ...stateReq,selfValid:isComplete, self: { ...self } }))
     
        
    }  
       
  //כדי לעדכן תקין או לא  

  }, [isComplete,self])

//חישוב התאריך המאוחר ביותר שניתן להזין 1לפני 16 שנה
const today = new Date();
const maxDate=new Date(today.getFullYear() - 16, today.getMonth(), today.getDate())
  .toISOString()
  .split("T")[0];

  return <>



    <div className="input">
      <label name="tz" >id </label>
      <input name="tz" readOnly="true" value={self.idUser}></input>
      <label name="name" >first name  </label>
      <input name="name" value={self.name} readOnly="true"></input>
      <label name="namef">Last name </label>
      <input name="namef" value={self.LName} readOnly="true"></input>
      <label name="date" > Date born </label>
      <input name="date" type="date" onChange={(e) => {
        setSelf({ ...self, dateBorn: e.target.value })
      }} value={self.dateBorn?.split("T")[0]||''} 
      //קביעת התאריך המאוחר ביותר- לפני 16 שנה 
      max={maxDate}
        //בדיקת תינות 
         onBlur={(e)=>{setCorrectDate(e.target.validity.valid)}}
      ></input>
              {/* יןצג בעת שגיאה */}
        <p hidden={correctDate} style={{color:'red'}}>You must be at least 16 years old</p>
       <label name="address">Address </label>
      <input name="address" onChange={(e) => {
        setSelf({ ...self, address: e.target.value })}}
      
        value={self.address}></input>

      <label name="phone">Phone Number </label>
      <input name="phone"  onChange={(e) => {
      setSelf({ ...self, phone: e.target.value })
    }} value={self.phone} pattern="0\d{8,9}" 
    onBlur={(e)=>{setCorrectPhone(e.target.validity.valid) 
       }}></input> 
       {/* שגיאה */}
    <p hidden={correctPhone} style={{color:'red'}}>Valid phone number: 9–10 digits, starting with 0</p>
    {/* צילום ת"ז */}
  <input id="idCardFile" type="file" accept=".jpg,.png,.pdf"
  onChange={(e) => setIdCardFile(e.target.files[0])}
  style={{ display: 'none' }} />
<label htmlFor="idCardFile"  className="btn" style={{borderColor:'#009FAF',width:'50%',}} >
  📎Upload Identity Card
</label>

      {idCardFile && <>
        <button onClick={toggleId} className="fileButton">📄 {idCardFile.name}</button>
        <IdPreview />
      </>}



</div>
  </>
}

