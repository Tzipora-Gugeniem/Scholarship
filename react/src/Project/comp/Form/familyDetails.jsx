import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateCurrentDetails } from "../../redux/request"
import { useNavigate } from "react-router"

export const FamilyDetails = () => {
    //שליפת הסטייט
    const state = useSelector((state) => state.request.Current)
    const initialFamilyDetails = state.family;
    const [family, setFamily] = useState({
        ...initialFamilyDetails
    });
const navigate=useNavigate()
    //הגדרת dispatch
    const dispatch = useDispatch()
// סטייט של בדיקות תקינות
const [child,setChild]=useState(true)
const [adult,setAdult]=useState(true)
//בדיקה שהנתונים   מלאים נכונים
// משתנה זה יבדוק מתי הטופס מלא ותקין-2
//  מתי הטופס לא מלא -1
//  מתי הערך לא תקין -0
  const isComplete = !!(family.father && family.mother && family.numChildren && family.numAdult&&adult&&child)+!!(adult&&child)
    //שמירה בעת דריסה ובכל שינוי
    useEffect(() => {
      //שליחת הערכים וכן שדה הבודק תקינות
         dispatch(updateCurrentDetails({ ...state, family: { ...family } ,familyValid:isComplete}))
    }, [isComplete,family])

//י
    return <>

        <div>Family Details</div>
        <div className="input">
            <label name="dad" >Father's Name</label>
            <input name="dad" onChange={(e) => { setFamily({ ...family, father: e.target.value }) }}
                value={family.father} />

            <label name="mom">Mother's Name</label>
            <input name="mom" onChange={(e) => { setFamily({ ...family, mother: e.target.value}) }}
                value={family.mother} />

            <label name="child">Number of Children</label>
            <input name="child" type="number" onChange={(e) => { setFamily({ ...family, numChildren: e.target.value}) }} 
            value={family.numChildren} min={0} max={30} 
            onBlur={(e)=>{setChild(e.target.validity.valid) }}/>
                   {/* יןצג בעת שגיאה */}
        <p hidden={child} style={{color:'red'}}>Too match children</p>
            <label name="adult">Children over 19</label>
            <input name="adult" type="number" onChange={(e) => { setFamily({ ...family, numAdult: e.target.value}) }}
            //בדיקה שמספר הילדים המבוגרים קטן או שווה לסך הילדים במשפחה
                value={family.numAdult} min={0} max={family.numChildren|| 30} 
                  onBlur={(e)=>{setAdult(e.target.validity.valid)}}  />
                        {/* יןצג בעת שגיאה */}
        <p hidden={adult} style={{color:'red'}}>Too match children</p>
        </div>
   </>
}