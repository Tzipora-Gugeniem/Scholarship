import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentDetails } from "../../redux/request";
import { useFiles } from "../../context/FileContext";
import { useFilePreview } from "../../hooks/useFilePreview";

export const  Skill=()=>{
    //שליפת הסטייט
    const state = useSelector((state) => state.request.Current)
   const initialSkillDetails = {...state.skill};
   const [skill, setSkill] = useState({

  ...initialSkillDetails
   });
//    שימוש בקבצים גלובאלים
   const { studyPermitFile, setStudyPermitFile } = useFiles()
  //  שימוש בהוקס לתצוגה מקדימה-עי שליחת שם הטופס המתאים בכל פעם
     const { toggle: toggleStudy, Preview: StudyPreview } = useFilePreview(studyPermitFile)
       //הגדרת dispatch
       const dispatch = useDispatch()  
   
    //בדיקת תקינות לשנות לימוד
const [correctYear,setCorrectYear]=useState(true)
const isComplete =!!( skill.major && skill.tuition && skill.years &&correctYear&&studyPermitFile)+!!(correctYear)
       
       //בעת שינוי של אחד הערכים תיבת האישור תשתנה בהתאם  
       useEffect(() => {
        
            dispatch(updateCurrentDetails({ ...state, skill:  {...skill} ,skillValid:isComplete}))
         
       },[isComplete,skill])


return<>
<div>Major</div>
<div className="input">

    <label>Major Name</label>
    <select onChange={(e)=>{setSkill({...skill,major:e.target.value})}} value={skill.major} >
       <option selected hidden></option>
        <option>Architecture</option>
        <option>Kindergarten Teaching</option>
        <option>Education</option>
        <option>Software Engineering</option>
        <option>Accounting</option>
        <option>Social Work</option>
        <option>CPA</option>
        <option>Marketing</option>
        <option>Communication Disorders</option>
        <option>Visual Communication</option>
    </select>

    <label name="pay">Tuition Fee</label>
    <input 
        name="pay" 
        type="number" 
        onChange={(e)=>setSkill({...skill,tuition:e.target.value})} 
        value={skill.tuition}
    />

    <label name="years" >Years of Study</label>
    <input 
      min={0}
        name="years" 
        type="number" 
        onChange={(e)=>{setSkill({...skill,years:e.target.value})
        }} 
        value={skill.years}
      onBlur={(e=>{ setCorrectYear(e.target.validity.valid )})}
    />
    <p hidden={correctYear} style={{color:'red'}}>Study years must be at least 0</p>
<input id="studyPermitFile" type="file" accept=".jpg,.png,.pdf"
  onChange={(e) => setStudyPermitFile(e.target.files[0])}
  style={{ display: 'none' }} />
<label htmlFor="studyPermitFile" className="btn" style={{borderColor:'#009FAF',width:'50%',}}>
  📎Upload Study Permit
</label>
     {studyPermitFile && <>
        <button onClick={toggleStudy}>📄 {studyPermitFile.name}</button>
        <StudyPreview />
      </>}
</div>

</>
}