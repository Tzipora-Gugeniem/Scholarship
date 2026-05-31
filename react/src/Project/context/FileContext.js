// אחסון הקבצים
// לא ניתן לאחסן ברידקס קבצים 
import { createContext, useContext, useState } from 'react'

// יצירת ה"מחסן"
const FileContext = createContext()

// ה-Provider - עוטף ומספק את הנתונים
export const FileProvider = ({ children }) => {
  const [authFile, setAuthFile] = useState(null)
  const [idCardFile, setIdCardFile] = useState(null)
  const [studyPermitFile, setStudyPermitFile] = useState(null)

  return (
    // הערכים שאנחנו רוצים לשתף לכל הקומפוננטות שבפנים
    <FileContext.Provider value={{
      authFile, setAuthFile,
      idCardFile, setIdCardFile,
      studyPermitFile, setStudyPermitFile
    }}>
      {children}  {/* ← כל הקומפוננטות שבפנים מקבלות גישה */}
    </FileContext.Provider>
  )
}

// hook נוח - במקום לכתוב useContext(FileContext) בכל מקום
// 
export const useFiles = () => useContext(FileContext)