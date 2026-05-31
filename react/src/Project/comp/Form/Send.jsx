import { useDispatch, useSelector } from "react-redux"
import { updateCurrentDetails } from "../../redux/request"
import swal from "sweetalert"
import { useNavigate } from "react-router"
import { useState } from "react"
import { useFiles } from "../../context/FileContext"
import { save } from "../../api/request"
import { useFilePreview } from "../../hooks/useFilePreview"

export const Send = () => {
  const dispatch = useDispatch()
  const state = useSelector((state) => state.request.Current) 
  const navigate = useNavigate()
  const { authFile, idCardFile, studyPermitFile } = useFiles() 

  // שימוש בהוקס לתצוגה מקדימה
  const { toggle: toggleId} = useFilePreview(idCardFile)
  const { toggle: toggleBank } = useFilePreview(authFile)
  const { toggle: toggleStudy} = useFilePreview(studyPermitFile)

  const [confirm, setConfirm] = useState(false)

  // פונקציה חכמה לחילוץ שם הקובץ (עבור קובץ מקומי או נתיב מהשרת)
  const getFileName = (file, defaultName) => {
    if (!file) return "";
    if (typeof file === 'string') {
      // אם זה סטרינג מהשרת, נחתוך את שם הקובץ המקורי מתוך ה-Path
      return file.split('/').pop().split('-').slice(2).join('-') || defaultName;
    }
    return file.name; // אם זה אובייקט File מקומי
  }

  const saveReq = async () => {
    try {
      const formData = new FormData()
      formData.append('self', JSON.stringify(state.self))
      formData.append('family', JSON.stringify(state.family))
      formData.append('skill', JSON.stringify(state.skill))
      formData.append('bank', JSON.stringify(state.bank))

      // שולחים לשרת רק אם זה אובייקט קובץ אמיתי (File) שהרגע הועלה מהמחשב
      if (idCardFile && typeof idCardFile !== 'string') formData.append('idCardFile', idCardFile)
      if (authFile && typeof authFile !== 'string') formData.append('authFile', authFile)
      if (studyPermitFile && typeof studyPermitFile !== 'string') formData.append('studyPermitFile', studyPermitFile)
      
      await save(formData) // שליחה לשרת

      await swal({
        title: "Success",
        text: "Your request was sent successfully",
        icon: "success",
        timer: 2000,
        buttons: false
      });

      // ניווט קודם כדי למנוע קריסות רינדור בזמן איפוס
      navigate("/home");
      
      // איפוס הסטייט הגלובלי למבנה ריק בטוח
      dispatch(updateCurrentDetails({
        self: {}, family: {}, skill: {}, bank: {}
      })); 

    } catch (err) {
      swal({ title: "Error", text: "Save failed", icon: "error" })
    }
  }

  if (!state?.self) return null;

  return (
    <>
      <div>   
        <h6>Your Details</h6>
        <p>Personal Details</p>
        <div>
          <p>Id: {state.self.idUser}</p>
          <p>Name: {state.self.name + " " + state.self.LName}</p>
          <p>Date: {state.self.dateBorn}</p>
          <p>Address: {state.self.address}</p>
          <p>Phone: {state.self.phone}</p>
          <p>Id card file</p>
          {idCardFile && (
            <>
              {/* תיקון: שימוש בפונקציה לחילוץ השם במקום גישה ישירה ל-idCardFile.name */}
              <button onClick={toggleId} className="fileButton">
                📄 {getFileName(idCardFile, "ID Card")}
              </button>
             
            </>
          )}
        </div>
        
        <div>
          <h6>Family Details</h6>
          <p>Father: {state.family.father}</p>
          <p>Mother: {state.family.mother}</p>
          <p>Number Of Children: {state.family.numChils}</p>
          <p>Children Over 19: {state.family.numAdult} </p>
        </div>

        <div>
          <h6>Major Details</h6>
          <p>Major: {state.skill.major}</p>
          <p>Tuition Fee: {state.skill.tuition}</p>
          <p>Years Of Study: {state.skill.years}</p>
          <p>Study Permit:</p>
          {studyPermitFile && (
            <>
              <button onClick={toggleStudy} className="fileButton">
                📄 {getFileName(studyPermitFile, "Study Permit")}
              </button>
           
            </>
          )}
        </div>

        <div>
          <h6>Bank Details</h6>
          <p>Bank Account Holder: {state.bank.hName}</p>
          <p>Account Number: {state.bank.account}</p>
          <p>Bank Name: {state.bank.bName}</p>
          <p>Bank Branch: {state.bank.branch}</p>
          <p>Bank Authorization:</p>
          {authFile && (
            <>
              <button onClick={toggleBank} className="fileButton">
                📄 {getFileName(authFile, "Bank Auth")}
              </button>
              
            </>
          )}
        </div>

        <div className="form-check my-3"> 
          <input 
            className="form-check-input"
            type="checkbox"
            id="confirmCheck" 
            onChange={(e) => { setConfirm(e.target.checked) }}
          />
          <label className="form-check-label" htmlFor="confirmCheck">I declare that the above details are correct</label>
        </div> 

        <button onClick={saveReq} disabled={!confirm}>confirm and submit</button>
      </div>
    </>
  )
}