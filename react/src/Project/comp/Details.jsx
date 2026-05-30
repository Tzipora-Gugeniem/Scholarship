import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { getDetails } from "../api/admin"
import { useFilePreview } from "../hooks/useFilePreview"
import "../css/details.css"

export const Details = () => {
    const { id } = useParams()
    const [req, setReq] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getDetails(id)
                const data = res.data ? res.data : res;
                setReq(data);
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [id])

    // Extracting backend paths
    const idCardFile = req?.self?.idCardFile || null
    const studyPermitFile = req?.skill?.studyPermitFile || null
    const bankAuthFile = req?.bank?.authFile || null

    // File Preview Hooks
    const { toggle: toggleId } = useFilePreview(idCardFile)
    const { toggle: toggleStudy } = useFilePreview(studyPermitFile)
    const { toggle: toggleBank } = useFilePreview(bankAuthFile)

    if (loading) return <div className="loading">Loading...</div>
    if (!req || (!req._id && !req.self)) return <div className="error">Request not found</div>

    return (
        <div className="details-container">
            
            {/* Column 1: Personal Details */}
            <div className="form-column">
                <div className="fields-section">
                    <h5 className="column-title">Personal Info</h5>
                    <div className="form-input-group">
                        <span className="form-label">First Name:</span>
                        <input type="text" className="form-input" value={req.self?.name || ""} readOnly />
                    </div>
                    <div className="form-input-group">
                        <span className="form-label">Last Name:</span>
                        <input type="text" className="form-input" value={req.self?.LName || ""} readOnly />
                    </div>
                    <div className="form-input-group">
                        <span className="form-label">ID Number:</span>
                        <input type="text" className="form-input" value={req.self?.idUser || ""} readOnly />
                    </div>
                    <div className="form-input-group">
                        <span className="form-label">Birth Date:</span>
                        <input 
                            type="text" 
                            className="form-input" 
                            value={req.self?.dateBorn ? new Date(req.self.dateBorn).toLocaleDateString('en-US') : ""} 
                            readOnly 
                        />
                    </div>
                    <div className="form-input-group">
                        <span className="form-label">Address:</span>
                        <input type="text" className="form-input" value={req.self?.address || ""} readOnly />
                    </div>
                    <div className="form-input-group">
                        <span className="form-label">Phone:</span>
                        <input type="text" className="form-input" value={req.self?.phone || ""} readOnly />
                    </div>
                </div>
                <button className="column-button" onClick={toggleId} disabled={!idCardFile}>
                    {idCardFile ? "📄 ID Card" : "❌ No File"}
                </button>
            </div>

            {/* Column 2: Family Details */}
            <div className="form-column">
                <div className="fields-section">
                    <h5 className="column-title">Family Info</h5>
                    <div className="form-input-group">
                        <span className="form-label">Father's Name:</span>
                        <input type="text" className="form-input" value={req.family?.father || ""} readOnly />
                    </div>
                    <div className="form-input-group">
                        <span className="form-label">Mother's Name:</span>
                        <input type="text" className="form-input" value={req.family?.mother || ""} readOnly />
                    </div>
                    <div className="form-input-group">
                        <span className="form-label">Children Count:</span>
                        <input type="text" className="form-input" value={req.family?.numChildren ?? ""} readOnly />
                    </div>
                    <div className="form-input-group">
                        <span className="form-label">Adults (19+):</span>
                        <input type="text" className="form-input" value={req.family?.numAdult ?? ""} readOnly />
                    </div>
                </div>
              
            </div>

            {/* Column 3: Academic Details */}
            <div className="form-column">
                <div className="fields-section">
                    <h5 className="column-title">Academic Info</h5>
                    <div className="form-input-group">
                        <span className="form-label">Major:</span>
                        <input type="text" className="form-input" value={req.skill?.major || ""} readOnly />
                    </div>
                    <div className="form-input-group">
                        <span className="form-label">Tuition:</span>
                        <input type="text" className="form-input" value={req.skill?.tuition || ""} readOnly />
                    </div>
                    <div className="form-input-group">
                        <span className="form-label">Study Years:</span>
                        <input type="text" className="form-input" value={req.skill?.years || ""} readOnly />
                    </div>
                </div>
                <button className="column-button" onClick={toggleStudy} disabled={!studyPermitFile}>
                    {studyPermitFile ? "📄 Study Permit" : "❌ No File"}
                </button>
            </div>

            {/* Column 4: Bank Details */}
            <div className="form-column">
                <div className="fields-section">
                    <h5 className="column-title">Bank Info</h5>
                    <div className="form-input-group">
                        <span className="form-label">Account Holder:</span>
                        <input type="text" className="form-input" value={req.bank?.hName || ""} readOnly />
                    </div>
                    <div className="form-input-group">
                        <span className="form-label">Account No:</span>
                        <input type="text" className="form-input" value={req.bank?.account || ""} readOnly />
                    </div>
                    <div className="form-input-group">
                        <span className="form-label">Bank Name:</span>
                        <input type="text" className="form-input" value={req.bank?.bName || ""} readOnly />
                    </div>
                    <div className="form-input-group">
                        <span className="form-label">Branch No:</span>
                        <input type="text" className="form-input" value={req.bank?.branch || ""} readOnly />
                    </div>
                </div>
                <button className="column-button" onClick={toggleBank} disabled={!bankAuthFile}>
                    {bankAuthFile ? "📄 Bank Auth" : "❌ No File"}
                </button>
            </div>

        </div>
    )
}