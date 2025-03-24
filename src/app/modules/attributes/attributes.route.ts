import express from 'express';
import { AttributesController } from './attributes.controller';

const route = express.Router();

// create attribute
route.post('/', AttributesController.createAttributes);
// get all attributes
route.get('/', AttributesController.getAttributes);
// get attribute by id
route.get('/:id', AttributesController.getAttributesById);
// update attribute
route.patch('/:id', AttributesController.updateAttributes);
// delete attribute
route.delete('/:id', AttributesController.deleteAttributes);

export const AttributesRoute = route;
