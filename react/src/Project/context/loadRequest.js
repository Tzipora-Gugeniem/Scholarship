import { useDispatch } from "react-redux";
import { updateCurrentDetails } from "../redux/request";
import { useFiles } from "../context/FileContext";
import { getRequest } from "../api/request";
// הוק לטעינת הבקשה הקיימת מהשרת והצבתה ברידקס ובקונטקסט הקבצים
export const useLoadRequest = () => {
    const dispatch = useDispatch();
    const { setIdCardFile, setBankAuthFile, setStudyPermitFile } = useFiles();

    // פונקציית עזר פנימית להמרת ה-Buffer מהשרת לקובץ JS
    const bufferToFile = (fileObj, fileName) => {
        if (!fileObj || !fileObj.data) return null;
        // מונגו מחזיר את ה-Buffer בתוך שדה data.data
        const blob = new Blob([new Uint8Array(fileObj.data.data)], { type: fileObj.contentType });
        return new File([blob], fileName, { type: fileObj.contentType });
    };

    const load = async () => {
        try {
            const request = await getRequest();
            
            // אם השרת החזיר סטטוס 201 (לא קיים) או שאין מידע
            if (!request || request.message === 'not exists yet') return null;

            // 1. עדכון Redux (כל הנתונים הטקסטואליים והסטטוס)
            dispatch(updateCurrentDetails(request));

            // 2. המרת הקבצים ושמירתם ב-Context
            if (request.self?.idCardFile) {
                setIdCardFile(bufferToFile(request.self.idCardFile, "Saved ID Card"));
            }
            if (request.bank?.authFile) {
                setBankAuthFile(bufferToFile(request.bank.authFile, "Saved Bank Auth"));
            }
            if (request.skill?.studyPermitFile) {
                setStudyPermitFile(bufferToFile(request.skill.studyPermitFile, "Saved Study Permit"));
            }

            return request;
        } catch (err) {
            console.error("Error loading request:", err);
            throw err;
        }
    };

    return load;
};