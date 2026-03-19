import { useSelector } from "react-redux"
import { useParams } from "react-router";


export const  Details=()=>{
  const {idReq } = useParams()
//שליפה מהסטייט את הבקשה המבוקשת
const state=useSelector((state)=>state?.request?.list)
const req= state.find(r => r.id ===Number(idReq ));
return<>
<div>
 <h4>Details:</h4>
 {req?
    <pre>{(JSON.stringify(req, null, 2)).replaceAll("{", "").replaceAll('"', "").replaceAll().replaceAll('\n', '').replaceAll("},", "\n")}</pre>
 :
 null}</div>
 </>
}