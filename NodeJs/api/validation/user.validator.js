import Joi from 'joi';

// פונקציה לבדיקת תקינות תעודת זהות
 export const isIsraeliIdValid = (id) => {
    id = String(id).trim();
    if (id.length !== 9 || isNaN(id)) return false;
    
    // חישוב ספרת ביקורת
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        let num = Number(id[i]) * ((i % 2) + 1);
        if (num > 9) num -= 9;
        sum += num;
    }
    return sum % 10 === 0;
};
// הגדרת החוקים לכל טופס
export const registerSchema = Joi.object({
    id_user: Joi.string().custom((value, helpers) => {
        if (!isIsraeliIdValid(value)) {
            return helpers.message('Id is not validation'); }
        return value; // הכל תקין
    }).required(),
    selfName: Joi.string().min(2).required(),
    familyName: Joi.string().min(2).required(),
    password: Joi.string().min(6).required(),
});