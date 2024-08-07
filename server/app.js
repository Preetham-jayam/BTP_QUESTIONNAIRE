const express=require('express');
const bcrypt = require("bcryptjs");
const bodyParser=require('body-parser');
const { MONGODB_URL } = process.env;
const cors=require('cors');
const dotenv=require('dotenv');
const jwt=require('jsonwebtoken');
const app=express();
const mongoose=require('mongoose');
const User=require('./models/User');
const auth =require('./middleware/auth');
const corsOptions = {
    origin: ['http://localhost:3000'],
  };
  
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));


const optionScores = {
    'Not at all': 0,
    'Several days': 1,
    'More than half the days': 2,
    'Nearly every day': 3
  };
  
  const calculateScore = (responses) => {
    return responses.reduce((total, response) => total + optionScores[response.answer], 0);
  };

app.get('/',(req,res)=>{
    res.send('API is running');
});

app.post('/register', async (req, res) => {
    const { name, email, password, phoneNo, age, address } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, phoneNo, age, address, submissions: [] });
        await newUser.save();
        res.send({message:'User registered successfully'});
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send({message:'Registration failed. Please try again.',error:error}); 
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            'supersecret_dont_share', 
            { expiresIn: '1d' }
        );
        res.json({
            user,
            userId: user._id,
            email: user.email,
            token: token
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});


app.post('/submit-phq9', auth, async (req, res) => {
    const { responses } = req.body;

    try {
        const user = await User.findById(req.user.userId);
        console.log(user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const submission = {
            responses: responses.map(response => ({
                question: response.question,
                answer: response.answer
            })),
            score: calculateScore(responses),
            submittedAt: new Date()
        };

        const phq9Questionnaire = user.questionnaires.find(q => q.name === 'PHQ9');
        if (phq9Questionnaire) {
            phq9Questionnaire.submissions.push(submission);
        } else {
            user.questionnaires.push({ name: 'PHQ9', submissions: [submission] });
        }

        await user.save();
        res.status(200).json({ message: 'Responses added to PHQ-9 submissions successfully', user: user });
    } catch (error) {
        console.error('Error adding responses to PHQ-9 submissions:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/submit-hads', auth, async (req, res) => {
    const { userId, responses, score } = req.body;
  
    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const submission = {
        responses: responses.map(response => ({
          question: response.question,
          answer: response.answer
        })),
        score,
        submittedAt: new Date()
      };
  
      const questionnaire = user.questionnaires.find(q => q.name === 'HADS');
      if (questionnaire) {
        questionnaire.submissions.push(submission);
      } else {
        user.questionnaires.push({ name: 'HADS', submissions: [submission] });
      }
  
      await user.save();
      res.status(200).json({ message: 'Responses added to user submissions successfully', user });
    } catch (error) {
      console.error('Error adding responses to user submissions:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  app.post('/submit-bdi', auth, async (req, res) => {
    const { userId, responses, score } = req.body;
  
    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const submission = {
        responses: responses.map(response => ({
          question: response.question,
          answer: response.answer
        })),
        score,
        submittedAt: new Date()
      };
  
      const questionnaire = user.questionnaires.find(q => q.name === 'BDI');
      if (questionnaire) {
        questionnaire.submissions.push(submission);
      } else {
        user.questionnaires.push({ name: 'BDI', submissions: [submission] });
      }
  
      await user.save();
      res.status(200).json({ message: 'Responses added to user submissions successfully', user });
    } catch (error) {
      console.error('Error adding responses to user submissions:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
app.get('/users/:userId/submissions', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const submissions = user.questionnaires.reduce((acc, q) => {
            acc[q.name] = q.submissions;
            return acc;
        }, {});
        console.log(submissions);
        res.status(200).json({ submissions });
    } catch (error) {
        console.error('Error fetching user submissions:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});


mongoose
  .connect("mongodb+srv://nagapreethamj21:preetham@cluster0.jhy2xxy.mongodb.net/BTP")
  .then(() => {
    const server = app.listen(5003, () => {
      console.log("App Listening to port 5003");
    });
    console.log('MongoDB Connected...');
    
  })
  .catch((err) => console.log("MongoDB connection error:", err));
