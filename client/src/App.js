import React, { useEffect, useState } from "react"
import Routes from "./components/routes"
import { UidContext } from "./components/AppContext"
import axios from "axios"
import { useDispatch } from "react-redux"
import { getUser } from "./actions/user.action"

const App = () => {
  const [uid, setUid] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchToken = async () => {
      axios({
        method: "get",
        url: `${process.env.REACT_APP_API_URL}jwtid`,
        withCredentials: true
      })
        .then((res) => {
          setUid(res.data)
        })
        .catch((err) => console.error("No token : " + err))
    }
    fetchToken()
    if (uid) dispatch(getUser(uid))
  }, [uid])

  return (
    <UidContext.Provider value={uid}>
      <Routes />
    </UidContext.Provider>
  )
}
export default App
