import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import axios from 'axios';

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();
  const PORT = "https://loan-project-onup.onrender.com"; // added http://localhost

  useEffect(() => {
     getFunction();
  }, []);

  const getFunction = async () => {
      await axios.get(`${PORT}/api/users`)
      .then(res => {
        const userData = Array.isArray(res.data) ? res.data : res.data.users;
        setUsers(userData);
        setFiltered(userData);
      })
      .catch(err => console.error('Fetch error:', err));
  }

  const handleFilter = (type) => {
    setFilterType(type);
    if (!Array.isArray(users)) return;

    if (type === 'paid') {
      setFiltered(users.filter(user => user.paidThisMonth === 'Yes'));
    } else if (type === 'unpaid') {
      setFiltered(users.filter(user => user.paidThisMonth === 'No'));
    } else if (type === 'all' || type === '') {
      setFiltered(users);
    } else {
      setFiltered(users.filter(user => user.name.toLowerCase().includes(type.toLowerCase())));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure to delete?')) return;
    await axios.delete(`${PORT}/api/users/${id}`);
    setUsers(prev => prev.filter(user => user._id !== id));
    setFiltered(prev => prev.filter(user => user._id !== id));
  };

  const refreshUsers = () => {
    axios.get(`${PORT}/api/users`)
      .then(res => {
        const userData = Array.isArray(res.data) ? res.data : res.data.users;
        setUsers(userData);
        setFiltered(userData);
      })
      .catch(err => console.error('Fetch error:', err));
  };

  const handlePaid = async (id) => {
    const user = users.find(user => user._id === id);
    if (user.paidThisMonth === 'Yes') {
      alert('Already paid this month');
      return;
    }
    if (!window.confirm('Are you sure to mark as paid?')) return;
    await axios.put(`${PORT}/users/paid/${id}`, { paidThisMonth: 'Yes' });
    refreshUsers();
  };

  const handleUnpaid = async (id) => {
    const user = users.find(user => user._id === id);
    if (user.paidThisMonth === 'No') {
      alert('Already unpaid this month');
      return;
    }
    if (!window.confirm('Are you sure to mark as unpaid?')) return;
    await axios.put(`${PORT}/users/unpaid/${id}`, { paidThisMonth: 'No' });
    refreshUsers();
  };

  return (
    <div className="dashboard">
      <div className="top-bar">
        <h2>Loan Dashboard</h2>
        <button onClick={() => {
          localStorage.removeItem('isAdmin');
          navigate('/');
        }}>Logout</button>
      </div>

      <div className="stats">
        <div className="stat" onClick={() => handleFilter('all')}>
          <h3>Total Users</h3>
          <p>{users.length}</p>
        </div>
        <div className="stat paid" onClick={() => handleFilter('paid')}>
          <h3>Paid</h3>
          <p>{users.filter(user => user.paidThisMonth === 'Yes').length}</p>
        </div>
        <div className="stat unpaid" onClick={() => handleFilter('unpaid')}>
          <h3>Unpaid</h3>
          <p>{users.filter(user => user.paidThisMonth === 'No').length}</p>
        </div>
        <button className="add-btn" onClick={() => navigate('/add')}>
          + Add User
        </button>
      </div>

      <div className="search">
        <h3>Search Here</h3>
        <input
          type="search"
          onChange={(e) => handleFilter(e.target.value)}
          placeholder="Enter user name"
        />
      </div>

      <div className="user-list">
        {filtered.map(user => (
          <div className="user-card" key={user._id}>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Loan Amount:</strong> {user.totalAmount.toFixed(2)}</p>
            <p><strong>Interest:</strong> {user.interest.toFixed(2)}%</p>
            <p><strong>Duration:</strong> {user.duration} years</p>
            <p><strong>Total Amount with Interest:</strong> {user.totalAmountInterest.toFixed(2)}</p>
            <p><strong>Paid Amount:</strong> {user.paidNow.toFixed(2)}</p>
            <p><strong>Should Have Paid:</strong> {user.willPayNow.toFixed(2)}</p>
            <p><strong>Monthly Payment:</strong> {user.monthlyPayment.toFixed(2)}</p>
            <p><strong>Loan Start:</strong> {user.loanStart.slice(0, 10)}</p>
            <p><strong>Loan End:</strong> {user.loanEnd.slice(0, 10)}</p>
            <p><strong>Paid This Month:</strong> {user.paidThisMonth}</p>

            <div className="btns">
              <button className="edit" onClick={() => navigate(`/edit/${user._id}`)}>Edit</button>
              <button className="delete" onClick={() => handleDelete(user._id)}>Delete</button>
              {
                user.paidThisMonth === "No" ?
                  <button className="reset-paid" onClick={() => handlePaid(user._id)}>Paid</button> :
                  <button className="reset-unpaid" onClick={() => handleUnpaid(user._id)}>Unpaid</button>
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;