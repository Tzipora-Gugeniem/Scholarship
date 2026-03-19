
import { BrowserRouter, Route, Routes } from "react-router"
import { Register } from "../comp/register"
import { LogIn } from "../comp/login"
import { Home } from "../comp/Home"

import { SeeStatus } from "../comp/SeeStauts"
import { NotFound } from "../comp/notFound"
import { Nav } from "./Nav"
import { AllRequest } from "../comp/AllRequest"
import { AdminRoute } from "../comp/AdminRoute"
import { SendRequest } from "../comp/SendRequest"
import { FamilyDetails } from "../comp/Form/familyDetails"
// import { SelfDetails } from "../comp/Form/SelfDetails"
// import { Bank } from "../comp/Form/Bank"
import { Details } from "../comp/Details"

//דף זה מכיל את כל הניתובים הקימים בפרויקט
export const Routing = () => {
    return <>
        <BrowserRouter>
            {/* תפריט מופיע תמיד */}
            <Nav ></Nav>
            <Routes>
                <Route path="home" element={<Home></Home>}></Route>
                <Route path="register" element={<Register></Register>}></Route>
                <Route path="logIn" element={<LogIn></LogIn>}></Route>
                <Route path="SendRequest" element={<SendRequest>

                </SendRequest>} >
                </Route>
                <Route path="MyStatus" element={<SeeStatus></SeeStatus>}></Route>
                {/* נפתח את הצגת הבקשות בתוך קומפוננטה עוטפת כדי למנוע אפשרות כניסה דרך הניתוב למי שאינו מנהל */}
                <Route path="AllRequest" element={<AdminRoute><AllRequest />
                </AdminRoute>}>
                    {/* ניתוב ילד לצפייה בכל הבקשות לכל בקשה צפיה בכל הפרטים */}
                    <Route path='Details/:idReq' element={<Details></Details>}></Route>
                </Route>
                <Route path="" element={<Home></Home>}></Route>
                <Route path="*" element={<NotFound></NotFound>}></Route>


            </Routes>
        </BrowserRouter>
    </>
}