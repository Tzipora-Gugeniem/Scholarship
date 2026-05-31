// כל הפעולות שהמנהל היחיד שמורשה לבצע
import requestModel from "../models/request.js";
import fs from 'fs';
// עדכון סטטוס של בקשה מסוימת (סרוב או אישור)
export const updateRequestStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'allowed' או 'rejected'

    if (!['allowed', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    try {
        const updated = await requestModel.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json(err);
    }
};
//אישור או סירוב בקשות רבות בו זמנית
// פונקציה לעדכון סטטוס מרוכז (Bulk Update)
export const bulkUpdateStatus = async (req, res) => {
    try {
        const { ids, status } = req.body; // ids יהיה מערך: ['id1', 'id2', ...]

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "Invalid or empty IDs array" });
        }

        // עדכון כל המסמכים שה-ID שלהם נמצא בתוך המערך ids
        await requestModel.updateMany(
            { _id: { $in: ids } },
            { $set: { status: status } }
        );

        res.status(200).json({ message: `Successfully updated ${ids.length} requests.` });
    } catch (error) {
        console.error("Error in bulk update:", error);
        res.status(500).json({ message: "Server Error during bulk update" });
    }
};
// מחיקת בקשה ספציפית

     
// קבלת פרטי בקשה ספציפית
export const getDetails = async (req, res) => {
    const { id } = req.params;  
    try {
        const request = await requestModel.findById(id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }       
        res.status(200).json(request);
    } catch (err) {
        res.status(500).json(err);
    }     
};

//מחיקת בקשה כולל מחיקת קבצים קשורים
export const deleteRequest = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await requestModel.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Request not found' });
        }
        // מחיקת קבצים קשורים מהדיסק
        const filesToDelete = [
            deleted.self?.idCardFile,
            deleted.skill?.studyPermitFile,
            deleted.bank?.authFile
        ].filter(Boolean); // מסנן ערכים ריקים או לא מוגדרים       
        filesToDelete.forEach(filePath => {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }  
        });
        res.status(200).json({ message: 'Request and associated files deleted successfully' });
    }       
    catch (err) {
        res.status(500).json(err);
    }
};
// מחיקת בקשות מרובות כולל קבצים קשורים
export const bulkDeleteRequests = async (req, res) => {
    try {   
        const { ids } = req.body; // ids יהיה מערך: ['id1', 'id2', ...]
        if (!Array.isArray(ids) || ids.length === 0) {
            // אם המערך ריק או לא תקין, נחזיר שגיאה 
            return res.status(400).json({ message: "Invalid or empty IDs array" });
        }
        // שליפת כל הבקשות שברצוננו למחוק כדי לקבל את הנתיבים של הקבצים הקשורים
        const requestsToDelete = await requestModel.find({ _id: { $in: ids } });    
        // מחיקת קבצים קשורים מהדיסק לכל בקשה שנמחקת
        requestsToDelete.forEach(request => {
            const filesToDelete = [
                request.self?.idCardFile,
                request.skill?.studyPermitFile,
                request.bank?.authFile
            ].filter(Boolean);
            filesToDelete.forEach(filePath => {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath
                );
                }
            });
        });
        // מחיקת הבקשות מהמסד נתונים
        const deleteResult = await requestModel.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: `Successfully deleted ${deleteResult.deletedCount} requests and their associated files.` });
    }
        catch (error) {
            console.error("Error in bulk delete:", error);
            res.status(500).json({ message: "Server Error during bulk delete" });
        }
};

export const getAllFilteredRequests = async (req, res) => {
    try {
        const {
            status,
            idUser,
            startDate, endDate,
            minUnder18, maxUnder18,
            minTuition, maxTuition
        } = req.query;

        const hasValue = (value) => value !== undefined && value !== null && value !== "";
        let query = {};

        // 1. סינון לפי סטטוס
        if (status) {
            query.status = status;
        } else {
            query.status = { $ne: "draft" };
        }

        // 2. סינון לפי טווח תאריכים
        if (hasValue(startDate) || hasValue(endDate)) {
            query.lastSavedAt = {};
            if (hasValue(startDate)) query.lastSavedAt.$gte = new Date(startDate);
            if (hasValue(endDate)) query.lastSavedAt.$lte = new Date(endDate);
        }

        // 3. חיפוש לפי ת"ז
        if (hasValue(idUser)) {
            query["self.idUser"] = idUser;
        }

        // 4. סינון לפי טווח שכר לימוד
        if (hasValue(minTuition) || hasValue(maxTuition)) {
            query["skill.tuition"] = {};
            if (hasValue(minTuition)) query["skill.tuition"].$gte = Number(minTuition);
            if (hasValue(maxTuition)) query["skill.tuition"].$lte = Number(maxTuition);
        }

        // 5. סינון לפי אחים מתחת לגיל 18
        if (hasValue(minUnder18) || hasValue(maxUnder18)) {
            const under18Count = {
                $subtract: [
                    { $ifNull: ["$family.numChildren", 0] },
                    { $ifNull: ["$family.numAdult", 0] }
                ]
            };

            const exprClauses = [];
            if (hasValue(minUnder18)) exprClauses.push({ $gte: [under18Count, Number(minUnder18)] });
            if (hasValue(maxUnder18)) exprClauses.push({ $lte: [under18Count, Number(maxUnder18)] });

            if (exprClauses.length === 1) {
                query.$expr = exprClauses;
            } else if (exprClauses.length > 1) {
                query.$expr = { $and: exprClauses };
            }
        }

        // שליפת הנתונים המסוננים מהבסיס נתונים
        const requests = await requestModel.find(query);
        res.status(200).json({ data: requests });

    } catch (error) {
        console.error("Error fetching filtered requests:", error);
        res.status(500).json({ message: "Server Error" });
    }
};