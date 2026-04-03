import multer from "multer";

const storage = multer.diskStorage({
  destination: "./public/temp",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/quicktime"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images & videos allowed"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
});