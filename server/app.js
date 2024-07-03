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

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + "/public"));

app.get('/',(req,res)=>{
    res.send('API is running');
});

app.post('/register', async (req, res) => {
    const { name, email, password, phoneNo, age, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, phoneNo, age, address, submissions: [] });
    await newUser.save();
    res.send('User registered successfully');
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
            userId: user._id,
            email: user.email,
            token: token
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/submit', async (req, res) => {
    const { email, responses, score } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('User not found');
    user.submissions.push({ responses, score });
    await user.save();
    res.send('Questionnaire submitted successfully');
});

function calculateScore(responses) {
    let score = 0;
    for (const response of responses) {
        switch (response.answer) {
            case 'A':
                score += 0; 
                break;
            case 'B':
                score += 1; 
                break;
            case 'C':
                score += 2;
                break;
            case 'D':
                score += 3; 
                break;
            default:
                break;
        }
    }
    return score;
}


app.post('/submit-responses', async (req, res) => {
    const { userId, responses } = req.body;

    try {
        const user = await User.findById(userId);
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
        user.submissions.push(submission);
        await user.save();
        res.status(200).json({ message: 'Responses added to user submissions successfully' });
    } catch (error) {
        console.error('Error adding responses to user submissions:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});




mongoose
  .connect("mongodb+srv://nagapreethamj21:preetham@cluster0.jhy2xxy.mongodb.net/BTP")
  .then(() => {
    const server = app.listen(6000, () => {
      console.log("App Listening to port 6000");
    });
    console.log('MongoDB Connected...');
    
  })
  .catch((err) => console.log("MongoDB connection error:", err));
