import express from 'express'
import mongoose from 'mongoose'
import Cors from 'cors'
import Projects from './project.js';

const app = express();
const port = process.env.PORT || 3001;
const connection_url= process.env.DB_URL;

app.use(express.json());
app.use(Cors());

mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
})

app.get('/', (req, res) => {
    res.status(200).send('Hello World');
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