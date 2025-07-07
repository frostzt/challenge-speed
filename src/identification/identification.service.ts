import type { Request, Response } from "express";
import { identifyContactRequestDto } from "./dto/identify-contact.dto";
import { findOrCreateContact } from "./identification.repository";
import { toIdentifyContactResponse } from "./dto/identify-contact-response.dto";

export async function identifyContact(req: Request, res: Response) {
  const body = req.body;

  try {
    // Validate and parse request body
    const desUnion = await identifyContactRequestDto.safeParseAsync(body);
    if (!desUnion.success) {
      res.status(400).send({
        error: "invalid request, bad request",
        errors: desUnion.error.issues,
      });
      return;
    }

    // Find related contacts
    const data = desUnion.data;
    const contacts = await findOrCreateContact(data.phoneNumber, data.email);

    // Format and return contacts
    const formattedContact = toIdentifyContactResponse(contacts);

    res.status(200).send({ contact: formattedContact });
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
