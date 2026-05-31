import React, { useState, useEffect } from "react";
import { Slider } from "@mui/material";
import "../css/Filter.css";

export const Filter = ({ filters, sortConfig, onFilterChange, isOpen, onClose }) => {
    
    const [localFilters, setLocalFilters] = useState({
        status: "", 
        idUser: "",
        startDate: "", 
        endDate: "", 
        minTuition: "", 
        maxTuition: "", 
        under18:[0, 30]
    });

    const [localSort, setLocalSort] = useState({
        sortBy: "",
        sortOrder: "desc"
    });

    useEffect(() => {
        if (isOpen && filters) {
            setLocalFilters({
                status: filters.status || "",
                idUser: filters.idUser || "",
                startDate: filters.startDate || "",
                endDate: filters.endDate || "",
                minTuition: filters.minTuition || "",
                maxTuition: filters.maxTuition || "",
                under18: [
                    filters.minUnder18 !== "" && filters.minUnder18 !== undefined ? Number(filters.minUnder18) : 0,
                    filters.maxUnder18 !== "" && filters.maxUnder18 !== undefined ? Number(filters.maxUnder18) : 30
                ]
            });
        }
        if (isOpen && sortConfig) {
            setLocalSort({
                sortBy: sortConfig.sortBy || "",
                sortOrder: sortConfig.sortOrder || "desc"
            });
        }
    }, [isOpen, filters, sortConfig]);

    const updateFilter = (key, value) => setLocalFilters(prev => ({ ...prev, [key]: value }));

    const handleSortClick = (field) => {
        let nextOrder = "desc";
        if (localSort.sortBy === field) {
            nextOrder = localSort.sortOrder === "desc" ? "asc" : "desc";
        }
        
        const newSort = { sortBy: field, sortOrder: nextOrder };
        setLocalSort(newSort);
        onFilterChange('SET_SORT', newSort);
    };

    const renderSortArrow = (field) => {
        if (localSort.sortBy !== field) return "⇅";
        return localSort.sortOrder === "asc" ? "↑" : "↓";
    };

   const handleApplyFilters = () => {
    onFilterChange({
        status: localFilters.status,
        idUser: localFilters.idUser.trim(),
        startDate: localFilters.startDate,
        endDate: localFilters.endDate,
        minTuition: localFilters.minTuition,
        maxTuition: localFilters.maxTuition,

        minUnder18:
            localFilters.under18[0] !== 0
                ? localFilters.under18[0]
                : "",

        maxUnder18:
            localFilters.under18[1] !== 30
                ? localFilters.under18[1]
                : ""
    });

    onClose();
};

    const handleReset = () => {
        setLocalFilters({
            status: "",
            idUser: "",
            startDate: "",
            endDate: "",
            minTuition: "",
            maxTuition: "",
            under18: [0, 30]
        });
        setLocalSort({ sortBy: "", sortOrder: "desc" });
        onFilterChange("RESET", ""); 
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="filter-side-overlay">
            <div className="filter-backdrop" onClick={onClose}></div>

            <div className="filter-side-drawer">
                <div className="filter-drawer-header">
                    <h4>Filters & Sorting</h4>
                    <button className="close-drawer-btn" onClick={onClose}>✕</button>
                </div>

                <div className="filter-drawer-body">

                    {/* סטטוס */}
                    <div className="filter-group">
                        <label>STATUS</label>
                        <div className="status-btns">
                            {[
                                { id: "", label: "All" },
                                { id: "waiting", label: "Waiting" },
                                { id: "allowed", label: "Allowed" },
                                { id: "rejected", label: "Rejected" }
                            ].map(s => {
                                const isActive = localFilters.status === s.id;
                                const className = `status-btn ${s.id ? `status-btn--${s.id}` : 'status-btn--all'} ${isActive ? 'status-btn--active' : ''}`;
                                return (
                                    <button
                                        key={s.id || 'all'}
                                        type="button"
                                        className={className}
                                        onClick={() => updateFilter("status", s.id)}
                                    >
                                        {s.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* תעודת זהות */}
                    <div className="filter-group">
                        <label>ID SEARCH</label>
                        <input
                            type="text"
                            placeholder="Enter ID"
                            value={localFilters.idUser}
                            onChange={e => updateFilter("idUser", e.target.value)}
                        />
                    </div>

                    {/* סליידר אחים מתחת לגיל 18 */}
                    <div className="filter-group">
                        <label className="filter-label-with-sort" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>SIBLINGS UNDER 18</span>
                                <button
                                    type="button"
                                    onClick={() => handleSortClick('siblings')}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: localSort.sortBy === 'siblings' ? '#00cbd1' : '#ccc', fontWeight: 'bold', fontSize: '14px' }}
                                >
                                    {renderSortArrow('siblings')}
                                </button>
                            </div>
                            <span className="range-vals"> {localFilters.under18[0]} - {localFilters.under18[1]}</span>
                        </label>
                       <Slider
    value={localFilters.under18}
    onChange={(_, val) =>
        updateFilter(
            "under18",
            Array.isArray(val) ? val : [0, 30]
        )
    }
    min={0}
    max={30}
    valueLabelDisplay="auto"
    sx={{ color: "#00cbd1" }}
/>
                    </div>

                    {/* טווח שכר לימוד */}
                    <div className="filter-group">
                        <label className="filter-label-with-sort" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                            <span>TUITION RANGE</span>
                            <button
                                type="button"
                                onClick={() => handleSortClick('tuition')}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: localSort.sortBy === 'tuition' ? '#00cbd1' : '#ccc', fontWeight: 'bold', fontSize: '14px' }}
                            >
                                {renderSortArrow('tuition')}
                            </button>
                        </label>
                        <div className="filter-row-inputs">
                            <input 
                                type="number" 
                                placeholder="Min"
                                value={localFilters.minTuition}
                                onChange={e => updateFilter("minTuition", e.target.value)} 
                            />
                            <input 
                                type="number" 
                                placeholder="Max"
                                value={localFilters.maxTuition}
                                onChange={e => updateFilter("maxTuition", e.target.value)} 
                            />
                        </div>
                    </div>

                    {/* טווח תאריכים */}
                    <div className="filter-group">
                        <label className="filter-label-with-sort" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                            <span>DATE RANGE</span>
                            <button
                                type="button"
                                onClick={() => handleSortClick('date')}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: localSort.sortBy === 'date' ? '#00cbd1' : '#ccc', fontWeight: 'bold', fontSize: '14px' }}
                            >
                                {renderSortArrow('date')}
                            </button>
                        </label>
                        <div className="date-row">
                            <span>From</span>
                            <input 
                                type="date" 
                                value={localFilters.startDate}
                                onChange={e => updateFilter("startDate", e.target.value)} 
                            />
                        </div>
                        <div className="date-row">
                            <span>To</span>
                            <input 
                                type="date" 
                                value={localFilters.endDate}
                                onChange={e => updateFilter("endDate", e.target.value)} 
                            />
                        </div>
                    </div>

                </div>

                <div className="filter-drawer-footer">
                    <button type="button" className="btn-reset" onClick={handleReset}>Reset All Filters</button>
                    <button type="button" className="btn-apply" onClick={handleApplyFilters}>Apply Filters</button>
                </div>
            </div>
        </div>
    );
};