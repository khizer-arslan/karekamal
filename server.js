const express = require('express');
const serverless = require('serverless-http');
const router = express.Router();
const app = express();
const cors = require('cors');
const connectDB = require('./config/db');
// Connect Database
connectDB();

// init middleware
// this line allow us to get the data and req.body
// we use body parser.json but in express we have that pkg so we wrote express.json
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => res.send('Api Running'));
//  Define Routes
app.use('/api/signup', require('./routes/api/signup'));
app.use('/api/login', require('./routes/api/login'));
app.use('/api/logout', require('./routes/api/logout'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/resetpsw', require('./routes/api/resetpsw'));
app.use('/api/news', require('./routes/api/news'));
app.use('/api/requests', require('./routes/api/requests'));
app.use('/api/updateProfile', require('./routes/api/updatedProfile'));
app.use('/api/changePassword', require('./routes/api/changePassword'));
app.use('/api/feedbackSubmitted', require('./routes/api/FeedbackSubmitted'));
app.use('/api/isReady', require('./routes/api/ReadyForBlood.js'));
app.use('/api/allUsers', require('./routes/api/allUsers'));
app.use('/api/request', require('./routes/api/requests.donation'));



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.use('/.netlify/server', router);
module.exports.handler = serverless(app);
