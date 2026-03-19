import { Checkbox } from "@mui/material"
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { updateCurrentDetails } from "../../redux/request"
import { useFiles } from "../../context/FileContext"
import { useFilePreview } from "../../hooks/useFilePreview"

export const Bank = () => {
  //שליפת הסטייט
  const state = useSelector((state) => state.request.Current)
  // שימוש במחסן הטפסים
const { bankAuthFile, setBankAuthFile } = useFiles()
  const { toggle: toggleBank, Preview: BankPreview } = useFilePreview(bankAuthFile)
  const initialBankDetails = { ...state?.bank }; // שימוש בשרשור אופציונלי וערך ברירת מחדל
  const [Bank, setBank] = useState({
    ...initialBankDetails
  });

  //הגדרת dispatch
  const dispatch = useDispatch()

  //הגדרת מילון הבנקים וסניפיהם
  const dictionary = {
    "99 - Bank of Israel": [
      "001 - Central Office",
      "002 - Government Complex",
      "003 - Finance Tower",
      "004 - National Accounts Center",
      "005 - Monetary Division",
      "006 - Supervision Offices"
    ],

    "10 - Bank Leumi": [
      "701 - Jerusalem - Ramot Mall",
      "702 - Jerusalem - Geula",
      "703 - Jerusalem - Talpiot",
      "704 - Tel Aviv - Ibn Gvirol",
      "705 - Haifa - Horev Center",
      "706 - Bnei Brak - Rabbi Akiva"
    ],

    "12 - Bank Hapoalim": [
      "801 - Jerusalem - Malcha",
      "802 - Jerusalem - Talpiot",
      "803 - Jerusalem - Center",
      "804 - Tel Aviv - Azrieli",
      "805 - Ramat Gan - Diamond District",
      "806 - Haifa - Carmel Center"
    ],

    "11 - Discount Bank": [
      "401 - Jerusalem - City Center",
      "402 - Jerusalem - Romema",
      "403 - Tel Aviv - Rothschild",
      "404 - Bnei Brak - Jabotinsky",
      "405 - Haifa - Downtown",
      "406 - Ashdod - City Center"
    ],

    "20 - Mizrahi Tefahot Bank": [
      "301 - Lod - Industrial Zone",
      "302 - Jerusalem - Geula",
      "303 - Jerusalem - Talpiot",
      "304 - Tel Aviv - Hashalom",
      "305 - Haifa - Merkaz HaCarmel",
      "306 - Modiin - Azrieli Mall"
    ],

    "4 - Bank Yahav": [
      "101 - Jerusalem - Government Offices",
      "102 - Tel Aviv - Hashalom",
      "103 - Haifa - Horev",
      "104 - Ashkelon - City Center",
      "105 - Beersheba - Old City",
      "106 - Netanya - Herzl Street"
    ],

    "14 - Otzar HaHayal Bank": [
      "201 - Jerusalem - City Center",
      "202 - Tel Aviv - Dizengoff",
      "203 - Haifa - Carmel",
      "204 - Ramat Gan - Bialik",
      "205 - Beer Sheva - Kanyon HaNegev",
      "206 - Netanya - Independence Square"
    ],

    "31 - First International Bank": [
      "501 - Jerusalem - King George",
      "502 - Tel Aviv - Azrieli",
      "503 - Herzliya - High Tech Park",
      "504 - Haifa - Central Station",
      "505 - Ramat Gan - Diamond Exchange",
      "506 - Modiin - City Center"
    ],

    "17 - Mercantile Bank": [
      "601 - Jaffa - Old City",
      "602 - Haifa - Downtown",
      "603 - Jerusalem - City Center",
      "604 - Ashdod - Marina",
      "605 - Lod - Ramat Eshkol",
      "606 - Bnei Brak - Rabbi Akiva"
    ],

    "54 - Jerusalem Bank": [
      "901 - Jerusalem - Givat Shaul",
      "902 - Jerusalem - City Entrance",
      "903 - Jerusalem - Center",
      "904 - Beit Shemesh - City Center",
      "905 - Modiin Illit - Kiryat Sefer",
      "906 - Tel Aviv - Hashalom"
    ]
  }



  //טיפול במילון הבנקים
  const bank = Object.keys(dictionary)
// משתנה זה יבדוק מתי הטופס מלא ותקין-2
//  מתי הטופס לא מלא -1
//  מתי הערך לא תקין -0
const[correctAccount,setCorrectAccount]=useState(true)
  const isComplete =!!(Bank.account && Bank.branch && Bank.bName && Bank.hName&& correctAccount &&bankAuthFile)+!!(correctAccount)
// בעת שינוי הערכים ישמר ברידקס
  useEffect(() => {
   
 dispatch(updateCurrentDetails({ ...state, bank: { ...Bank }, bankValid:isComplete }))
console.log(Bank);


  }, [isComplete,Bank])
  return <>
    <div className="input">
      <h1> Bank Details </h1>

      <label name="nameb">Bank Account Holder</label>
      <input type="text" onChange={(e) => {
        setBank({ ...Bank, hName: e.target.value })
      }} value={Bank.hName} />
      <label name="nameA" >   Account Number </label>
      <input type="text" onChange={(e) => {
        setBank({ ...Bank, account: e.target.value })
      }} value={Bank.account}
      minLength={6}   onBlur={(e)=>{setCorrectAccount(e.target.validity.valid)}} />
      
                        {/* יןצג בעת שגיאה */}
        <p hidden={correctAccount} style={{color:'red'}}>At least 6 digits</p>
      <br></br>

      <select onChange={(e) => {
        // ברגע שיתשנה שם בנק  יצטרכו לבחור גם סניףך
        setBank({ ...Bank, bName: e.target.value, branch:"" })
      }
      } value={Bank.bName}>
        <option selected hidden > Choose Bank Name  </option>
        {bank.map((m) => <option value={m}>{m}</option>)}
      </select>
    
      {Bank.bName &&
        <select onChange={(e) => { setBank({ ...Bank, branch: e.target.value }) }} value={Bank.branch}>
          <option selected hidden >Choose Bank Branch </option>
          {dictionary[Bank.bName].map((name) => <option value={name}>{name}</option>)}
        </select>

        
      }
 <input 
  id="bankFile"
  type="file"
  accept=".jpg,.png,.pdf" 
  onChange={(e) => setBankAuthFile(e.target.files[0])}
  style={{ display: 'none' }}
/>

<label htmlFor="bankFile"  className="btn" style={{borderColor:'#009FAF',width:'50%',}}>
  📎upload auth bank file {/* ← הכיתוב שאת רוצה */}
</label>
        {bankAuthFile && <>
        <button onClick={toggleBank} className="fileButton">📄 {bankAuthFile.name}</button>
        <BankPreview />
        </>}
    
</div>


  </>
}
