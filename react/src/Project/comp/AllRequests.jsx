import { useDispatch, useSelector } from "react-redux";
import { allow, reject, selectWaiting, setList } from "../redux/request";
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { getAllWaitingReq, updateStatus } from "../api/admin";
import "../css/allRequest.css"


export const AllRequests = () => {
    // 1. State מקומי לניהול תצוגה
    const [openId, setOpenId] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 2. שליפת הנתונים מהרידקס
    const waitingRequests = useSelector(selectWaiting);

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
            navigate("/AllRequests");
        } else {
            setOpenId(id);
            navigate(`Details/${id}`);
        }
    };
    const handleStatusUpdate = async (id, status) => {
        try {
            await updateStatus(id, status);
            // עדכון הרידקס או טעינת נתונים מחדש
            if (status === "allowed") {
                dispatch(allow(id));
            }       
            else if (status === "rejected") {   
                dispatch(reject(id));
            }
        } catch (err) {
            console.error("Failed to update request status:", err);
        }
    };


    if (loading) return <div style={{ marginTop: '25vh', textAlign: 'center' }}>Loading requests...</div>;

    return (
        <div className="requests-container">
            <h3>All Waiting Requests</h3>
            
            {waitingRequests.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No waiting requests at the moment.</p>
            ) : (
                waitingRequests.map((item) => (
                    <div key={item._id || item.id} className="request-card">
                        {/* שורת המידע הראשית */}
                        <div className="request-row">
                            
                            {/* עמודת מידע אישי */}
                            <div className="info-col">
                                <span className="user-name">{item.self?.name} {item.self?.LName}</span>
                                <span className="user-sub">ID: {item.self?.idUser}</span>
                            </div>

                            {/* עמודת מגמה */}
                            <div className="major-col">
                                <span className="label-text">Major</span>
                                <br />
                                <span>{item.skill?.major || 'N/A'}</span>
                            </div>

                            {/* עמודת סטטוס */}
                            <div className="status-col">
                                <span className="status-tag">{item.status}</span>
                            </div>

                            {/* כפתורי פעולה */}
                            <div className="actions-col">
                                <button 
                                    className="btn-action btn-allow"
                                     onClick={() => handleStatusUpdate(item._id, 'allowed')}
                                >Allow</button>
                                <button 
                                    className="btn-action btn-reject"
                                     onClick={() => handleStatusUpdate(item._id, 'rejected')}
                                >Reject</button>
                               </div> 
                                <div className="details-link" onClick={() => toggle(item._id || item.id)}>
                                    {openId === (item._id || item.id) ? "✕ Close" : "Details →"}
                                </div>
                            
                        </div>

                        {/* אזור ה-Outlet */}
                        {openId === (item._id || item.id) && (
                            <div className="expanded-details">
                                <Outlet />
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};


