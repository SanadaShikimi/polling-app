const Poll = require('../models/Poll');

// 1. Lấy tất cả Polls
exports.getPolls = async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Tạo Poll mới
exports.createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;
    if (!question || question.trim() === '') {
      return res.status(400).json({ message: "Vui lòng nhập câu hỏi." });
    }
    if (!options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: "Cần ít nhất 2 lựa chọn." });
    }
    const formattedOptions = options.map(opt => {
        return typeof opt === 'string' ? { text: opt, votes: 0 } : opt;
    });

    const newPoll = new Poll({ question, options: formattedOptions });
    await newPoll.save();
    
    if (req.io) req.io.emit('new-poll', newPoll);
    res.status(201).json(newPoll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 3. Lấy chi tiết Poll
exports.getPollById = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: 'Không tìm thấy Poll' });
    res.json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Vote
exports.votePoll = async (req, res) => {
  const { id } = req.params; 
  const { optionIndex } = req.body; 
  try {
    const poll = await Poll.findById(id);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });
    if (optionIndex < 0 || optionIndex >= poll.options.length) {
        return res.status(400).json({ message: 'Lựa chọn không hợp lệ' });
    }
    poll.options[optionIndex].votes += 1;
    await poll.save();
    if (req.io) req.io.emit('update-poll', poll);
    res.json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Xóa Poll
exports.deletePoll = async (req, res) => {
  try {
    await Poll.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Like (Tăng tim)
exports.likePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });
    poll.likes = (poll.likes || 0) + 1;
    await poll.save();
    if (req.io) req.io.emit('update-poll', poll);
    res.json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 7. Unlike (Giảm tim) --> MỚI THÊM
exports.unlikePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });
    
    // Giảm 1, nhưng không cho nhỏ hơn 0
    poll.likes = Math.max(0, (poll.likes || 0) - 1);
    
    await poll.save();
    if (req.io) req.io.emit('update-poll', poll);
    res.json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};