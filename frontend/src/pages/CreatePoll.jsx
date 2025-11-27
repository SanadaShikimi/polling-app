import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePoll = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']); // Mặc định 2 lựa chọn
  const navigate = useNavigate();

  // Xử lý thay đổi nội dung option
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // Thêm ô nhập option mới
  const addOption = () => setOptions([...options, '']);

  // Gửi dữ liệu lên Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Lọc bỏ các option rỗng
    const validOptions = options.filter(opt => opt.trim() !== '');
    
    if (!question || validOptions.length < 2) {
      alert("Cần có câu hỏi và ít nhất 2 lựa chọn!");
      return;
    }

    try {
      // Gọi API tạo poll (Lưu ý: Port 5000 là của Backend)
      await axios.post('http://localhost:5000/api/polls', {
        question,
        options: validOptions
      });
      navigate('/'); // Tạo xong quay về trang chủ
    } catch (error) {
      console.error(error);
      alert("Lỗi khi tạo poll");
    }
  };

  return (
    <div className="card">
      <h2>Tạo cuộc thăm dò mới</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Câu hỏi:</label>
          <input 
            type="text" 
            value={question} 
            onChange={(e) => setQuestion(e.target.value)} 
            placeholder="Ví dụ: Bạn thích ngôn ngữ nào?"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <label>Các lựa chọn:</label>
        {options.map((opt, index) => (
          <input
            key={index}
            type="text"
            value={opt}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            placeholder={`Lựa chọn ${index + 1}`}
            style={{ display: 'block', width: '100%', padding: '8px', margin: '5px 0' }}
          />
        ))}

        <button type="button" onClick={addOption} style={{ marginTop: '10px', marginRight: '10px' }}>
          + Thêm lựa chọn
        </button>

        <button type="submit" style={{ background: 'blue', color: 'white', border: 'none', padding: '10px 20px' }}>
          Tạo Poll
        </button>
      </form>
    </div>
  );
};

export default CreatePoll;