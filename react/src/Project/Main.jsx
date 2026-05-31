import { Provider } from "react-redux"
import { Routing } from "./Route/Routing"
import store from "./redux/store"
import './css/main.css'
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setCurrent } from "./redux/Users"
import { getMe } from "./api/user"
import { setLoadingDone } from "./redux/Users"

const AppWrapper = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const restoreUser = async () => {
            try {
                const data = await getMe();
                dispatch(setCurrent(data.user));
            } catch (err) {
                 dispatch(setLoadingDone())
            }
        };
        restoreUser();
    }, []);

    return <Routing />
}

export const Main = () => {
    return (
        <Provider store={store}>
            <AppWrapper />
        </Provider>
    )
}