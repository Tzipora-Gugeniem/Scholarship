import { useDispatch, useSelector } from "react-redux"
import { add,  updateCurrentDetails } from "../../redux/request"
import swal from "sweetalert"
import { useNavigate } from "react-router"
import { useState } from "react"
import { useFiles } from "../../context/FileContext"
import { save } from "../../api/request"
import { useFilePreview } from "../../hooks/useFilePreview"


export const Send=()=>{
  // הגדרת dispatch 
 const dispatch=useDispatch()
const state=useSelector((state)=>state.request.Current) 
 const navigate=useNavigate()
  const { bankAuthFile, idCardFile, studyPermitFile } = useFiles()  // ← גישה למחסן
  // שימוש בהוקס לתצוגה מקדימה-עי שליחת שם הטופס המתאים בכל פעם
  const { toggle: toggleId, Preview: IdPreview } = useFilePreview(idCardFile)
  const { toggle: toggleBank, Preview: BankPreview } = useFilePreview(bankAuthFile)
  const { toggle: toggleStudy, Preview: StudyPreview } = useFilePreview(studyPermitFile)
//  בדיקה שאישר פרטים
const [confirm,setConfirm]=useState(false)
  // הגדרת navigate


  const saveReq = async () => {
    try {
      // בניית FormData
      const formData = new FormData()
      formData.append('self', JSON.stringify(state.self))
      formData.append('family', JSON.stringify(state.family))
      formData.append('skill', JSON.stringify(state.skill))
      formData.append('bank', JSON.stringify(state.bank))
  if (idCardFile) formData.append('idCardFile', idCardFile)
  if (bankAuthFile) formData.append('bankAuthFile', bankAuthFile)
  if (studyPermitFile) formData.append('studyPermitFile', studyPermitFile)
      
      await save(formData)  // ← שליחה לשרת

    // בתוך פונקציית saveReq ב-Send.jsx
swal({
  title: "Success",
  text: "Your request was sent successfully",
  icon: "success",
  timer: 2000,
  buttons: false
}).then(() => { 
  // 1. קודם כל מנווטים החוצה כדי שהקומפוננטות של הטופס יתפרקו (Unmount)
  navigate("/home");
  
  // 2. רק אז מאפסים את הנתונים ב-Redux (אם באמת צריך)
  // עדיף לשלוח null או אובייקט במבנה המקורי
  dispatch(updateCurrentDetails(null)); 
});
    } catch (err) {
      swal({ title: "Error", text: "save failed", icon: "error" })
    }
  }

 return<>


 <div>    
       {/*  הצגת הערכים שנקלטו למשתמש*/}

    <h6>Your Details</h6>
    <p>personal Details</p>
    <div>
       <p>personal Details</p>
      <p> Id:{state.self.idUser}</p>
       <p>Name:{state.self.name+" "+state.self.LName}</p>
       <p>Date:{state.self.dateBorn}</p>
       <p>Address:{state.self.address}</p>
       <p>Phone:{state.self.phone}</p>
       <p>Id card file</p>
        {idCardFile && <>
        <button onClick={toggleId} className="fileButton">📄 {idCardFile.name}</button>
        <IdPreview />
      </>}
    


    </div>
      
         <div>
      <h6 >Family Details</h6>
      <p>Father:{state.family.father}</p>
      <p>Mother:{state.family.mother}</p>
      <p>Number Of Children:{state.family.numChils}</p>
     <p>Children Over 19:{state.family.numAdult} </p>
    </div>
    <div>
      <h6 >Major Details</h6>
      <p>Major:{state.skill.major}</p>
      <p>Toution Fee:{state.skill.tuition}</p>
      <p>Years Of Study:{state.skill.years}</p>
      <p>Study Permit:</p>
         {studyPermitFile && <>
        <button onClick={toggleStudy}>📄 {studyPermitFile.name}</button>
        <StudyPreview />
      </>}
    </div>
        <div>
      <h6 >Bank Details</h6>
      <p>Bank Account Holder:{state.bank.hName}</p>
      <p> Account Number:{state.bank.account}</p>
      <p>Bank Name :{state.bank.bName}</p>
     <p>Bank Branch:{state.bank.branch}</p>
     <p>Bank Authorization:</p>
           {bankAuthFile && <>
        <button onClick={toggleBank} className="fileButton">📄 {bankAuthFile.name}</button>
        <BankPreview />
        </>}
    </div>
 <div   className="form-check my-3"> 
 
<input    className="form-check-input"
    type="checkbox"
    id="confirmCheck"  onChange={(e)=>{setConfirm(e.target.checked)}}></input>
     <label className="form-check-label" htmlFor="confirmCheck">I declare that the above details are correct</label>
</div> 
{/* בלחיצה על הכפתור שמירת הפרטים */}
 <button onClick={(e)=>{saveReq(e)}} disabled={!confirm}>confirm and submit</button>
 </div>

 </>
}