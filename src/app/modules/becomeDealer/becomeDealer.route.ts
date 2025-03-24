import { Router } from "express";
import { BecomeDealerController } from "./becomeDealer.controller";

const router = Router();

// create become dealer

router.post("/", BecomeDealerController.createBecomeDealer);

// get all become dealers

router.get("/", BecomeDealerController.getAllBecomeDealers);

export const becomeDealerRouter = router;