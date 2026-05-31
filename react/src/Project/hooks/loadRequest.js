import { useDispatch } from "react-redux";
import { updateCurrentDetails } from "../redux/request";
import { useFiles } from "../context/FileContext";
import { getRequest } from "../api/request";
// הוק לטעינת הבקשה הקיימת מהשרת והצבתה ברידקס ובקונטקסט הקבצים
// הוק לטעינת הבקשה הקיימת מהשרת והצבתה ברידקס ובקונטקסט הקבצים
export const useLoadRequest = () => {
    const dispatch = useDispatch();
    const { setIdCardFile, setAuthFile, setStudyPermitFile } = useFiles();

  

    const load = async () => {
        try {
    
            const response = await getRequest(); 
            
            if (!response || response.exists === false) return null;

            const actualRequestData = response.request; 
            if (!actualRequestData) return response; 

            // 1. עדכון Redux 
            dispatch(updateCurrentDetails(actualRequestData));
// 2. עדכון קונטקסט הקבצים עם הנתונים מהשרת (אם קיימים)
            setIdCardFile(actualRequestData.self?.idCardFile || null);
            setAuthFile(actualRequestData.bank?.authFile || null);
            setStudyPermitFile(actualRequestData.skill?.studyPermitFile || null);

            return response;
        } catch (err) {
            console.error("Error loading request:", err);
            throw err;
        }
    };

    return load;
};