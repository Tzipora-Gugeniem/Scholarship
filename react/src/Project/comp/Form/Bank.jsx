import { Checkbox, Autocomplete, TextField } from "@mui/material"
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { updateCurrentDetails } from "../../redux/request"
import { useFiles } from "../../context/FileContext"
import { useFilePreview } from "../../hooks/useFilePreview"
import { banks } from "../../api/user"

export const Bank = () => {
  const dispatch = useDispatch()
  const state = useSelector((state) => state.request.Current)
  const[isAccountValid,setIsAccountValid]=useState(true)
  const { authFile, setAuthFile } = useFiles()
  const { toggle: toggleBank } = useFilePreview(authFile)
  
  const [Bank, setBank] = useState({
    hName: state?.bank?.hName || "",
    account: state?.bank?.account || "",
    bName: state?.bank?.bName || "", 
    branch: state?.bank?.branch || ""
  });

  const [dictionary, setDictionary] = useState({});
  const [bankList, setBankList] = useState([]); 
  const [loadingBanks, setLoadingBanks] = useState(true);

  useEffect(() => {
    const fetchBanksFromServer = async () => {
      try {
        setLoadingBanks(true);
        const response = await banks();
        let rawData = response?.data ? response.data : response;

        if (rawData && typeof rawData === 'object') {
          setDictionary(rawData);
          setBankList(Object.keys(rawData).sort());
        }
      } catch (error) {
        console.error("Failed to fetch banks from server:", error);
      } finally {
        setLoadingBanks(false);
      }
    };
    fetchBanksFromServer();
  }, []); 


  const isComplete = !!(Bank.account && Bank.branch && Bank.bName && Bank.hName && isAccountValid && authFile) + !!(isAccountValid);

  useEffect(() => {
    if (loadingBanks && bankList.length === 0) return;
    dispatch(updateCurrentDetails({ ...state, bank: { ...Bank }, bankValid: isComplete }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Bank, isComplete, authFile, dispatch]);

  return <>
    <div className="input" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <h1> Bank Details </h1>

      <div>
        <label>Bank Account Holder</label>
        <input type="text" onChange={(e) => setBank({ ...Bank, hName: e.target.value })} value={Bank.hName} />
      </div>
      
      <div>
        <label> Account Number </label>
        <input type="text" onChange={(e) => setBank({ ...Bank, account: e.target.value })} value={Bank.account} minLength={6}  onBlur={(e)=>setIsAccountValid(e.target.validity.valid)}/>
        {!isAccountValid && <p style={{ color: 'red', fontSize: '13px', margin: '5px 0 0 0' }}>At least 6 digits</p>}
      </div>

      
      <div style={{ width: '100%', marginTop: '10px' }}>
      
        <label style={{ display: 'block', marginBottom: '8px' }}>Choose Bank Name</label>
        <Autocomplete
          options={bankList}
          loading={loadingBanks}
          value={Bank.bName || null}
          onChange={(event, newValue) => {
            setBank({ ...Bank, bName: newValue || "", branch: "" });
            
          }}
          
          renderInput={(params) => (
            <TextField 
              {...params} 
              variant="outlined" 
              // משתמשים ב-placeholder נקי שייעלם מיד כשמתחילים להקליד, בלי לייבלים קופצים
              placeholder={loadingBanks ? "Loading..." : "Select or type to search..."}
              fullWidth
              // 💡 השורה שמבטלת לחלוטין את הלייבל הפנימי המציק של MUI ומנקה את הריבוע
              InputLabelProps={{ shrink: false }} 
              
            />
          )}
        />
      </div>
      {Bank.bName && Bank.bName.trim() !== "" && dictionary[Bank.bName] && (
        <div style={{ width: '100%', marginTop: '10px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>Choose Bank Branch</label>
          <Autocomplete
            
            options={dictionary[Bank.bName]}
            value={Bank.branch || null}
            onChange={(event, newValue) => {
              setBank({ ...Bank, branch: newValue || "" });
            }}
            renderInput={(params) => (
              <TextField 
              
                {...params} 
                variant="outlined" 
                placeholder="Select or type branch..."
                fullWidth
                InputLabelProps={{ shrink: false }}
              />
            )}
          />
        </div>
      )}

      <div style={{ marginTop: '15px' }}>
        <input id="bankFile" type="file" accept=".jpg,.png,.pdf" onChange={(e) => {
      
        setAuthFile(e.target.files[0]);
      }} 
      style={{ display: 'none' }} />
        <label htmlFor="bankFile" className="btn" style={{ borderColor: '#009FAF', width: '50%', display: 'inline-block', cursor: 'pointer', textAlign: 'center' }}>
          📎 upload auth bank file 
        </label>
        
        {authFile && (
          <div style={{ marginTop: '10px' }}>
            <button onClick={toggleBank} className="fileButton">📄 {authFile.name || "File attached"}</button>
          </div>
        )}
      </div>
    </div>
  </>
}