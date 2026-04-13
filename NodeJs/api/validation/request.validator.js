import Joi from 'joi';
import { isIsraeliIdValid } from './user.validator.js'
// בדיקה- לא פחות מגיל 16
const sixteenYearsAgo = new Date();
sixteenYearsAgo.setFullYear(sixteenYearsAgo.getFullYear() - 16);

export const requestSchema = Joi.object({
  self: Joi.object({
    idUser: Joi.string().custom((value, helpers) => {
      if (!isIsraeliIdValid(value))
        return helpers.message('id is not valid');
      return value;
    }).required(),
    name: Joi.string().min(2).required(),
    LName: Joi.string().min(2).required(),
    dateBorn: Joi.date().max(sixteenYearsAgo).required(),
    address: Joi.string().required(),
    phone: Joi.string().pattern(/^0\d{9}$/).required(),
    // הוספת השדה כאן כדי ש-Joi יאשר אותו
        idCardFile: Joi.any().optional()
  }).required(),

  family: Joi.object({
    father: Joi.string().required(),
    mother: Joi.string().required(),
    numChildren: Joi.number().min(0).max(30).required(),
    numAdult: Joi.number().min(0).max(Joi.ref('numChildren')).required()
  }).required(),
  skill:Joi.object({
    major:Joi.string().required(),
    tuition:Joi.number().required(),
    years:Joi.number().min(0).required(),
    studyPermitFile: Joi.any().optional() // אישור קובץ לימודים
  }).required(),
  bank:Joi.object({
    hName:Joi.string().required(),
    account:Joi.string().min(6).required(),
    bName:Joi.string().required(),
    branch:Joi.string().required(),
   bankAuthFile: Joi.any().optional() // אישור קובץ בנק
  }).required()
  
})