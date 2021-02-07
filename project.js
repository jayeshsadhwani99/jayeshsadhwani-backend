import mongoose from 'mongoose';

const projectSchema = mongoose.Schema({
    title: String,
    imgUrl: String,
    siteUrl: String,
    codeUrl: String,
    description: String,
    technologies: String,
    features: String,
})

export default mongoose.model('Projects' ,projectSchema);