import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// ⚠️ THAY DÒNG DƯỚI BẰNG LINK BACKEND CỦA BẠN (Koyeb/Render)
// Ví dụ: const API_URL = 'https://my-polling-backend.koyeb.app';
const API_URL = 'https://my-polling-backend.onrender.com'; 

const CreatePoll = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']); 
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading
  const navigate = useNavigate();

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, '']);

  const removeOption = (index) => {
    if (options.length <= 2) return;
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validOptions = options.filter(opt => opt.trim() !== '');
    
    if (!question || validOptions.length < 2) {
      alert("Cần có câu hỏi và ít nhất 2 lựa chọn!");
      return;
    }

    try {
      setLoading(true); // Bật loading
      // Gọi API tạo poll
      await axios.post(`${API_URL}/api/polls`, {
        question,
        options: validOptions
      });
      navigate('/'); 
    } catch (error) {
      console.error(error);
      alert("Lỗi khi tạo poll. Hãy kiểm tra xem Backend đã chạy chưa.");
    } finally {
      setLoading(false); // Tắt loading
    }
  };

  // --- STYLES ---
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    padding: '40px 20px',
    display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
    fontFamily: "'Segoe UI', sans-serif"
  };

  const cardStyle = {
    background: 'white', borderRadius: '20px', padding: '30px',
    width: '100%', maxWidth: '600px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
  };

  const inputStyle = {
    width: '100%', padding: '12px 15px', borderRadius: '8px',
    border: '1px solid #ddd', fontSize: '1rem', marginTop: '5px', marginBottom: '15px'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: 'center', color: '#111827', marginBottom: '20px' }}>🚀 Tạo cuộc thăm dò mới</h2>
        <form onSubmit={handleSubmit}>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ fontWeight: '600', color: '#374151' }}>Câu hỏi chủ đề:</label>
            <input 
              type="text" 
              value={question} 
              onChange={(e) => setQuestion(e.target.value)} 
              placeholder="Ví dụ: Cuối tuần này đi đâu chơi?"
              style={inputStyle}
            />
          </div>

          <label style={{ fontWeight: '600', color: '#374151' }}>Các lựa chọn:</label>
          {options.map((opt, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Lựa chọn ${index + 1}`}
                style={inputStyle}
              />
              {options.length > 2 && (
                <button 
                  type="button" 
                  onClick={() => removeOption(index)}
                  style={{ background: '#EF4444', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', marginBottom: '10px' }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button 
                type="button" onClick={addOption} 
                style={{ flex: 1, padding: '10px', background: '#F3F4F6', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#374151' }}
            >
              + Thêm lựa chọn
            </button>
            <button 
                type="submit" 
                disabled={loading}
                style={{ flex: 2, padding: '10px', background: loading ? '#9CA3AF' : '#2563EB', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
            >
              {loading ? 'Đang tạo...' : '✅ Hoàn tất & Đăng'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreatePoll;