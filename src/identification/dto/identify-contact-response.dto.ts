import { Contact, ContactLinkPrecedence } from "../entities/contact.entity";

interface IdentifyContactResponseDto {
  primaryContactId: string;
  emails: Array<string>;
  phoneNumbers: Array<string>;
  secondaryContacts: Array<string>;
}

export function toIdentifyContactResponse(contacts: Array<Contact>) {
  const data: IdentifyContactResponseDto = {
    primaryContactId: "",
    emails: [],
    phoneNumbers: [],
    secondaryContacts: [],
  };

  for (const contact of contacts) {
    if (contact.linkPrecedence === ContactLinkPrecedence.PRIMARY) {
      data.primaryContactId = contact.id;
    } else {
      data.secondaryContacts.push(contact.id);
    }

    if (contact.email) {
      data.emails.push(contact.email);
    }

    if (contact.phoneNumber) {
      data.phoneNumbers.push(contact.phoneNumber);
    }
  }

  return data;
}
