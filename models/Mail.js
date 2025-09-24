// C:\express\osmium_blog_backend\osmium_blog_express_application\models\Mail.js
import mongoose from "mongoose";

const mailSchema = new mongoose.Schema({
  email: String,
  subject: String,
  template: String,
  context: Object,
  text: String,
  status: {
    type: String,
    enum: ["PENDING", "SENT", "FAILED"],
    default: "PENDING",
  },
});

const Mail = mongoose.model("Mail", mailSchema);

export default Mail;
