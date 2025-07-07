import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum ContactLinkPrecedence {
  PRIMARY = "PRIMARY",
  SECONDARY = "SECONDARY",
}

@Entity({ name: "contacts" })
export class Contact {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: string;

  @Column({ type: "varchar", length: 10, name: "phone_number", nullable: true })
  @Index("idx_contact_phone_number")
  phoneNumber: string;

  @ManyToOne((type) => Contact, (contact) => contact.linkedId)
  @JoinColumn({ name: "linked_id" })
  linkedId: Contact;

  @Column({
    type: "enum",
    name: "link_precedence",
    enum: ContactLinkPrecedence,
  })
  linkPrecedence: ContactLinkPrecedence;

  @Column({ type: "varchar", length: 255, name: "email", nullable: true })
  @Index("idx_contact_email")
  email: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at", nullable: true })
  deletedAt: Date;
}
