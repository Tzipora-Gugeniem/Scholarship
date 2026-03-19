

import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowForward from "@mui/icons-material/ArrowForward";
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Container,
  Typography,
  StepConnector,
  StepButton,
  Divider,
} from "@mui/material";
import React, {  useState } from "react";
import { useSelector } from "react-redux";
import { useFiles } from "../../context/FileContext";
import swal from "sweetalert"
import { saveDraft } from "../../api/request";
export const Basic = (props) => {
  //שליפת בstate
  const state = useSelector((state) => state.request.Current)
  //כשכל השדות תקינים ומלאים
  const submit =state.selfValid===2&&state.bankValid===2&&state.familyValid===2&&state.skillValid===2
  const stepsArr = ["Personal Details", "Family Details", "major", "Bank Details", "submit"];
  //משתנה זה שומר את השלב הנוכחי בטופס
  const [form, setForm] = useState(0);

  //שליפת הילדים מהפרופס של הקומפוננטה
  let a = React.Children.toArray(props.children);
  let steps = React.Children.count(props.children);
// מצב השלבים בטופס
    const stepsStatus = [
    state?.selfValid ?? 1,
    state?.familyValid ?? 1,
    state?.skillValid ?? 1,
    state?.bankValid ?? 1,
    submit===true ? 1 : 1
  ];
  // סימון איקון מתאים לפי מצב השלב בטופס
  const ColoredStepIcon = ({ status, step }) => {
    let color = "#00bcd4"; // ברירת מחדל טורקיז
    let symbol = step+1; 
    if (status === 0) {color = "#f44336";  symbol = "✖" }; // אדום
    if (status === 2) {
      color = "#4caf50"; // ירוק
      symbol = "✔"; // וי
    }
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 30,
        height: 30,
        borderRadius: "50%",
        backgroundColor: color,
        color: "white",
        fontWeight: "bold"
      }}>
        {symbol}
      </div>
    );
  }
    
  // פונקציות לשינוי השלב בטופס
  const next = () => {
    if (form < steps - 1) setForm(form + 1);
  };

  const back = () => {
    if (form > 0) setForm(form - 1);
  };

// שמירת טיוטה
// שולפים קבצים מהקונטקסט
const { bankAuthFile, idCardFile, studyPermitFile } = useFiles()

const saveYourDraft = async () => {
  try {
    const formData = new FormData()
    
    // שולחים מה שיש - גם אם חלקי
    if (state.self) formData.append('self', JSON.stringify(state.self))
    if (state.family) formData.append('family', JSON.stringify(state.family))
    if (state.skill) formData.append('skill', JSON.stringify(state.skill))
    if (state.bank) formData.append('bank', JSON.stringify(state.bank))
    
    // קבצים אם קיימים
    if (idCardFile) formData.append('idCardFile', idCardFile)
    if (bankAuthFile) formData.append('bankAuthFile', bankAuthFile)
    if (studyPermitFile) formData.append('studyPermitFile', studyPermitFile)
    
    
    await saveDraft(formData) // ← ניתוב נפרד בשרת

    swal({
      title: "Draft Saved",
      text: "You can continue later",
      icon: "success",
      timer: 2000,
      buttons: false
    })

  } catch (err) {
    swal({ title: "Error", text: "Draft save failed", icon: "error" })
  }
}
  return <>


    <Box padding="5%">
      <Box sx={{
        paddingTop: 10, width: "50%", justifySelf: "center", alignSelf: "center", p: 4, border: '2px ', borderRadius: 2, boxShadow: 4, backgroundColor: '#ffffffff', boxShadow: "0 0 40px rgba(8, 7, 16, 0.6)",
        padding: "50px 35px", padding: "50px 35px"
      }}>

        <Typography variant="h6" fontWeight="bold" textAlign="center" mb={4} >
          Apply a request
        </Typography>

        <Stepper activeStep={form} alternativeLabel sx={{ mb: 2 }} >
          {stepsArr.map((label, index) => (

            <Step key={label} onClick={() => setForm(index)}  hidden={!submit && index == (stepsArr.length - 1)}  >

              <StepLabel StepIconComponent={() => <ColoredStepIcon status={stepsStatus[index]} step={index} />}>{label}</StepLabel>
            </Step>

          ))}

        </Stepper>

<Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
  <Divider sx={{ width: "100%", mb: 2 }}>
    <Button
    onClick={saveYourDraft}
      title="save your draft in any step"
      variant="outlined"
      size="small"
      sx={{
        color: "#0f95a7",
        borderColor: "#0f95a7",
        borderRadius: "20px",
        px: 3,
        fontSize: 12,
        '&:hover': { 
          backgroundColor: "#0f95a7", 
          color: "white" 
        }
      }}
    >
       Save Draft
    </Button>
  </Divider>
</Box>
        <Box sx={{ mb: 3 }} >{a[form]}</Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button disabled={form == 0}
            sx={{ backgroundColor: "#0f95a7ff" }}
            variant="contained"

            startIcon={<ArrowBack />}
            onClick={back}
          >
           back
          </Button>

          <Button disabled={form == stepsArr.length - 2 && !submit || form == stepsArr.length - 1}
            sx={{ backgroundColor: "#0f95a7ff", }}
            backgroundColor="#164140ff"
            variant="contained"

            endIcon={<ArrowForward />}
            onClick={next}
          >
            next
          </Button>


        </Box>
      </Box>
    </Box>

  </>

};