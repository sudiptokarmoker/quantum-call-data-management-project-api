/* eslint-disable @typescript-eslint/no-explicit-any */
// create image gallery

import multer from 'multer';

import { Request, Response } from 'express';
import prisma from '../../../shared/prisma';
import path from 'path';

import fs from 'fs';

import { uploadMultipleImages, uploadSingleImage } from './gallary.utility';
import Jimp from 'jimp';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGalleryFilters } from './gallary.constant';
import { validateImageTypeAndSize } from '../../../shared/utils';

const dir = './uploads';

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// create single image
const createImage = async (req: Request, res: Response) => {
  try {
    const file: any = await uploadSingleImage(req, res, upload);

    if (!file) {
      throw new Error('File not found');
    }

    /**
     * validate image type and size
     */
    validateImageTypeAndSize(file, 5);
    

    const image = file.path;
    const size = file.size; // file size in bytes
    const type = file.mimetype; // file type
    const name = file.originalname;


    // If file size is larger than 500KB, resize it
    if (size > 500 * 1024) {
      const img = await Jimp.read(image);
      const width = img.bitmap.width;
      const height = img.bitmap.height;

      // Calculate new width and height. Keep aspect ratio.
      const newWidth = Math.floor(width * ((500 * 1024) / size));
      const newHeight = Math.floor(height * ((500 * 1024) / size));

      await img.resize(newWidth, newHeight).writeAsync(image);
    }

    const galleryImage = await prisma.gallery.create({
      data: { image, size, type, name },
    });
    return galleryImage;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// create multiple images
const createMultipleImages = async (req: Request, res: Response) => {
  const files: any = await uploadMultipleImages(req, res, upload);
  if (!files) {
    throw new Error('Files not found');
  }
  const images = await Promise.all(
    files.map(async (file: any) => {
      const image = file.path;
      const size = file.size;
      const type = file.mimetype;
      const name = file.originalname;

      // If file size is larger than 500KB, resize it
      if (size > 500 * 1024) {
        const img = await Jimp.read(image);
        const width = img.bitmap.width;
        const height = img.bitmap.height;

        // Calculate new width and height. Keep aspect ratio.
        const newWidth = Math.floor(width * ((500 * 1024) / size));
        const newHeight = Math.floor(height * ((500 * 1024) / size));

        await img.resize(newWidth, newHeight).writeAsync(image);
      }

      return {
        path: image,
        size: size,
        type: type,
        name: name,
      };
    }),
  );

  const galleryImages = await prisma.gallery.createMany({
    data: images.map((image: any) => ({
      image: image.path,
      size: image.size,
      type: image.type,
    })),
  });

  return galleryImages;
};

// get all images
const getAllImages = async (
  filters: IGalleryFilters,
  paginationOptions: IPaginationOptions,
) => {
  const { searchTerm, name } = filters;
  const {
    page = 1,
    limit = 10,
    sortBy = 'id', // size ,
    sortOrder: rawSortOrder = 'asc',
  } = paginationOptions;

  const sortOrder = rawSortOrder.toLowerCase() === 'desc' ? 'desc' : 'asc';

  const skip = (page - 1) * limit;

  const images = await prisma.gallery.findMany({
    where: {
      ...(searchTerm && {
        OR: [
          { name: { contains: searchTerm } },
          { image: { contains: searchTerm } },
        ],
      }),
      ...(name && { name: { contains: name } }),
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: Number(limit),
  });

  const imagesWithSizeInMB = images.map(image => ({
    ...image,
    size: image.size ? image.size / 1024 : null,
  }));

  const total = await prisma.gallery.count();

  return {
    meta: {
      total,
      limit,
      page,
    },
    data: imagesWithSizeInMB,
  };
};

// delete image from database also from uploads folder

const deleteImage = async (id: number) => {
  const image = await prisma.gallery.findUnique({ where: { id: Number(id) } });
  if (!image) {
    throw new Error('Image not found');
  }
  const deletedImage = await prisma.gallery.delete({
    where: { id: Number(id) },
  });
  fs.unlinkSync(image.image);
  return deletedImage;
};

// delete many

const deleteManyImages = async (ids: number[]) => {
  const images = await prisma.gallery.findMany({
    where: { id: { in: ids } },
  });

  if (images.length === 0) {
    throw new Error('Images not found');
  }

  const deletedImages = await prisma.gallery.deleteMany({
    where: { id: { in: ids } },
  });

  images.forEach(image => {
    fs.unlinkSync(image.image);
  });

  return deletedImages;
};

// download image

const downloadImage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const image = await prisma.gallery.findUnique({ where: { id: Number(id) } });
  if (!image) {
    throw new Error('Image not found');
  }
  const absolutePath = path.resolve(image.image);
  res.sendFile(absolutePath);
};

export const galleryService = {
  createImage,
  createMultipleImages,
  getAllImages,
  deleteImage,
  deleteManyImages,
  downloadImage,
};
