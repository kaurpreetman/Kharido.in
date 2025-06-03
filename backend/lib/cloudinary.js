// lib/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: 'dolset2wb',
  api_key: '942762962647291',
  api_secret: 'A017mx4WhZgHWcVWlkLEcb4dfuQ',
});

console.log("✅ Cloudinary configured successfully.");

export default cloudinary; 