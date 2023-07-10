const express = require('express');
const router = express.Router();
const User = require('../../config/models/User');
const Profile = require('../../config/models/Profile');
const Post = require('../../config/models/Post');
const mid = require('../../middleware/mid');
const { body, validationResult } = require('express-validator');
const request = require('request');
//  Route   Get profile/me
//  Desc    Get current user profile
//  Access  Public
// route to create our profile
// we get id by the token by id so add the middleware for verification
router.get('/me', mid, async (req, res) => {
  try {
    // create a variable and call the model of profile access through req.user and user pretends to the model user which which is the object id of the user
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );
    if (!profile) {
      return res.status(400).json({ msg: 'No Profile For This User' });
    }
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});
//  Route  Post profile/me
//  Desc  create or update profile
//  Access  Private

router.post(
  '/',
  [
    mid,
    [
      body('status', 'Status is Required').not().isEmpty(),
      body('skills', 'Skills is Required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    // ono by one add each field
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    // we use split which string into a array
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      // create profile
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('server error');
    }
  }
);

//  Route  Post profile/me
//  get all profiles
//  Access  public
// routes to get all profiles

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    return res.json(profiles);
  } catch (err) {
    console.log(err.message);
    res.status(400).send('Server Error');
  }
});

router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) return res.status(400).json({ msg: ' profile not found' });
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    if (err.kind == 'ObjectID') {
      return res.status(400).json({ msg: ' profile not found' });
    }
    res.status(500).send('Server Error');
  }
});
//  Route  DELETE profile/me
//  DELETE all profiles/POSTS/USER
//  Access  public
router.delete('/', mid, async (req, res) => {
  try {
    // remove post
    await Post.deleteMany({ user: req.user.id });
    // remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.log(err.message);
    res.status(400).send('Server Error');
  }
});
//  Route  put api/profile/experience
// add all profiles experience
//  Access  private
router.put(
  '/experience',
  [
    mid,
    [
      body('title', 'Title is required').not().isEmpty(),
      body('company', 'Company is required').not().isEmpty(),
      body('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, company, location, from, to, current, description } =
      req.body;
    const newExp = { title, company, location, from, to, current, description };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);
//  Route  delete api/profile/experience
// delete all profiles experience
//  Access  private
router.delete('/experience/:exp_id', mid, async (req, res) => {
  try {
    const profile = await Profile.findOneAndRemove({ user: req.user.id });
    //  Get remove Index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexof(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(400).send('Server Error');
  }
});
//  Route  put api/profile/education
// add all profiles education
//  Access  private
router.put(
  '/education',
  [
    mid,
    [
      body('school', 'school is required').not().isEmpty(),
      body('degree', 'degree is required').not().isEmpty(),
      body('fieldofstudy', 'fieldofstudy is required').not().isEmpty(),
      body('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);
//  Route  delete api/profile/experience
// delete all profiles experience
//  Access  private
router.delete('/education/:edu_id', mid, async (req, res) => {
  try {
    const profile = await Profile.findOneAndRemove({ user: req.user.id });
    //  Get remove Index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexof(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(400).send('Server Error');
  }
});
router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubSecret')}`,
    };
    request(options, (errors, response, body) => {
      if (error) console.error(error);
      if (response.statusCode !== 200) {
        res.status(500).json({ msg: 'no github profile found' });
      }
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
module.exports = router;
