import React from 'react'
import { useState } from 'react'
import axios from "axios";
import { validateForm } from '../utils/formValidation';
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm(email, password)
        if (Object.keys(errors).length === 0) {
            try {
                const response = await axios.post("/api/auth/register", {
                    email,
                    password,
                });
                setMessage(response.data.message);
            } catch (error) {
                console.error("Login failed:", error.response.data.error);
                setErrors(error.response.data.error);
            }
        }
        else {
            setErrors(errors);
            console.log(errors);
        }

    };
    return (
        <div className='grid cols-1'>
            <div className='flex flex-col justify-center items-center h-screen  bg-gray-100'>
                <form onSubmit={handleSubmit} className='max-w-[400px] w-full  mx-auto bg-white p-4 border-1 shadow-lg'>
                    <h2 className='text-4xl font-bold text-center my-6'>LOG IN</h2>
                    <div className='flex flex-col py-2'>
                        <label>E-mail</label>
                        <input value={email} className='border p-2' type='text' onChange={(e) => setEmail(e.target.value)}></input>
                        {errors.email && <p>{errors.email}</p>}
                    </div>
                    <div className='flex flex-col py-2'>
                        <label>Password</label>
                        <input value={password} className='border p-2' type='password' onChange={(e) => setPassword(e.target.value)}></input>
                        {errors.password && <p>{errors.password}</p>}
                    </div>
                    <button type='submit' className='border w-full my-5 p-2 bg-indigo-600  hover:bg-indigo-500 text-white'>Sign in</button>
                    <p className='flex items-center'><input className='mr-2' type='checkbox'></input>Remember me</p>
                </form>
            </div>

        </div>
    )
}