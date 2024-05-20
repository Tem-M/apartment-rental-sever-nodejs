const express = require('express')
const bodyParser = require('body-parser')
//mongoose - node.js ספריה שמאפשרת לנו להתחבר למונגו דרך 
// npm i mongoose - התקנה של הספריה
const mongoose = require('mongoose')
const apartmentRouter = require('./api/routes/apartment')
const advertiserRouter = require('./api/routes/advertiser')
const categoryRouter = require('./api/routes/category')
const cityRouter =require('./api/routes/city')
const cors = require('cors');


// יצירת השרת
const app = express()
const port = 3001

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


app.use(cors())
// התקנת חבילה שתנהל את משתני הסביבה
const dotenv = require('dotenv')
const { signIn, profile } = require('./api/controllers/login')
const { signUp } = require('./api/controllers/user')
const { validAuth, validTokenMatch } = require('./middlewares')
//const connectDB = require('./DbConnection')
// הפעולה שמכירה את משתני הסביבה בכל הפרויקט
dotenv.config()

// דרך נוספת לגרום לפרויקט להכיר את משתני הסביבה - שינוי סקריפט ההרצה
// "start": "nodemon dotenv/config -r app.js",

// פונקציית חיבור למונגו
// גישה למשתני סביבה דרך - process.env.שם_המשתנה
mongoose.connect(process.env.MONGO, {})
// mongoose.connect(process.env.LOCAL_URI, {})
    .then(() => {
        console.log(`connect to mongoDB!`);
    })
    .catch(err => {
        console.log(err.message);
    })

// connectDB()

// endpoints - קריאות שרת
app.use('/apartment', apartmentRouter)
app.use('/advertiser', advertiserRouter)
app.use('/categories', categoryRouter)
app.use('/cities', cityRouter)
app.post('/signin', signIn)
app.post('/signup', signUp)
app.use('/uploads', express.static('uploads'))

// יצירת מאזין
// הפורט עליו ירוץ השרת
app.listen(port, () => {
    console.log(`my application is running on http://localhost:${port}`);
})