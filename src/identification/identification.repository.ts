import { AppDataSource } from "../data-source";
import { Contact, ContactLinkPrecedence } from "./entities/contact.entity";
import { In } from "typeorm";

export async function createContact(
  precedence: ContactLinkPrecedence,
  phoneNumber?: string,
  email?: string,
) {
  const repository = AppDataSource.getRepository(Contact);
  return repository.save({ phoneNumber, email, linkPrecedence: precedence });
}

/**
 * Given contacts checks weather those contacts should be linked or not, if yes then links and updates them
 */
async function linkContacts(contacts: Array<Contact>) {
  const repository = AppDataSource.getRepository(Contact);
  const contactIds = contacts.map((c) => c.id);

  // Find the oldest contact
  const oldestContact = contacts.reduce((acc, curr) =>
    curr.createdAt < acc.createdAt ? curr : acc,
  );

  const linkTo = oldestContact.linkedId?.id ?? oldestContact.id;
  const toUpdate = contacts.filter((contact) => {
    // Skip if already linked
    const isSecondary =
      contact.linkPrecedence === ContactLinkPrecedence.SECONDARY;
    if (
      contact.id === linkTo ||
      (isSecondary && contact.linkedId?.id === linkTo)
    ) {
      return false;
    }

    return true;
  });

  if (toUpdate.length > 0) {
    await repository.save(
      toUpdate.map((contact) => ({
        ...contact,
        linkPrecedence: ContactLinkPrecedence.SECONDARY,
        linkedId: { id: linkTo },
      })),
    );
  }

  return {
    contacts: await repository.find({ where: { id: In(contactIds) } }),
    linkedTo: oldestContact.linkedId?.id
      ? oldestContact.linkedId
      : oldestContact,
  };
}

export async function findOrCreateContact(
  phoneNumber?: string,
  email?: string,
): Promise<Array<Contact>> {
  const repository = AppDataSource.getRepository(Contact);

  const whereClause = [];

  if (phoneNumber && phoneNumber.length > 1) {
    whereClause.push({ phoneNumber });
  }

  if (email && email.length > 1) {
    whereClause.push({ email });
  }

  if (whereClause.length === 0) {
    throw new Error("Either phoneNumber or email must be provided");
  }

  // Find contacts oldest first
  const contacts = await repository.find({
    where: whereClause,
    relations: ["linkedId"],
    order: { createdAt: "ASC" },
  });

  // Create a new primary contact in case no contacts match
  if (contacts.length === 0) {
    const newContact = await createContact(
      ContactLinkPrecedence.PRIMARY,
      phoneNumber,
      email,
    );

    return [newContact];
  }

  // Rebalance contacts
  if (contacts.length >= 1) {
    const { contacts: finalContacts, linkedTo } = await linkContacts(contacts);

    // Check if new data (email or phone) is missing in all existing contacts
    const emails = new Set(finalContacts.map((c) => c.email).filter(Boolean));
    const phones = new Set(
      finalContacts.map((c) => c.phoneNumber).filter(Boolean),
    );

    const hasEmail = email && emails.has(email);
    const hasPhone = phoneNumber && phones.has(phoneNumber);

    if (!hasEmail || !hasPhone) {
      const newContact = await createContact(
        ContactLinkPrecedence.SECONDARY,
        hasPhone ? undefined : phoneNumber,
        hasEmail ? undefined : email,
      );

      await repository.update(newContact.id, { linkedId: linkedTo });
      finalContacts.push({ ...newContact, linkedId: linkedTo });
    }

    return finalContacts;
  }

  return contacts;
}
