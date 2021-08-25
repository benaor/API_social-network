import React from "react"
import cookie from "js-cookie"
import axios from "axios"

const Logout = () => {
  const removeCookie = (key) => {
    if (window !== undefined) cookie.remove(key, { expires: 1 })
  }

  const logout = async () => {
    await axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}api/user/logout`,
      withCredentials: true
    })
      .then(() => removeCookie("jwt"))
      .catch((err) => console.error(err))
      
    window.location = "/"
  }

  return (
    <li onClick={logout}>
      <img src="./img/icons/logout.svg" alt="logout" />
    </li>
  )
}

export default Logout
