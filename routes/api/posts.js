const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const mid = require('../../middleware/mid');
const User = require('../../config/models/User');
const Profile = require('../../config/models/Profile');
const Post = require('../../config/models/Post');
router.post(
  '/',
  [mid, [body('text', 'text is require').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select('-password');
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);
// get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});
// get post by id
router.get('/:id', async (req, res) => {
  try {
    // params allow to get through the url
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(400).json({ msg: ' post not found' });
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectID') {
      return res.status(400).json({ msg: 'post not found' });
    }
    res.status(500).send('Server Error');
  }
});
router.delete('/:id', mid, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await post.remove();
    res.json({ msg: 'post removed' });
  } catch (err) {
    console.log(err.message);
    res.status(400).send('Server Error');
  }
});

router.put('/like/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }
    post.likes.unshift({
      user: req.user.id,
    });
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
router.put('/unlike/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Post has not being liked' });
    }
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
router.post(
  '/comment/:id',
  [mid, [body('text', 'text is require').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await new Post.findById(req.params.id);
      const newComment = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);
router.delete('/comment/:id/:comment_id', mid, async (req, res) => {
  try {
    const post = await new Post.findById(req.params.id);
    // pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    //  make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'comment dost not found' });
    }
    if (comment.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'user not authorized' });
    }
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);
    await post.save();
    res.json(post.comments);
  } catch (error) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
module.exports = router;
