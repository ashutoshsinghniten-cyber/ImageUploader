import React, {useState} from 'react'
import {useDispatch} from 'react-redux'
import {Link, useNavigate} from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import {Input, Logo, Button} from './index'
import authService from '../Appwrite/Auth'
import {useForm} from 'react-hook-form'

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {register, handleSubmit}=useForm();
  const [error, setError] = useState("");
  const login = async(data)=>{
    setError("");
    try {
      const session = await authService.login(data);
      if(session){
        const userData = await authService.getCurrentUser();
        if(userData){
          dispatch(authLogin({userData}));
          navigate("/");
        }
      }
    } catch (error) {
      setError(error.message)
    }
  }
  return (
    <div className=' flex items-center w-full justify-center'>
      <div className={`mx-auto w-full max-w-lg bg-gray-200 rounded-xl p-10 border border-black/10 `}>
        <div className='mb-2 justify-center flex'>
          <span className=' inline-block w-full max-w-[100px]'>
            <Logo width='100%' />
          </span>
        </div>

        <h2 className='text-center font-bold text-2xl leading-tight'>Sign in your account</h2>
        <p className='text-center text-base text-black/60 mt-2 '>
          Don&apos;t have any account?&nbsp;
          <Link
            to='/signup'
            className='font-medium text-primary transition-all duration-200 hover:underline '
          >Sign Up</Link>
        </p>

        {error && <p className='text-red-600 text-center mt-8'>{error}</p>}

        <form onSubmit={handleSubmit(login)} className='mt-8'>
          <div className='space-y-5'>
            <Input 
              label="Email:"
              placeholder='Enter your email'
              type='email'
              {...register("email", {
                required : true,
                validate: {
                        matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                        "Email address must be a valid address",
                    }
              })}
            />
            <Input
              label = "Password:"
              placeholder='Enter your password'
              type='password'
              {...register("password", {
                required:true,
              })}

            />

            <Button
              type='submit'
              className='w-full'
            >Sign In</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
