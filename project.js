import mongoose from 'mongoose';
// const Schema = mongoose.Schema;

// const ImageSchema = new Schema({
//     url: String,
//     filename: String
// });

const projectSchema = mongoose.Schema({
    title: String,
    imgUrl: String,
    siteUrl: String,
    codeUrl: String,
    description: String,
    backendtechnologies: String,
    frontendtechnologies: String,
    features: String,
})

export default mongoose.model('Projects' ,projectSchema);