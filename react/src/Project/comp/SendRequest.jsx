import { useEffect } from "react";
import { useNavigate } from "react-router";
import swal from "sweetalert";
import { FileProvider } from "../context/FileContext";
import { useSelector } from "react-redux";
import { MainForm } from "./Form/MainForm";
export const SendRequest = () => {
  const state = useSelector((state) => state.User);
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.Current) {
      swal({
        title: "You must be logged in to apply",
        text: "Please log in to continue",
        icon: "warning",
        // --- הגדרות אבטחה לסגירה ---
        closeOnClickOutside: false, // לא ייסגר בלחיצה בחוץ
        closeOnEsc: false,          // לא ייסגר ב-Esc
        // -------------------------
        buttons: {
          login: { text: "Login", value: "login", className: "btn btn-primary" },
          register: { text: "Register", value: "register", className: "btn btn-primary" }
        }
      }).then((value) => {
        if (value === "login") navigate("/logIn");
        else if (value === "register") navigate("/register");
      });
    }
  }, [state.Current, navigate]);

  return (
    <FileProvider>
      {/* אם אין משתמש, נציג את הטופס מטושטש מאוד וחסום לחלוטין */}
      <div style={{ 
      
       filter: !state.Current ?' pointerEvents: none':null, // חוסם כל אינטראקציה עם הטופס
        opacity: !state.Current ? 0.6 : 1
      }}>
        <MainForm />
      </div>
    </FileProvider>
  );
};