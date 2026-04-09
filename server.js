const express = require('express');
const colors = require('colors');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

//config env
dotenv.config();

// db connection
const connectDB = require('./config/database');
connectDB();

// rest object
const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//import test routes
app.use('/api/v1/test', require('./routes/testRoutes'));
app.use('/api/v1/auth', require('./routes/authRoutes'));

//route 
app.get('/', (req, res) => {
  return  res.status(200).send('Hello in the food app');
});

//port
const PORT = process.env.PORT || 8080;

// listen on port 8080
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

