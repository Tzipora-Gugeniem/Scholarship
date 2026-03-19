// אכסון הקבצים
// לא ניתן לאחסן ברידקס קבצים 
import { createContext, useContext, useState } from 'react'

// יצירת ה"מחסן"
const FileContext = createContext()

// ה-Provider - עוטף ומספק את הנתונים
export const FileProvider = ({ children }) => {
  const [bankAuthFile, setBankAuthFile] = useState(null)
  const [idCardFile, setIdCardFile] = useState(null)
  const [studyPermitFile, setStudyPermitFile] = useState(null)

  return (
    <FileContext.Provider value={{
      bankAuthFile, setBankAuthFile,
      idCardFile, setIdCardFile,
      studyPermitFile, setStudyPermitFile
    }}>
      {children}  {/* ← כל הקומפוננטות שבפנים מקבלות גישה */}
    </FileContext.Provider>
  )
}

// hook נוח - במקום לכתוב useContext(FileContext) בכל מקום
//  לא הוכנס בתקיית ההוקס כי הוא תלוי ב-FileContext
export const useFiles = () => useContext(FileContext)