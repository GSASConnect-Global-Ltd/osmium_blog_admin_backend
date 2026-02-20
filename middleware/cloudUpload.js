// // middleware/cloudUpload.js
// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import cloudinary from "../config/cloudinary.js";

// /**
//  * Returns a multer parser configured for a specific Cloudinary folder
//  * @param {string} folderName - Cloudinary folder to store files in
//  */
// export const getCloudinaryParser = (folderName) => {
//   const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: folderName,
//       allowed_formats: ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx"],
//     },
//   });

//   return multer({ storage });
// };


// middleware/cloudUpload.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

/**
 * Returns a multer parser configured for a specific Cloudinary folder
 */
export const getCloudinaryParser = (folderName) => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      return {
        folder: folderName,
        resource_type: "raw", // 🔥 REQUIRED for pdf/doc/docx
        public_id: Date.now() + "-" + file.originalname,
      };
    },
  });

  return multer({
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit (optional but recommended)
    },
  });
};
