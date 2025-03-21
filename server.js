const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { EventsLogger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const connectDB = require('./config/database');
const checkAdmin = require('./middleware/checkAdmin');
const updateLastActivity = require('./middleware/userActivity');
const PORT = process.env.PORT || 3500;

connectDB();

app.use(cookieParser());

app.use(EventsLogger);

app.use(credentials);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use('/', express.static(path.join(__dirname, '/public'))); 
app.get('/test-error', (req, res, next) => {
    next(new Error('Test error'));
  });
  
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/reset',require('./routes/reset'));
app.use('/resetPassword/verify',require('./routes/resetVerification'));
app.use('/verify',require('./routes/verify'));
app.use('/refresh', require('./routes/refresh'));
app.use('/forgot',require('./routes/forgot'))
app.use('/logout', require('./routes/logout'));
app.use('/admin/login', require('./routes/adminLogin'));
app.use('/admin', verifyJWT, checkAdmin, require('./routes/admin'));
app.use(verifyJWT,updateLastActivity);
app.use('/profile',require('./routes/profile'));
app.use('/reviews',require('./routes/reviews'));
app.use('/Q&A',require('./routes/question'));


app.all('*', (req, res) => 
    {
    res.status(404);
    if (req.accepts('html')) 
    {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } 
    else if (req.accepts('json')) 
    {
        res.json({ "error": "404 Not Found" });
    } 
    else
    {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));