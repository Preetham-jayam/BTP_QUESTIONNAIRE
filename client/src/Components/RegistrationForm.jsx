import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
const RegistrationForm = () => {
    const navigate=useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNo: '',
        age: '',
        address: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await axios.post('http://localhost:5003/register', formData);
                toast.success("Registered Successfully");
                console.log(response.data); 
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    phoneNo: '',
                    age: '',
                    address: ''
                });
                navigate('/');
            } catch (error) {
                toast.error(error?.data?.message || error.error);
                console.error('Registration failed', error);
            }
        }
    };

    const validateForm = () => {
        let valid = true;
        let errorsObj = {};
        
        if (!formData.name.trim()) {
            errorsObj.name = 'Name is required';
            valid = false;
        }

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
        } else if (formData.password.trim().length < 6) {
            errorsObj.password = 'Password must be at least 6 characters long';
            valid = false;
        }

        if (!formData.phoneNo.trim()) {
            errorsObj.phoneNo = 'Phone number is required';
            valid = false;
        }

        if (!formData.age.trim()) {
            errorsObj.age = 'Age is required';
            valid = false;
        } else if (isNaN(formData.age.trim())) {
            errorsObj.age = 'Age must be a number';
            valid = false;
        }

        if (!formData.address.trim()) {
            errorsObj.address = 'Address is required';
            valid = false;
        }

        setErrors(errorsObj);
        return valid;
    };

    return (
        <div className="registration-form">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                />
                {errors.name && <p className="error">{errors.name}</p>}
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    autoComplete='new-password'
                    required
                />
                {errors.email && <p className="error">{errors.email}</p>}
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    autoComplete='new-password'
                    required
                />
                {errors.password && <p className="error">{errors.password}</p>}
                <input
                    type="text"
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    required
                />
                {errors.phoneNo && <p className="error">{errors.phoneNo}</p>}
                <input
                    type="text"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Age"
                    required
                />
                {errors.age && <p className="error">{errors.age}</p>}
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Address"
                    required
                />
                {errors.address && <p className="error">{errors.address}</p>}
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegistrationForm;
