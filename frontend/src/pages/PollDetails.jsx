import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import html2canvas from 'html2canvas';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell, LabelList 
} from 'recharts';
import { FacebookShareButton, TwitterShareButton, FacebookIcon, TwitterIcon } from 'react-share';

// URL Backend (Khi deploy, bạn chỉ cần sửa dòng này)
const API_URL = 'https://many-pigeon-shikimi-cc6b69b2.koyeb.app';

const PollDetails = () => {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [hasLiked, setHasLiked] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedIndex, setVotedIndex] = useState(null);

  const chartRef = useRef(null);

  useEffect(() => {
    // Khôi phục trạng thái Like từ LocalStorage
    const likedPolls = JSON.parse(localStorage.getItem('liked_polls') || '{}');
    if (likedPolls[id]) setHasLiked(true);

    // Khôi phục trạng thái Vote từ LocalStorage
    const votedPolls = JSON.parse(localStorage.getItem('voted_polls') || '{}');
    if (votedPolls[id] !== undefined) {
      setHasVoted(true);
      setVotedIndex(votedPolls[id]);
    }

    const socket = io(API_URL, { transports: ['websocket', 'polling'] });

    const fetchPoll = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/polls/${id}`);
        setPoll(res.data);
        setError(null);
      } catch (err) {
        console.error("Lỗi:", err);
        if (err.response && err.response.status === 404) setError("Không tìm thấy Poll này.");
        else setError("Lỗi kết nối Server.");
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();

    socket.on('update-poll', (updatedPoll) => {
      if (updatedPoll._id === id) setPoll(updatedPoll);
    });

    return () => socket.disconnect();
  }, [id]);

  const handleVote = async (index) => {
    if (hasVoted) return alert("Bạn đã bỏ phiếu rồi!");
    try {
      await axios.post(`${API_URL}/api/polls/${id}/vote`, { optionIndex: index });
      setHasVoted(true);
      setVotedIndex(index);
      const votedPolls = JSON.parse(localStorage.getItem('voted_polls') || '{}');
      votedPolls[id] = index;
      localStorage.setItem('voted_polls', JSON.stringify(votedPolls));
      alert("Cảm ơn bạn đã bỏ phiếu!");
    } catch (error) {
      alert("Lỗi khi bỏ phiếu.");
    }
  };

  const handleLikeToggle = async () => {
    try {
      if (hasLiked) {
        await axios.post(`${API_URL}/api/polls/${id}/unlike`);
        setHasLiked(false);
        const likedPolls = JSON.parse(localStorage.getItem('liked_polls') || '{}');
        delete likedPolls[id];
        localStorage.setItem('liked_polls', JSON.stringify(likedPolls));
      } else {
        await axios.post(`${API_URL}/api/polls/${id}/like`);
        setHasLiked(true);
        const likedPolls = JSON.parse(localStorage.getItem('liked_polls') || '{}');
        likedPolls[id] = true;
        localStorage.setItem('liked_polls', JSON.stringify(likedPolls));
      }
    } catch (error) {
      alert("Không thể thực hiện thao tác.");
    }
  };

  const handleDownload = async () => {
    if (chartRef.current) {
      try {
        const canvas = await html2canvas(chartRef.current);
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `ket-qua-${id}.png`;
        link.click();
      } catch (error) {
        alert("Lỗi tải ảnh.");
      }
    }
  };

  // --- STYLES ---
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    padding: '30px',
    width: '100%',
    maxWidth: '900px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

  if (loading) return <div style={containerStyle}><h2 style={{marginTop: '20vh', color: '#555'}}>⏳ Đang tải dữ liệu...</h2></div>;
  if (error) return <div style={containerStyle}><h2 style={{marginTop: '20vh', color: '#ef4444'}}>{error}</h2><Link to="/">Quay về trang chủ</Link></div>;
  if (!poll) return null;

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  const chartData = poll.options.map(opt => ({ name: opt.text, votes: opt.votes }));
  const shareUrl = window.location.href;

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* HEADER: QUESTION + STATS */}
        <h1 style={{ 
          textAlign: 'center', color: '#111827', fontSize: '1.8rem', fontWeight: '700',
          marginBottom: '20px', lineHeight: '1.4'
        }}>
          {poll.question}
        </h1>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px',
          background: '#F3F4F6', padding: '10px 30px', borderRadius: '50px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <span style={{ fontSize: '1.2rem' }}>🗳️</span>
             <span style={{ fontWeight: '600', color: '#374151' }}>{totalVotes} Votes</span>
          </div>
          <div style={{ width: '1px', height: '20px', background: '#D1D5DB' }}></div>
          <button 
            onClick={handleLikeToggle}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1rem',
              color: hasLiked ? '#EF4444' : '#6B7280', fontWeight: 'bold', transition: '0.2s'
            }}
          >
            <span style={{ fontSize: '1.4rem' }}>{hasLiked ? '❤️' : '🤍'}</span>
            {poll.likes || 0}
          </button>
        </div>

        {/* CHART SECTION */}
        <div ref={chartRef} style={{ width: '100%', height: 400, marginBottom: '20px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#9CA3AF" tick={{fill: '#4B5563'}} />
              <YAxis allowDecimals={false} stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                cursor={{fill: '#F3F4F6'}}
              />
              <Legend verticalAlign="top" height={36}/>
              <Bar dataKey="votes" name="Số phiếu" fill="#6366F1" radius={[6, 6, 0, 0]}>
                <LabelList dataKey="votes" position="top" fill="#374151" fontWeight="bold" />
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <button 
          onClick={handleDownload}
          style={{
            background: '#E5E7EB', color: '#374151', border: 'none', padding: '10px 20px',
            borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem',
            marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s'
          }}
          onMouseOver={(e) => e.target.style.background = '#D1D5DB'}
          onMouseOut={(e) => e.target.style.background = '#E5E7EB'}
        >
          📸 Tải ảnh báo cáo
        </button>

        {/* VOTING SECTION */}
        <div style={{ width: '100%', padding: '30px 0', borderTop: '1px dashed #E5E7EB', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ color: '#4B5563', marginBottom: '20px', fontWeight: '600' }}>
            {hasVoted ? "✅ Lựa chọn của bạn:" : "👇 Mời bạn bỏ phiếu:"}
          </h3>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center' }}>
            {poll.options.map((opt, index) => {
              const isSelected = hasVoted && votedIndex === index;
              const isDisabled = hasVoted;
              
              return (
                <button
                  key={index}
                  onClick={() => handleVote(index)}
                  disabled={isDisabled}
                  style={{
                    padding: '12px 25px',
                    borderRadius: '12px',
                    // Đã xóa dòng border: 'none' ở đây để tránh trùng lặp
                    background: isSelected ? '#4F46E5' : (isDisabled ? '#F3F4F6' : '#ffffff'),
                    color: isSelected ? 'white' : (isDisabled ? '#9CA3AF' : '#1F2937'),
                    boxShadow: isSelected ? '0 5px 15px rgba(79, 70, 229, 0.4)' : (isDisabled ? 'none' : '0 2px 5px rgba(0,0,0,0.05)'),
                    border: isSelected ? '2px solid #4F46E5' : (isDisabled ? '2px solid #F3F4F6' : '2px solid #E5E7EB'),
                    cursor: isDisabled ? 'default' : 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)'
                  }}
                  onMouseOver={(e) => !isDisabled && (e.target.style.borderColor = '#4F46E5')}
                  onMouseOut={(e) => !isDisabled && (e.target.style.borderColor = '#E5E7EB')}
                >
                  {opt.text}
                </button>
              )
            })}
          </div>
        </div>

        {/* SHARE SECTION */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '20px', opacity: 0.8 }}>
          <FacebookShareButton url={shareUrl} quote={poll.question}>
            <FacebookIcon size={36} round />
          </FacebookShareButton>
          <TwitterShareButton url={shareUrl} title={poll.question}>
            <TwitterIcon size={36} round />
          </TwitterShareButton>
        </div>
        
      </div>
      <div style={{marginTop: '20px'}}>
        <Link to="/" style={{textDecoration: 'none', color: '#6B7280', fontSize: '0.9rem'}}>← Quay lại trang chủ</Link>
      </div>
    </div>
  );
};

export default PollDetails;