import mongoose from "mongoose";

const socialSchema = new mongoose.Schema({
  platform: { type: String, required: true }, // e.g., Twitter, LinkedIn
  url: { type: String, required: true },
});

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    post: { type: String, required: true }, // position or role
    photo: { type: String }, // filename or URL
    photoId: { type: String }, // for Cloudinary public_id  
     bio: { type: String },
    socials: [socialSchema], // array of social links
  },
  { timestamps: true }
);

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);
export default TeamMember;
