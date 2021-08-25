import axios from "axios"
import React, { useState } from "react"
import SignInForm from "./SignInForm"

const SignUpForm = () => {
  const [formSubmit, setFormSubmit] = useState(false)
  const [pseudo, setPseudo] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [controlPassword, setControlPassword] = useState("")

  const handleRegister = async (e) => {
    e.preventDefault()
    const terms = document.getElementById("terms")
    const pseudoError = document.querySelector(".pseudo.error")
    const emailError = document.querySelector(".email.error")
    const passwordError = document.querySelector(".password.error")
    const passwordConfError = document.querySelector(".password-confirm.error")
    const termsError = document.querySelector(".terms.error")

    terms.innerHTML = ""
    pseudoError.innerHTML = ""
    emailError.innerHTML = ""
    passwordError.innerHTML = ""
    passwordConfError.innerHTML = ""
    termsError.innerHTML = ""

    if (password !== controlPassword || !terms.checked) {
      if (password !== controlPassword)
        passwordConfError.innerHTML =
          "Les mots de passes ne sont pas identique."
      if (!terms.checked)
        termsError.innerHTML =
          "Vous devez acceptez les conditions d'utilisation"
    } else {
      await axios({
        method: "post",
        url: `${process.env.REACT_APP_API_URL}api/user/register`,
        data: { pseudo, email, password }
      })
        .then((res) => {
          if (res.data.errors) {
            pseudoError.innerHTML = res.data.errors.pseudo
            emailError.innerHTML = res.data.errors.email
            passwordError.innerHTML = res.data.errors.password
          } else {
            setFormSubmit(true)
          }
        })
        .catch((err) => console.error(err))
    }
  }

  return (
    <>
      {formSubmit ? (
        <>
          <SignInForm />
          <span></span>
          <h4 className="success">
            Inscription réussie. Veuillez vous connecter
          </h4>
        </>
      ) : (
        <form action="" onSubmit={handleRegister} id="sign-up-form">
          {/* Form for pseudo */}
          <label htmlFor="pseudo">Pseudo</label>
          <br />
          <input
            type="text"
            name="pseudo"
            id="pseudo"
            onChange={(e) => setPseudo(e.target.value)}
            value={pseudo}
          />
          <div className="pseudo error"></div>
          <br />

          {/* form for email */}
          <label htmlFor="email">email</label>
          <br />
          <input
            type="email"
            name="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <div className="email error"></div>
          <br />

          {/* form for password */}
          <label htmlFor="password">Mot de passe</label>
          <br />
          <input
            type="password"
            name="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <div className="password error"></div>
          <br />

          {/* form for password-conf */}
          <label htmlFor="password-conf">Confirmez le mot de passe</label>
          <br />
          <input
            type="password"
            name="password-conf"
            id="password-conf"
            onChange={(e) => setControlPassword(e.target.value)}
            value={controlPassword}
          />
          <div className="password-confirm error"></div>
          <br />
          <input type="checkbox" name="terms" id="terms" />
          <label htmlFor="terms">
            J'accepte les{" "}
            <a href="/" target="_blank" refs="noopener noreferrer">
              conditions générales d'utilisation
            </a>
          </label>
          <div className="terms error"></div>

          <input type="submit" value="inscription" />
        </form>
      )}
    </>
  )
}

export default SignUpForm
