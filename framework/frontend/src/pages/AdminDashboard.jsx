import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
        <h1>Admin Control Panel</h1>
        <button onClick={handleLogout} style={{ color: 'white', backgroundColor: 'red', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer' }}>
          Log Out
        </button>
      </div>
      <hr />
      <h3>User Session Meta Data:</h3>
      <ul>
        <li><strong>UUID (ssid):</strong> {user.ssid}</li>
        <li><strong>Name:</strong> {user.name}</li>
        <li><strong>Email:</strong> {user.email}</li>
        <li><strong>Role Group:</strong> {user.role}</li>
      </ul>
    </div>
  );
}