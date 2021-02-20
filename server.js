// if(process.env.NODE_ENV !== "production") {
//     require('dotenv').config();
// }

import express from 'express'
import mongoose from 'mongoose'
import Projects from './project.js';
import ejsMate from 'ejs-mate';
import path from 'path';
import multer from 'multer';
import { storage } from './cloudinary/index.js';
import Project from './project.js';

const upload = multer({ storage });

const app = express();
const port = process.env.PORT || 3001;
const connection_url= process.env.DB_URL || 'mongodb://localhost:27017/jayeshsadhwani';

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended:true}));
// app.use(express.static(path.join(__dirname, 'public')));

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
    res.status(200).send('Jayesh Sadhwani Admin');
})

app.get('/projects', (req, res) => {
    const projects = await Project.find();
    res.render('allProjects', { projects });
})

app.get('/addProject', (req, res) => {
    res.status(200).render('addProject');
})

app.get('/editProject/:id', async (req, res) => {
    const id = req.params.id;
    const project = await Project.findById(id);
    res.render('editProject', {project})
})

app.post('/addProject', upload.single('image'), async (req, res) => {
    const project = new Project(req.body.project);
    console.log(req.files);
    // project.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await project.save();
    console.log(project);
    res.send('done');
})

app.post('/editProject/:id', async (req, res) => {
    const id = req.params.id;
    const project = await Project.findByIdAndUpdate(id);
    project = req.body.project;
    project.save();
    res.redirect('/');
})

app.post('/deleteProject/:id', async (req, res) => {
    const id = req.params.id;
    const project = await Project.findByIdAndDelete(id);
    project.save();
    res.redirect('/');
})

// app.post('/tinder/cards', (req, res) => {
//     const dbCard = req.body;
//     try {
//         Projects.create(dbCard, (err, data)=>{
//             if(err) {
//                 res.status(500).err
//             } else {
//                 res.status(201).send(data)
//             }
//         })
//     } catch(e) {
//         res.send(e);
//     }
// })

app.get('/tinder/cards', (req, res) => {
    Projects.find((err, data)=>{
        if(err) {
            res.status(500).err
        } else {
            res.status(200).send(data)
        }
    })
})

app.listen(port, (req,res)=> {
    console.log(`Listening on port ${port}`);
})