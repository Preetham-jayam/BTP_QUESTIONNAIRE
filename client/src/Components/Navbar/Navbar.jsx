import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../AuthSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate=useNavigate();
    const { user, token } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('btp_token');
        localStorage.removeItem('btp_userId');
        navigate('/');
    };

    const isAdmin=user.user.isAdmin ? true:false;

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/" className="nav-link">BTP S2024 AB02</Link>
            </div>

            {isAdmin ? <>
                <ul className="navbar-nav">
                <li className="nav-item">
                    <Link to="/" className="nav-link">Home</Link>
                </li>
                {!token && (
                    <>
                        <li className="nav-item">
                            <Link to="/login" className="nav-link">Login</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/register" className="nav-link">Register</Link>
                        </li>
                    </>
                )}
                {token && (
                    <>
                        <li className="nav-item">
                            <span className="nav-link"><Link to='/admin' className="nav-link">Welcome {user.user.name}</Link></span>
                        </li>
                        <li className="nav-item">
                            <button className="logout" onClick={handleLogout}>Logout</button>
                        </li>
                    </>
                )}
            </ul>
            </>:<>
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link to="/admin" className="nav-link">Home</Link>
                </li>
                {token && (
                    <>
                        <li className="nav-item">
                            <span className="nav-link"><Link to='/profile' className="nav-link">Welcome {user.user.name}</Link></span>
                        </li>
                        <li className="nav-item">
                                 <Link to="/phq9questionnaire" className="nav-link">PHQ9</Link>
                        </li>
                        <li className="nav-item">
                                 <Link to="/bdiquestionnaire" className="nav-link">BDI</Link>
                        </li>
                        <li className="nav-item">
                                 <Link to="/hadsquestionnaire" className="nav-link">HADS</Link>
                        </li>
                        <li className="nav-item">
                            <button className="logout" onClick={handleLogout}>Logout</button>
                        </li>
                    </>
                )}
            </ul>
            </>}

            
        </nav>
    );
};

export default Navbar;
