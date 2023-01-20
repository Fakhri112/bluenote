
import React, { useContext, useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from '@firebase/auth'

const Context = React.createContext()

export function useDataContext() {
    return useContext(Context)
}


export const StateProvider = ({ children }) => {

    const auth = getAuth()
    const [userData, setUserData] = useState(false)
    const [DataContext, SetDataContext] = useState({})

    useEffect(() => {
        let LocalUser = JSON.parse(localStorage.getItem("logged_user"))
        setUserData(LocalUser)
        if (typeof window !== "undefined") {
            onAuthStateChanged(auth, (user) => {
                if (user?.uid !== LocalUser?.user?.uid) {
                    localStorage.removeItem("logged_user")
                    return setUserData(null)
                }
            })
        }

        return
    }, [])

    useEffect(() => {
        // sessionStorage.setItem('Context_hook', '{}')
        // if (JSON.stringify(DataContext) !== '{}') {
        //     sessionStorage.setItem('Context_hook', JSON.stringify(DataContext))
        // }
        // let get_context_hook = JSON.parse(sessionStorage.getItem("Context_hook"))
        // if (JSON.stringify(DataContext) == JSON.stringify(get_context_hook)) {
        //     return
        // }

        // return SetDataContext(get_context_hook)
        // console.log = () => { }
        // console.error = () => { }
        // console.debug = () => { }
    })



    const value = { userData, DataContext, SetDataContext }

    return <Context.Provider value={value} >
        {children}
    </Context.Provider>

}