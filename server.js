// if(process.env.NODE_ENV !== "production") {
//     require('dotenv').config();
// }

import express from 'express';
import mongoose from 'mongoose';
import ejsMate from 'ejs-mate';
import path from 'path';
import Cors from 'cors';
import Project from './project.js';
import { isLoggedIn } from './middleware.js';
import cookieParser from 'cookie-parser';

const __dirname = path.resolve();

const app = express();
app.use(Cors());
const port = process.env.PORT || 3001;
const connection_url= process.env.DB_URL || 'mongodb://localhost:27017/jayeshsadhwani';

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.get('/', (req, res) => {
    res.render('Home');
})

app.post('/', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const userAuthCode = process.env.userAuthCode || 'userAuthCode';
    const passwordVerification = process.env.password || 'password';
    const usernameVerification = process.env.username || 'admin';
    if((password === passwordVerification) && (username === usernameVerification)) {
        res.cookie('userAuthCode', userAuthCode,  {expire: 1000 * 60 * 60 * 24 + Date.now()});
        res.redirect('/projects');
    } else {
        res.redirect('/');
    }
})

app.post('/logout', (req, res)=> {
    res.clearCookie('userAuthCode')
    res.redirect('/');
})

app.get('/getProjects', async (req, res) => {
    await Project.find((err, data) => {
        if(err) {
            res.status(500).err
        } else {
            res.status(200).send(data);
        }
    });
})

app.get('/projects', isLoggedIn, async (req, res) => {
    const projects = await Project.find();
    res.render('allProjects', { projects });
})

app.get('/addProject', isLoggedIn, (req, res) => {
    res.status(200).render('addProject');
})

app.get('/editProject/:id', isLoggedIn, async (req, res) => {
    const id = req.params.id;
    const project = await Project.findById(id);
    res.render('editProject', {project})
})

app.post('/addProject', isLoggedIn, async (req, res) => {
    const project = new Project(req.body.project);
    // project.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await project.save();
    console.log(project);
    res.redirect('/projects');
})

app.post('/editProject/:id', isLoggedIn, async (req, res) => {
    const id = req.params.id;
    const project = await Project.findByIdAndUpdate(id, {...req.body.project});
    project.save();
    res.redirect('/projects');
})

app.post('/deleteProject/:id', isLoggedIn, async (req, res) => {
    const id = req.params.id;
    const project = await Project.findByIdAndDelete(id);
    res.redirect('/projects');
})

app.listen(port, (req,res)=> {
    console.log(`Listening on port ${port}`);
})