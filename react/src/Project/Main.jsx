import { Provider } from "react-redux"
import { Routing } from "./Route/Routing"
import store from "./redux/store"
import'./css/main.css'
export const Main=()=>{
    return<>
    <Provider store={store}>
    <Routing></Routing>
    </Provider>
    </>
}