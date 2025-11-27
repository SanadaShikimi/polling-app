const express = require('express');
const router = express.Router();
const { 
    getPolls, createPoll, votePoll, deletePoll, getPollById, likePoll, unlikePoll 
} = require('../controllers/pollController');

router.get('/', getPolls);
router.post('/', createPoll);
router.get('/:id', getPollById);
router.post('/:id/vote', votePoll);
router.delete('/:id', deletePoll);
router.post('/:id/like', likePoll);
router.post('/:id/unlike', unlikePoll); // <--- MỚI THÊM

module.exports = router;