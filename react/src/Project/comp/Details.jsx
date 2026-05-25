import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { getDetails } from "../api/admin"
import { useFilePreview } from "../hooks/useFilePreview"

export const Details = () => {
    const { id } = useParams()
    const [req, setReq] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
    
        const fetch = async () => {
            try {
                const res = await getDetails(id)
                setReq(res.data.request)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [id])

    // המרת buffer לקובץ — בדיוק כמו ב-useLoadRequest
    const bufferToFile = (fileObj, fileName) => {
        if (!fileObj?.data) return null
        const blob = new Blob([new Uint8Array(fileObj.data.data)], { type: fileObj.contentType })
        return new File([blob], fileName, { type: fileObj.contentType })
    }

    const idCardFile = req?.self?.idCardFile ? bufferToFile(req.self.idCardFile, "תעודת זהות") : null
    const studyPermitFile = req?.skill?.studyPermitFile ? bufferToFile(req.skill.studyPermitFile, "אישור לימודים") : null
    const bankAuthFile = req?.bank?.authFile ? bufferToFile(req.bank.authFile, "אישור בנק") : null

    const { toggle: toggleId, Preview: IdPreview } = useFilePreview(idCardFile)
    const { toggle: toggleStudy, Preview: StudyPreview } = useFilePreview(studyPermitFile)
    const { toggle: toggleBank, Preview: BankPreview } = useFilePreview(bankAuthFile)

    if (loading) return <div>טוען...</div>
    if (!req) return <div>לא נמצאה בקשה</div>

    return (
        <div>
            <h4>פרטי בקשה</h4>

            <h6>פרטים אישיים</h6>
            <p>מזהה: {req.self?.idUser}</p>
            <p>שם: {req.self?.name} {req.self?.LName}</p>
            <p>תאריך לידה: {req.self?.dateBorn}</p>
            <p>כתובת: {req.self?.address}</p>
            <p>טלפון: {req.self?.phone}</p>
            {idCardFile && <>
                <button onClick={toggleId}>📄 תעודת זהות</button>
                <IdPreview />
            </>}

            <h6>פרטי משפחה</h6>
            <p>אב: {req.family?.father}</p>
            <p>אם: {req.family?.mother}</p>
            <p>מספר ילדים: {req.family?.numChildren}</p>
            <p>ילדים מעל 19: {req.family?.numAdult}</p>

            <h6>פרטי לימודים</h6>
            <p>מגמה: {req.skill?.major}</p>
            <p>שכר לימוד: {req.skill?.tuition}</p>
            <p>שנות לימוד: {req.skill?.years}</p>
            {studyPermitFile && <>
                <button onClick={toggleStudy}>📄 אישור לימודים</button>
                <StudyPreview />
            </>}

            <h6>פרטי בנק</h6>
            <p>שם בעל החשבון: {req.bank?.hName}</p>
            <p>מספר חשבון: {req.bank?.account}</p>
            <p>שם בנק: {req.bank?.bName}</p>
            <p>סניף: {req.bank?.branch}</p>
            {bankAuthFile && <>
                <button onClick={toggleBank}>📄 אישור בנק</button>
                <BankPreview />
            </>}
        </div>
    )
}