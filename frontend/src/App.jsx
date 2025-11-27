import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import CreatePoll from './pages/CreatePoll';
import PollDetails from './pages/PollDetails';

// Thanh menu điều hướng (Navbar)
const Navbar = () => (
  <nav style={{ 
    padding: '1rem 2rem', 
    background: '#ffffff', 
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    marginBottom: '0',
    position: 'sticky', // Giữ menu luôn ở trên cùng khi cuộn
    top: 0,
    zIndex: 100
  }}>
    <Link to="/" style={{ 
      textDecoration: 'none', color: '#374151', fontWeight: 'bold', fontSize: '1.1rem',
      display: 'flex', alignItems: 'center', gap: '5px'
    }}>
      🏠 Trang chủ
    </Link>
    <Link to="/create" style={{ 
      textDecoration: 'none', color: '#2563EB', fontWeight: 'bold', fontSize: '1.1rem',
      display: 'flex', alignItems: 'center', gap: '5px' 
    }}>
      ➕ Tạo Poll Mới
    </Link>
  </nav>
);

function App() {
  return (
    <Router>
      <div className="app-container" style={{ width: '100%', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
        <Navbar />
        <Routes>
          {/* Trang chủ: Giới hạn chiều rộng cho đẹp */}
          <Route path="/" element={
            <div style={{ maxWidth: '800px', margin: '20px auto', padding: '0 20px' }}><Home /></div>
          } />
          
          {/* Trang tạo mới: Giới hạn chiều rộng */}
          <Route path="/create" element={
            <div style={{ maxWidth: '800px', margin: '20px auto', padding: '0 20px' }}><CreatePoll /></div>
          } />
          
          {/* Trang chi tiết: Để full chiều rộng để hiển thị biểu đồ tốt hơn */}
          <Route path="/polls/:id" element={<PollDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;