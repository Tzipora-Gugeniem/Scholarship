import { useCallback, useEffect, useState } from 'react'

export const useFilePreview = (file) => {

  // הוק פשוט לתצוגה מקדימה של קבצים, תומך גם בקבצים מקומיים (File) וגם בנתיבים מרוחקים (string)
  const [show, setShow] = useState(false)
  const isRemote = typeof file === 'string'
  // הפונקציה toggle תטפל בשני המקרים: אם זה קובץ מקומי - תיצור URL זמני ותפתח אותו, אם זה נתיב מרוחק - פשוט תפתח את הקישור
  const toggle = useCallback(() => setShow(prev => !prev), [])

  useEffect(() => {
    // 1. תנאי יציאה בסיסי: אם לא ביקשו להציג (show=false) או שאין קובץ - עוצרים
if (!show || !file) return;

    // 2. אם מדובר בקובץ מרוחק מהשרת (מחרוזת טקסט מה-DB)
    if (isRemote) {
      const SERVER_URL = "http://localhost:3001/";
      
      // א. החלפת לוכסנים הפוכים של ווינדוס (\\) ללוכסנים רגילים (/)
      let cleanPath = file.replace(/\\/g, '/');
      
      // ב. אם הנתיב חלקי (לא מתחיל ב-http), נצמיד לו את כתובת השרת 3001
      if (!cleanPath.startsWith('http')) {
        if (cleanPath.startsWith('/')) {
          cleanPath = cleanPath.substring(1);
        }
        cleanPath = `${SERVER_URL}${cleanPath}`;
      }
      window.open(cleanPath, '_blank');
      setShow(false);
      return;
    }
    // 3. אם מדובר בקובץ מקומי מהמחשב (אובייקט File)
    const url = URL.createObjectURL(file)
    window.open(url, '_blank')
    setShow(false)

    // מריץ את פונקציית הניקוי אך ורק עבור הקובץ המקומי
    return () => URL.revokeObjectURL(url)

  // הוספנו את isRemote למערך התלויות ליתר ביטחון
  }, [show, file, isRemote]) 

  return { show, toggle }
}