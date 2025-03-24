import { Router } from "express";
import { productReviewController } from "./productReview.controller";

const router = Router();


// create product review

router.post('/', productReviewController.createProductReview);

// get all product review

router.get('/', productReviewController.getAllProductReview);

// status change

router.patch('/:id', productReviewController.changeStatus);

// delete product review

router.delete('/:id', productReviewController.deleteProductReview);


export const productReviewRoute = router;



