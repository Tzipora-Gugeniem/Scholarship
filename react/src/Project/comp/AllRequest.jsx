        import { useDispatch, useSelector } from "react-redux"
        import { allow, reject, selectWaiting } from "../redux/request"
        import { useState } from "react"
        import { Details } from "../comp/Details"
        import { Outlet, useNavigate } from "react-router"

        export const AllRequest = () => {
            const [openId, setOpenId] = useState(null)

        const navigate=useNavigate()
            const dispatch = useDispatch()
            //פונקציה לפתיחת וסגירת פרטי הבקשה ניתוב לקומפוננטת הדיטיילס
            const toggle = (id) => {
                if (openId === id) {
            setOpenId(null)
            navigate("/AllRequest")
        } else {
            setOpenId(id)
            navigate(`Details/${id}`)
            }}
            //שליפת הסטייט
            const notWaiting = useSelector(selectWaiting)
            return <>
    <div style={{ height: '20vh' }}></div> {/* רווח מעל התגיות */}
    <div   >
        <h3>All Waiting Request</h3>
        {//מעבר על הבקשות שמחכות
            notWaiting.map((item, index) => (<div key={index}
                style={{
                    width: "70%",
                    display: "flex",
                    justifySelf: 'center',
                    justifyContent: "space-between",
                    flexDirection: "column",
                    border: "1px solid #ccc",
                    padding: "15px" ,
                    margin: "10px 0",
                    borderRadius: "10px",
                    background: "#fff",
                    transition: "0.3s" }}> 
                            {/* דיו הבקשה הספציפית */}
    <div
            style={{
                //width: { xs: "45%", sm: "30%", md: "40%" }, // רוחב גמיש לפי מסך
                display: "flex",
                flexDirection: "row",
                borderRadius: 3,      // פינות עגולות
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                backgroundColor: "#ffffff", // לבן
                textAlign: "center",
                                
                justifyContent: "space-evenly",

            }}>
                                    {/* דיו המכיל פרטים בסיסים על השבקשה */}
            <div>
                <p>Request ID: {item.id}</p>
                <p>User ID: {item.self?.idUser}</p>
                <p>User name: {item.self?.name}{item.self?.LName}</p>
                <p>Status: {item.status}</p>
            </div>
            {/* דיו המכיל כפתור אישור ודחיה */}
            <div style={{ justifySelf: "center", display: 'flex', width: "30%", alignSelf: 'end', padding: 10 }}>
                <button onClick={() => {
                    dispatch(allow(item.id))}}
                className="btn btn-light"
                                        style={{
                        alignSelf: 'flex-end',
                        width: "40%",
                        height: "7vh",
                        marginTop: "10px",
                        padding: "8px 12px",
                        backgroundColor: "#4c93afff",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",}} >Allow</button>

                <button onClick={() => dispatch(reject(item.id))}
                     style={{
                        alignSelf: 'flex-end',

                          width: "40%",
                         height: "7vh",
                          marginTop: "10px",
                          padding: "8px 12px",
                          backgroundColor: "#36f1f4ff",
                        color: "white",
                         border: "none",
                        borderRadius: "5px"
                                        }}>Reject</button> </div>
    {/* החץ שמשתנה לפי מצב */}
     <div style={{ cursor: "pointer", alignSelf: "center", padding: 10, fontWeight: "bold" }}
                // הפעלת הפונקציה המפעלה פרטים
                 onClick={() => toggle(item.id)}>
                                
          all details: {openId === item.id ?"▼" : "▶"}
             </div>
                            
                            
            </div>

                            {/* פרטי הבקשה שמופיעים בעת לחיצה */}
                            {openId === item.id && (
                                <div style={{


            borderRadius: "0 0 10px 10px",
            background: "#fff",
            padding: "15px 25px",

                                }}>
                        {/* הצגת הילד של קומפוננטת אלרקואסט */}
        <div style={{ marginTop: 10 }}>
            <Outlet />
        </div>
                                </div>
                            )}
                        </div>))

                    }

                </div>

            </>
        }