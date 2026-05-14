import { useDispatch, useSelector } from "react-redux";
import { allow, reject, selectWaiting, setList } from "../redux/request";
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { getAllWaitingReq } from "../api/admin";

export const AllRequest = () => {
    // 1. State מקומי לניהול תצוגה
    const [openId, setOpenId] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 2. שליפת הנתונים מהרידקס
    const waitingRequests = useSelector(state => state.request.list || []);

    // 3. טעינת נתונים מהשרת בטעינה ראשונה
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                setLoading(true);
                const response = await getAllWaitingReq();
                console.log(response.data);
                
                const data = response.data || []; 
                dispatch(setList(data)); // שמירה ברידקס
            } catch (err) {
                console.error("Failed to fetch admin data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, [dispatch]);

    // פונקציית ניווט ופתיחת פרטים
    const toggle = (id) => {
        if (openId === id) {
            setOpenId(null);
            navigate("/AllRequest");
        } else {
            setOpenId(id);
            navigate(`Details/${id}`);
        }
    };

    if (loading) return <div style={{ marginTop: '25vh', textAlign: 'center' }}>Loading requests...</div>;

    return (
        <>
            <div style={{ height: '15vh' }}></div>
            <div style={{ padding: "20px" }}>
                <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>All Waiting Requests</h3>
                
                {waitingRequests.length === 0 ? (
                    <p style={{ textAlign: 'center' }}>No waiting requests at the moment.</p>
                ) : (
                    waitingRequests.map((item) => (
                        <div key={item._id || item.id} style={containerStyle}>
                            {/* שורת הבקשה המקוצרת */}
                            <div style={cardHeaderStyle}>
                                <div style={{ textAlign: 'left' }}>
                                    <p><strong>User:</strong> {item.self?.name} {item.self?.LName}</p>
                                    <p><strong>ID:</strong> {item.self?.idUser}</p>
                                    <p><strong>Status:</strong> <span style={{ color: '#f39c12' }}>{item.status}</span></p>
                                </div>

                                {/* כפתורי פעולה */}
                                <div style={buttonGroupStyle}>
                                    <button 
                                        onClick={() => dispatch(allow(item._id || item.id))}
                                        style={{ ...btnStyle, backgroundColor: "#27ae60" }}>
                                        Allow
                                    </button>
                                    <button 
                                        onClick={() => dispatch(reject(item._id || item.id))}
                                        style={{ ...btnStyle, backgroundColor: "#e74c3c" }}>
                                        Reject
                                    </button>
                                </div>

                                {/* כפתור פתיחת פרטים */}
                                <div style={toggleIconStyle} onClick={() => toggle(item._id || item.id)}>
                                    {openId === (item._id || item.id) ? "▼ Close" : "▶ Details"}
                                </div>
                            </div>

                            {/* אזור ה-Outlet (הפרטים המורחבים) */}
                            {openId === (item._id || item.id) && (
                                <div style={detailsBoxStyle}>
                                    <Outlet />
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </>
    );
};

// --- אובייקטי עיצוב (למניעת בלאגן ב-JSX) ---
const containerStyle = {
    width: "80%", maxWidth: "900px", margin: "15px auto",
    borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    overflow: "hidden", background: "#fff"
};

const cardHeaderStyle = {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "20px", borderBottom: "1px solid #eee"
};

const buttonGroupStyle = { display: 'flex', gap: '10px' };

const btnStyle = {
    padding: "8px 16px", color: "white", border: "none",
    borderRadius: "6px", cursor: "pointer", fontWeight: "bold", transition: "0.2s"
};

const toggleIconStyle = { cursor: "pointer", color: "#3498db", fontWeight: "bold", minWidth: "80px" };

const detailsBoxStyle = { background: "#f9f9f9", padding: "20px", borderTop: "2px solid #3498db" };