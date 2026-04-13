import { useDispatch } from "react-redux";
import { updateCurrentDetails } from "../redux/request";
import { useFiles } from "../context/FileContext";
import { getRequest } from "../api/request";
// הוק לטעינת הבקשה הקיימת מהשרת והצבתה ברידקס ובקונטקסט הקבצים
export const useLoadRequest = () => {
    const dispatch = useDispatch();
    const { setIdCardFile, setBankAuthFile, setStudyPermitFile } = useFiles();

    const bufferToFile = (fileObj, fileName) => {
        if (!fileObj || !fileObj.data) return null;
        const blob = new Blob([new Uint8Array(fileObj.data.data)], { type: fileObj.contentType });
        return new File([blob], fileName, { type: fileObj.contentType });
    };

    const load = async () => {
        try {
            const response = await getRequest(); 
            
            if (!response || response.message === 'not exists yet') return null;

            // חילוץ הנתונים מתוך העטיפה החדשה
            const actualRequestData = response.request; 

            if (!actualRequestData) return response; // מקרה שזה רק סטטוס (isSubmitted: true)

            // 1. עדכון Redux
            dispatch(updateCurrentDetails(actualRequestData));

            // 2. עדכון הקבצים - שימי לב לשינוי בנתיב הגישה (actualRequestData)
            if (actualRequestData.self?.idCardFile) {
                setIdCardFile(bufferToFile(actualRequestData.self.idCardFile, "Saved ID Card"));
            }
            if (actualRequestData.bank?.authFile) {
                setBankAuthFile(bufferToFile(actualRequestData.bank.authFile, "Saved Bank Auth"));
            }
            if (actualRequestData.skill?.studyPermitFile) {
                setStudyPermitFile(bufferToFile(actualRequestData.skill.studyPermitFile, "Saved Study Permit"));
            }

            return response;
        } catch (err) {
            console.error("Error loading request:", err);
            throw err;
        }
    };

    return load;
};