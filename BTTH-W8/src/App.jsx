import React, { useState, useEffect } from 'react'
import './App.css'

// Component tìm kiếm
function SearchForm({ onChangeValue }) {
  return (
    <input
      type="text"
      placeholder="Tìm theo name, username"
      onChange={(e) => onChangeValue(e.target.value)}
    />
  );
}


// Component thêm người dùng
function AddUser({ onAdd }) {
  const [adding, setAdding] = React.useState(false);
  const [user, setUser] = React.useState({
    name: '', username: '', email: '',
    address: { street: '', suite: '', city: ''},
    phone: '', website: ''
  });
  const handleChange = (e) => {
    const { id, value } = e.target;
    if (['street', 'suite', 'city'].includes(id)) {
      setUser({
        ...user, address: { ...user.address, [id]: value }
      });
    } else {
      setUser({ ...user, [id]: value });
    }
  };

  const handleAdd = () => {
    if (user.name === '' || user.username === '') {
      alert('Vui lòng nhập Name và Username');
      return;
    }
    onAdd(user);
    setUser({
      name: '', username: '', email: '',
      address: { street: '', suite: '', city: ''},
      phone: '', website: ''
    });
    setAdding(false);
  }

  if (!adding) {
    return <button onClick={() => setAdding(true)}>Thêm</button>;
  }

  return (
    <div>
      <h4>Thêm người dùng</h4>
      <div><label>Name: <input id="name" type="text" value={user.name} onChange={handleChange} /></label></div>
      <div><label>Username: <input id="username" type="text" value={user.username} onChange={handleChange} /></label></div>
      <div><label>Email: <input id="email" type="text" value={user.email} onChange={handleChange} /></label></div>
      <div><label>Street: <input id="street" type="text" value={user.address.street} onChange={handleChange} /></label></div>
      <div><label>Suite: <input id="suite" type="text" value={user.address.suite} onChange={handleChange} /></label></div>
      <div><label>City: <input id="city" type="text" value={user.address.city} onChange={handleChange} /></label></div>
      <div><label>Phone: <input id="phone" type="text" value={user.phone} onChange={handleChange} /></label></div>
      <div><label>Website: <input id="website" type="text" value={user.website} onChange={handleChange} /></label></div>

      <button onClick={handleAdd}>Lưu</button>
      <button onClick={() => setAdding(false)}>Hủy</button>
    </div>
  );
}


// Component bảng kết quả
function ResultTable({ keyword, user, onAdded }) {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [editing, setEditing] = React.useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (user) {
      setUsers((prev) => [...prev, { ...user, id: prev.length + 1 }]);
      onAdded();
    }
  }, [user]);

  function editUser(user) {
    setEditing({ ...user, address: { ...user.address } });
  }

  const handleEditChange = (e) => {
    const { id, value } = e.target;
    if (['street', 'suite', 'city'].includes(id)) {
      setEditing({
        ...editing, address: { ...editing.address, [id]: value }
      });
    } else {
      setEditing({ ...editing, [id]: value });
    }
  };

  function saveUser() {
    setUsers((prev) =>
      prev.map((u) => (u.id === editing.id ? editing : u))
    );
    setEditing(null);
  }

  function removeUser(id) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(keyword.toLowerCase()) ||
      u.username.toLowerCase().includes(keyword.toLowerCase())
  );

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div>
      {editing && (
        <div>
          <h4>Sửa người dùng: {editing.name}</h4>
          <div><label>Name: <input id="name" type="text" value={editing.name} onChange={handleEditChange} /></label></div>
          <div><label>Username: <input id="username" type="text" value={editing.username} onChange={handleEditChange} /></label></div>
          <div><label>Email: <input id="email" type="text" value={editing.email} onChange={handleEditChange} /></label></div>
          <div><label>Street: <input id="street" type="text" value={editing.address.street} onChange={handleEditChange} /></label></div>
          <div><label>Suite: <input id="suite" type="text" value={editing.address.suite} onChange={handleEditChange} /></label></div>
          <div><label>City: <input id="city" type="text" value={editing.address.city} onChange={handleEditChange} /></label></div>
          <div><label>Phone: <input id="phone" type="text" value={editing.phone} onChange={handleEditChange} /></label></div>
          <div><label>Website: <input id="website" type="text" value={editing.website} onChange={handleEditChange} /></label></div>

          <button onClick={saveUser}>Lưu thay đổi</button>
          <button onClick={() => setEditing(null)}>Hủy</button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Street</th>
            <th>Suite</th>
            <th>City</th>
            <th>Phone</th>
            <th>Website</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.address.street}</td>
              <td>{u.address.suite}</td>
              <td>{u.address.city}</td>
              <td>{u.phone}</td>
              <td>{u.website}</td>
              <td>
                <button onClick={() => editUser(u)}>Sửa</button>
                <button onClick={() => removeUser(u.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


// Main App component
function App() {
  const [kw, setKeyword] = React.useState('');
  const [newUsers, setNewUsers] = React.useState(null);

  return (
    <div>
      <h1>Quản lý người dùng</h1>
      <SearchForm onChangeValue={setKeyword} />
      <AddUser onAdd={setNewUsers} />
      <ResultTable
        keyword={kw}
        user={newUsers}
        onAdded={() => setNewUsers(null)}
      />
    </div>
  );
}

export default App