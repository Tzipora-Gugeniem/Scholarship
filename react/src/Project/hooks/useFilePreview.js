// hooks/useFilePreview.js
import { useEffect, useState } from 'react'

export const useFilePreview = (file) => {
  // מצב - האם להציג את התצוגה המקדימה
  const [show, setShow] = useState(false)

  // פונקציה שהופכת את המצב - פתוח/סגור
  const toggle = () => setShow(prev => !prev)
    // useEffect תמיד רץ - אבל פועל רק אם PDF ו-show פתוח
    useEffect(() => {
      if (show && file?.type === 'application/pdf') {
        window.open(URL.createObjectURL(file), '_blank')
      }
    }, [show]) 
  // קומפוננטה שמציגה את הקובץ בהתאם לסוגו
 const Preview = () => {
    // useEffect תמיד רץ - אבל פועל רק אם PDF ו-show פתוח
    useEffect(() => {
      if (show && file?.type === 'application/pdf') {
        window.open(URL.createObjectURL(file), '_blank')
      }
    }, [show])  // ← רץ כל פעם שshow משתנה

    if (!show || !file) return null

    return (
      <div style={{ marginTop: 8 }}>
        {file.type.startsWith('image/') && (
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            style={{ height: 100, borderRadius: 8 }}
          />
        )}
      </div>
    )
  }

  return { show, toggle, Preview }
}