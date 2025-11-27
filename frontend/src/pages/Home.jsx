import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// ⚠️ CẤU HÌNH API URL
// - Nếu chạy trên máy tính: Dùng http://127.0.0.1:5000
// - Nếu đã deploy lên mạng: Dùng https://ten-app-cua-ban.koyeb.app (hoặc Render)
// const API_URL = 'http://127.0.0.1:5000'; 
const API_URL = 'https://many-pigeon-shikimi-cc6b69b2.koyeb.app'; // <-- Thay link thật của bạn vào đây

const Home = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gọi API lấy danh sách poll
    axios.get(`${API_URL}/api/polls`)
      .then(res => setPolls(res.data))
      .catch(err => console.error("Lỗi tải danh sách:", err))
      .finally(() => setLoading(false));
  }, []);

  // Style cho Container chính
  const containerStyle = {
    padding: '40px 20px', 
    fontFamily: "'Segoe UI', sans-serif",
    maxWidth: '800px',
    margin: '0 auto'
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px', color: '#1f2937', fontSize: '2rem' }}>
        📋 Danh sách bình chọn đang mở
      </h1>
      
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>
            <h2>⏳ Đang tải danh sách...</h2>
        </div>
      ) : polls.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px', background: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <p style={{ color: '#666', fontSize: '1.2rem', marginBottom: '20px' }}>Hiện chưa có cuộc bình chọn nào.</p>
            <Link to="/create">
                <button style={{ 
                    padding: '12px 25px', 
                    background: '#2563EB', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    transition: 'background 0.2s'
                }}>
                    🚀 Tạo cái đầu tiên ngay!
                </button>
            </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {polls.map(poll => (
            <div key={poll._id} style={{ 
              background: 'white', 
              padding: '25px', 
              borderRadius: '15px', 
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)', 
              border: '1px solid #e5e7eb',
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
            }}
            >
              <div style={{ flex: 1, paddingRight: '20px' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#111827', fontSize: '1.25rem' }}>
                    {poll.question}
                  </h3>
                  <div style={{ display: 'flex', gap: '15px', fontSize: '0.9rem', color: '#6B7280' }}>
                    <span>🗳️ {poll.options.length} lựa chọn</span>
                    <span>❤️ {poll.likes || 0} yêu thích</span>
                  </div>
              </div>
              
              <Link to={`/polls/${poll._id}`} style={{ textDecoration: 'none' }}>
                <button style={{
                  background: '#2563EB', 
                  color: 'white', 
                  border: 'none', 
                  padding: '10px 24px', 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  fontWeight: '600',
                  whiteSpace: 'nowrap'
                }}>
                  Tham gia 👉
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;