import express from "express";
import { identifyContact } from "./identification.service";

export const identificationController = express.Router();

/**
 * Will identify possibly related contacts linked to the payload
 *
 * @method POST
 * @route /identify
 */
identificationController.post("/", (req, res) => identifyContact(req, res));
