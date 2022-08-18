import axios from "axios";
import Joi from "joi";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    age: 0,
    email: "",
    password: "",
  });
  function getUserData(e) {
    let myUser = { ...user }; //deep copy
    myUser[e.target.name] = e.target.value;
    setUser(myUser);
  }
function validateForm(){
  let scheme = Joi.object({
    first_name: Joi.string().alphanum().required().min(3).max(30),
    last_name: Joi.string().alphanum().required().min(3).max(30),
    age: Joi.number().min(8).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  });
  return scheme.validate(user,{abortEarly:false});
}
const navigate=useNavigate()
  async function submitForm(e) {
    e.preventDefault();
    setLoading(true)
    let validationResult=validateForm();
if(validationResult.error){
  setErrorList(validationResult.error.details)
setLoading(false)

}
else{
  let { data } = await axios.post("https://route-egypt-api.herokuapp.com/signup", user  );
  if (data.message == "success") {
     navigate('/login')
setLoading(false)} 
else {
    setError(data.message);
setLoading(false)
  }
}
}
  return (
    <>
      <div className="mx-auto w-75">
      <h1 className="text-center">Register form</h1>

        <form onSubmit={submitForm}>
        {errorList.map((error)=><div className="alert alert-danger">{error.message}</div>)}

          {error ? <div className="alert alert-danger">{error}</div> : ""}
          <label htmlFor="first_name">first_name:</label>
          <input
            type="text"
            onChange={getUserData}
            className="mb-2 form-control"
            id="first_name"
            name="first_name"
          />

          <label htmlFor="last_name">last_name:</label>
          <input
            type="text"
            onChange={getUserData}
            className="mb-2 form-control"
            id="last_name"
            name="last_name"
          />

          <label htmlFor="age">Age:</label>
          <input
            type="number"
            onChange={getUserData}
            className="mb-2 form-control"
            id="age"
            name="age"
          />

          <label htmlFor="email">email:</label>
          <input
            type="email"
            onChange={getUserData}
            className="mb-2 form-control"
            id="email"
            name="email"
          />

          <label htmlFor="password">password:</label>
          <input
            type="password"
            onChange={getUserData}
            className="mb-2 form-control"
            id="password"
            name="password"
          />

          <button type="submit" className="btn btn-info float-end">
           {loading===true?<i className="fa fa-spinner fa-spin"></i>:"Register" }
          </button>
          
        </form>
      </div>
    </>
  );
}

