import { useDispatch, useSelector } from "react-redux";
import { allow, deleteRequestFromStore, reject, setList } from "../redux/request";
import { useState, useEffect, useMemo } from "react";
import { Outlet, useNavigate } from "react-router";
import { bulkDeleteRequests, deleteRequest, getAllWaitingReq, updateStatus } from "../api/admin";
import swal from 'sweetalert';
import "../css/allRequest.css";
import { Loading } from "./Loading";
import { Filter } from "./Filter";
import { bulkUpdateStatusAPI } from "../api/admin";
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "4px" }}><polyline points="20 6 9 17 4 12"></polyline></svg>
);
const CrossIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "4px" }}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);

export const AllRequests = () => {
    const [openId, setOpenId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    
    // הפילטרים שנשלחים לשרת (ללא major)
    const defaultFilters = {
        status: "waiting",
        idUser: "",
        startDate: "", endDate: "",
        minUnder18: "", maxUnder18: "",
        minTuition: "", maxTuition: ""
    };

    const [filters, setFilters] = useState(defaultFilters);

    // סטייט מיון בלקוח
    const [sortConfig, setSortConfig] = useState({
        sortBy: "",       
        sortOrder: "desc" 
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const requestList = useSelector(state => state.request.list || []);

    // פנייה לשרת בעקבות שינוי בסינונים
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                setLoading(true);

                const cleanEntries = Object.entries(filters).filter(([_, v]) => {
                    if (v === "" || v === null || v === undefined) return false;
                    return true;
                });

                const queryParams = new URLSearchParams(Object.fromEntries(cleanEntries)).toString();
                const response = await getAllWaitingReq(queryParams);
                const data = response.data?.data || response.data || []; 

                dispatch(setList(data)); 
            } catch (err) {
                console.error("Failed to fetch admin data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, [dispatch, filters]);

    const handleFilterChange = (name, value) => {
        if (name === 'RESET') {
            setFilters(defaultFilters);
            setSortConfig({ sortBy: "", sortOrder: "desc" }); 
        } else if (name === 'SET_SORT') {
            setSortConfig(value);
        } else if (typeof name === 'object' && name !== null) {
            setFilters(prev => ({ ...prev, ...name }));
        } else {
            setFilters(prev => ({ ...prev, [name]: value }));
        }
    };

    // מיון ריאקטיבי בקליינט
    const sortedRequests = useMemo(() => {
        let result = [...requestList];
        if (!sortConfig.sortBy) return result;

        const isAsc = sortConfig.sortOrder === "asc";

        result.sort((a, b) => {
            let valA, valB;

            if (sortConfig.sortBy === "date") {
                valA = a.lastSavedAt ? new Date(a.lastSavedAt).getTime() : 0;
                valB = b.lastSavedAt ? new Date(b.lastSavedAt).getTime() : 0;
            } else if (sortConfig.sortBy === "tuition") {
                valA = a.skill?.tuition || 0;
                valB = b.skill?.tuition || 0;
            } else if (sortConfig.sortBy === "siblings") {
                valA = (a.family?.numChildren || 0) - (a.family?.numAdult || 0);
                valB = (b.family?.numChildren || 0) - (b.family?.numAdult || 0);
            }

            if (valA < valB) return isAsc ? -1 : 1;
            if (valA > valB) return isAsc ? 1 : -1;
            return 0;
        });

        return result;
    }, [requestList, sortConfig]);

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
            if (status === "allowed") dispatch(allow(id));
            else if (status === "rejected") dispatch(reject(id));
        } catch (err) {
            console.error("Failed to update request status:", err);
        }
    };

  const updateListRequest = async (requestsToUpdate, status) => {
    // 1. חילוץ המזהים (IDs) מתוך מערך הבקשות שנשלח לפונקציה
    const idsToUpdate = requestsToUpdate.map(item => item._id || item.id);
    
    if (idsToUpdate.length === 0) return;

    // 2. פתיחת חלונית ה-SweetAlert והמתנה לתשובת המשתמש (באמצעות await)
    const willUpdate = await swal({
        title: `Are you sure you want to ${status} all these requests?`,
        text: "Once confirmed, this action cannot be undone.",
        icon: "warning",
        buttons: ["Cancel", "Yes, confirm"], // נותן שמות ברורים לכפתורים
        dangerMode: true,
    });


    // 3. אם המשתמש אישר (לחץ על Confirm)
    if (willUpdate) {
        try {
            setLoading(true); // הפעלת ספינר טעינה (אם קיים אצלך בסטייט)

            // 4. קריאה אחת מרוכזת לשרת
            await bulkUpdateStatusAPI(idsToUpdate, status);

            // 5. עדכון הסטייט המקומי ב-Redux מיד לאחר ההצלחה בשרת
            idsToUpdate.forEach(id => {
                if (status === "allowed") dispatch(allow(id));
                else if (status === "rejected") dispatch(reject(id));
            });

            // 6. הודעת הצלחה למשתמש
            swal("Success!", `Successfully updated ${idsToUpdate.length} requests.`, "success");

        } catch (err) {
            // הגנה מפני קריסות: אם השרת החזיר שגיאה או שהאינטרנט נפטר
            console.error("Failed to perform bulk update:", err);
            swal("Error", "Something went wrong while updating the requests.", "error");
        } finally {
            setLoading(false); // כיבוי ספינר הטעינה בכל מקרה
        }
    }
};

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure?")) return;

  try {
    await deleteRequest(id); // קריאה לשרת למחיקת הבקשה הספציפית
    
    console.log(id);
    
    dispatch(deleteRequestFromStore(id)); 
    
  } catch (error) {
    console.error(error);
  }
};

    if (loading) return <Loading style={{ marginTop: '25vh', textAlign: 'center' }}>L</Loading>;

    return (
        <div className="perfect-page-wrapper">
            <Filter 
                filters={filters}
                sortConfig={sortConfig} 
                onFilterChange={handleFilterChange} 
                isOpen={isFilterOpen} 
                onClose={() => setIsFilterOpen(false)}
            />

            <button className="fixed-right-dots-btn" onMouseOver={() => setIsFilterOpen(!isFilterOpen)}>
                <span className="dot-node"></span>
                <span className="dot-node"></span>
                <span className="dot-node"></span>
            </button>

            <div className="requests-container">
                <div className="requests-header-flex-row">
                    <h3 className="requests-main-title">REQUESTS</h3>
                    
                    <div className="right-side-tabs">
                        <button 
                            className={`tab-item-style ${filters.status === "" ? "selected-active" : ""}`}
                            onClick={() => handleFilterChange("status", "")}
                        >
                            Display all
                        </button>
                        <button 
                            className={`tab-item-style ${filters.status === "waiting" ? "selected-active" : ""}`}
                            onClick={() => handleFilterChange("status", "waiting")}
                        >
                            waiting
                        </button>
                    </div>
                </div>
               
                {sortedRequests.length === 0 ? (
                    <p style={{ textAlign: 'center', marginTop: "40px" }}>No requests match the filters.</p>
                ) : (
                    sortedRequests.map((item) => (
                        <div key={item._id || item.id} className="request-card">
                            <div className="request-row">
                                <div className="info-col">
                                    <span className="user-name">{item.self?.name} {item.self?.LName}</span>
                                    <span className="user-sub">ID: {item.self?.idUser}</span>
                                </div>

                                <div className="major-col">
                                    <span className="label-text">Major</span>
                                    <br />
                                    <span className="major-value">{item.skill?.major || 'N/A'}</span>
                                </div>

                                <div className="status-col">
                                    <span className="status-tag">{item.status}</span>
                                </div>

                                <div className="actions-buttons-inline-col">
                                    <button className="row-btn-design spec-allow-color" onClick={() => handleStatusUpdate(item._id, 'allowed')}>
                                        <CheckIcon /> allow
                                    </button>
                                    <button className="row-btn-design spec-reject-color" onClick={() => handleStatusUpdate(item._id, 'rejected')}>
                                        <CrossIcon /> reject
                                    </button>
                                    <button className="row-btn-design spec-delete-color" onClick={() => handleDelete(item._id)} title="Delete">
                                        <TrashIcon />
                                    </button>
                                </div> 

                                <div className="details-link" onClick={() => toggle(item._id || item.id)}>
                                    {openId === (item._id || item.id) ? "✕ Close" : "Details →"}
                                </div>
                            </div>

                            {openId === (item._id || item.id) && (
                                <div className="expanded-details">
                                    <Outlet />
                                </div>
                            )}
                        </div>
                    ))
                )}
                {sortedRequests.length > 0 && (
                    <div className="bottom-floating-dock-container">
                        <button className="dock-action-button dock-action-delete" onClick={() => bulkDeleteRequests(sortedRequests.map(item => item._id || item.id))}>
                            <TrashIcon /> delete all
                        </button>
                        <button className="dock-action-button dock-action-allow" onClick={() => updateListRequest(sortedRequests, 'allowed')}
                    >
                            <CheckIcon /> Allow all
                        </button>
                        <button className="dock-action-button dock-action-reject" onClick={() => updateListRequest(sortedRequests, 'rejected')}
                    >
                            <CrossIcon /> Reject all
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};