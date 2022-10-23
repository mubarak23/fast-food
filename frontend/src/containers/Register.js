import React,{useRef, useState} from "react";
import { StyledRegister } from "../styles/layout"
import signup from '../assets/img/register.png'
import eyeSlash from '../assets/img/eye-slash.png'
import eye from '../assets/img/eye.png'
import loader from '../assets/img/loader-cube.svg'
import { validateRegister } from '../helper'
import { withRouter  } from 'react-router-dom';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { register } from "../actions/auth";

const Register = (props) => {
    let firstName = useRef()
    let lastName = useRef()
    let phone = useRef()
    let email = useRef()
    let password = useRef()

    const [secure, setSecure] = useState(true)
    const [errors, setErrors] = useState({})
    const registerUser = async ({current:{value: firstName}},{current:{value: lastName}},
        {current:{value: phone}},{current:{value: email}},{current:{value: password}}) => {
            let check = validateRegister({firstName,lastName,phone, email, password})
    let dis = {}
    if (check.valid === false) {
      if (check.errors.fname) {
        dis.fname = check.errors.fname
        setErrors(dis)
      }
      if (check.errors.lname) {
        dis.lname = check.errors.lname
        setErrors(dis)
      }
      if (check.errors.phone) {
        dis.phone = check.errors.phone
        setErrors(dis)
      }
      if (check.errors.email) {
        dis.email = check.errors.email
        setErrors(dis)
      }
      if (check.errors.password) {
        dis.password = check.errors.password
        setErrors(dis)
      }
      return
    }
    setErrors({})
    let name = `${firstName} ${lastName}` 
    let res = await props.register(name, phone, email, password)
    if(res) props.history.push('/login')   
     }
    return (
        <StyledRegister>
             <div id="image" className=" hidden sm:block sm:w-1/3 sm:mb-2 sm:m-6">
            <img src={signup} className="mt-32 h-32  sm:h-32 xl:h-64 object-cover" alt="Logo"/>
            </div>
            <div id="content" className="sm:w-1/2">
            <span className="text-gray-900  text-3xl mb-6 font-bold">
                Create an account
            </span>
            
            <p className="text-gray-900 text-md">Set up your account and place your order right away </p>
            <form className="w-full max-w-lg mt-6" onSubmit={(e)=> { e.preventDefault(); registerUser(firstName, lastName,phone,email,password)}}>
            <div className="flex flex-wrap -mx-3 mb-6 ">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                    First Name
                  </label>
                  <input ref={firstName} className={`appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white ${errors.firstName ? "border-red-500 " : " border-gray-200"}`}
                   id="grid-first-name" type="text" placeholder="First Name"/>
                  {errors.fname ? (
                    <p className="text-red-500 text-xs italic">{errors.firstName}</p>
                  ) : ''}
                </div>
                <div className="w-full md:w-1/2 px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                    Last Name
                  </label>
                  <input ref={lastName} className={`appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 ${errors.lastName ? "border-red-500 " : " border-gray-200"}`}
                   id="grid-last-name" type="text" placeholder="Last Name"/>
                  {errors.lname ? (
                    <p className="text-red-500 text-xs italic">{errors.lastName}</p>
                  ) : ''}
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                  <label className="block uppercase tracking-wide  text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
                    Password
                  </label>
                  <span className={`w-full inline-flex items-center rounded border border-r-1  bg-gray-200 
                  text-gray-700 mb-2 border-gray-200 text-sm  focus:outline-none focus:bg-white focus:border-gray-500 
                  ${errors.password ? "border-red-500 " : " border-gray-200"}`}>
          <input ref={password} className="appearance-none block rounded w-full py-3 px-4 leading-tight" 
          id="grid-password" type={secure ? 'password' : 'text'} placeholder="******************"/>
           {
             secure ? (

               <img src={eyeSlash} alt="slash" onClick={() => { setSecure(!secure)}} 
               className="h-6 w-10 px-2 cursor-pointer fill-current"/>
             ) :(

               <img src={eye} alt="slash" onClick={() => { setSecure(!secure)}} 
               className="h-8 w-10 px-1 cursor-pointer fill-current"/>
             )
           }
        </span>
        {errors.password ? (
                    <p className="text-red-500 text-xs italic">{errors.password}</p>
                  ) : (
                    <p className="text-gray-600 text-xs italic">Make it something Unique that only you can remember</p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-2">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" 
                  htmlFor="grid-email">
                    Email Address
                  </label>
                  <input ref={email} className={`appearance-none block w-full bg-gray-200 text-gray-700 
                  border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 
                  ${errors.email ? "border-red-500 " : " border-gray-200"}`} id="grid-email" 
                  type="email" placeholder="test@gmail.com"/>
                  {errors.email ? (
                    <p className="text-red-500 text-xs italic">{errors.email}</p>
                  ) : ''}
                </div>
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" 
                  htmlFor="grid-phone">
                    Phone Number
                  </label>
                  <input ref={phone} className={`appearance-none block w-full bg-gray-200 text-gray-700 border
                   rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 
                   ${errors.phone ? "border-red-500 " : " border-gray-200"}`} id="grid-phone" type="phone"
                    placeholder="09039287834"/>
                  {errors.phone ? (
                    <p className="text-red-500 text-xs italic">{errors.phone}</p>
                  ) : ''}
                </div>
              </div>
              <button disabled={props.loading} className={`w-full mt-3 flex justify-center
               hover:bg-gray-200 hover:text-gray-900 rounded-md px-3 py-3 uppercase 
               ${ props.loading ? "bg-gray-200  text-black cursor-not-allowed": 
               "bg-gray-900  text-white cursor-pointer"}`}>
                {props.loading ?  (
                    <>
                    <img src={loader} className="h-6 w-10 px-2 fill-current" alt="loading..."/>
                    loading &nbsp;...
                    </>
                ):'SIGN UP'}
                </button>        
            </form>  
            </div>
        </StyledRegister>
    )    
}

const mapStateToProps = (state) => ({
    loading: state.loading.status
  });
  
  const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ register }, dispatch);
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Register));