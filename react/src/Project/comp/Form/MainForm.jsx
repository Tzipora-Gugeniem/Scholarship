
import '../../css/form.css';
import { Basic } from "./Basic";
import { FamilyDetails } from "./familyDetails";
import { Bank } from "./Bank";
import { Skill } from "./skill";
import { SelfDetails } from "./SelfDetails";
import { use, useEffect, useState } from 'react';
import { Send } from './Send';

import { useLoadRequest } from '../../context/loadRequest';
import { useSelector } from 'react-redux';

export const MainForm = () => {
// טעינת הבקשה הקיימת מהשרת והצבתה ברידקס ובקונטקסט הקבצים
const loadRequest = useLoadRequest();
const state = useSelector((state) => state.request.Current)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (!state) {
        setLoading(false);
        return;
    }
        const fetchData = async () => {
            try {
                // קריאה להוק שטוען גם ל-Redux וגם ל-FileContext
                await loadRequest();
            } catch (err) {
                console.error("Failed to load existing draft", err);
            } finally {
                setLoading(false); // סיום טעינה
            }
        };

        fetchData();
    }, []); // ירוץ פעם אחת כשהקומפוננטה עולה

    if (loading) {
        return <div className="loader">Loading your draft...</div>;
    }
return <>
  
<Basic className="mainform">

   <SelfDetails />
    <FamilyDetails />
    <Skill/>
    <Bank/>
    <Send></Send>
</Basic>

</>
};