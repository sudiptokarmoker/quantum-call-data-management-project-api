import multer from 'multer';
import { Request, Response } from 'express';

export const uploadSingleImage = (
  req: Request,
  res: Response,
  upload: multer.Multer,
) => {
  return new Promise((resolve, reject) => {
    upload.single('image')(req, res, err => {
      if (err) {
        reject(err);
      } else {
        resolve(req.file);
      }
    });
  });
};

export const uploadMultipleImages = (
  req: Request,
  res: Response,
  upload: multer.Multer,
) => {
  return new Promise((resolve, reject) => {
    upload.array('image', 10)(req, res, err => {
      if (err) {
        reject(err);
      } else {
        resolve(req.files);
      }
    });
  });
};
