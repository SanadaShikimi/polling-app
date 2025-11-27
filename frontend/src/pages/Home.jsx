import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    // Dùng 127.0.0.1 để ổn định hơn localhost trên Windows
    axios.get('http://127.0.0.1:5000/api/polls')
      .then(res => setPolls(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#1f2937' }}>📋 Danh sách bình chọn</h1>
      
      {polls.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666' }}>Chưa có cuộc bình chọn nào. Hãy tạo mới nhé!</p>
      )}

      <div style={{ display: 'grid', gap: '20px' }}>
        {polls.map(poll => (
          <div key={poll._id} style={{ 
            background: 'white', padding: '20px', borderRadius: '10px', 
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, color: '#374151', fontSize: '1.2rem' }}>{poll.question}</h3>
            
            {/* LƯU Ý: Phải dùng poll._id ở đây */}
            <Link to={`/polls/${poll._id}`} style={{ textDecoration: 'none' }}>
              <button style={{
                background: '#2563EB', color: 'white', border: 'none', 
                padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
              }}>
                Tham gia 👉
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;