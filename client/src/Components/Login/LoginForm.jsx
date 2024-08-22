import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css'; 
import { useNavigate } from 'react-router-dom';
import { ReactComponent as UserIcon } from './brain-solid.svg'; 
import { useDispatch } from 'react-redux';
import { login } from '../../AuthSlice';
import { BASE_URL } from '../../constants';
const LoginForm = () => {
    const navigate=useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await axios.post(`${BASE_URL}/login`, formData);
                const { userId, email, token,user } = response.data;
                console.log(response.data); 
                localStorage.setItem('btp_token', response.data.token);
                localStorage.setItem('btp_userId', response.data.userId);
                localStorage.setItem('btp_user', JSON.stringify(response.data));
                dispatch(login({ user: { userId, email,user }, token }));
                setFormData({
                    email: '',
                    password: ''
                });
                if(user.isAdmin) navigate('/admin');
                else navigate('/');
            } catch (error) {
                console.error('Login failed', error);
                if (error.response && error.response.data) {
                    setErrors({ message: error.response.data.message });
                } else {
                    setErrors({ message: 'Login failed. Please try again.' });
                }
            }finally {
                setLoading(false); 
            }
        }
    };

    const validateForm = () => {
        let valid = true;
        let errorsObj = {};

        if (!formData.email.trim()) {
            errorsObj.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errorsObj.email = 'Email is invalid';
            valid = false;
        }

        if (!formData.password.trim()) {
            errorsObj.password = 'Password is required';
            valid = false;
        }

        setErrors(errorsObj);
        return valid;
    };

    return (
        <div className="login-form">
            <h1>Login</h1>
            <UserIcon className="user-icon" />
            <form onSubmit={handleSubmit} autoComplete='off'>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    autoComplete='new-password'
                />
                {errors.email && <p className="error">{errors.email}</p>}
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    autoComplete='new-password'
                />
                {errors.password && <p className="error">{errors.password}</p>}
                {errors.message && <p className="error">{errors.message}</p>}
                <button type="submit">{loading?"Logging In":"Login"}</button>
            </form>
        </div>
    );
};

export default LoginForm;
