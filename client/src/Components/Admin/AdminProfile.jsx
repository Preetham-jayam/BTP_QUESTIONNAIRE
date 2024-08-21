import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Admin.module.css';
import { BASE_URL } from '../../constants';

const AdminProfile = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/users`);
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchUsers();
  }, []);

  const handleReadMore = (id) => {
    navigate(`/admin/user/${id}`);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
      </div>
    );
  }
  

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>All Users</h1>
      <div className={styles.cardContainer}>
        {users.map((user) => (
          <div key={user._id} className={styles.card}>
            <h2 className={styles.name}>{user.name}</h2>
            <p className={styles.email}>{user.email}</p>
            <p className={styles.phone}>{user.phoneNo}</p>
            <button 
              className={styles.readMoreButton} 
              onClick={() => handleReadMore(user._id)}>
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProfile;
