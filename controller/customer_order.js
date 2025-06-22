const ContactModel = require('../models/contact_model');
const { Op } = require("sequelize");

const identifyUser = async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      return res.status(400).json({
        message: "Either phoneNumber or email is required."
      });
    }

    const matchingContacts = await ContactModel.findAll({
      where: {
        [Op.or]: [
          email ? { email } : {},
          phoneNumber ? { phoneNumber } : {}
        ]
      },
      order: [['createdAt', 'ASC']]
    });

    if (matchingContacts.length === 0) {
      const newContact = await ContactModel.create({
        email,
        phoneNumber,
        linkedId: null,
        deletedAt: null
      });

      return res.status(200).json({
        contact: {
          primaryContatctId: newContact.id,
          emails: [newContact.email],
          phoneNumbers: [newContact.phoneNumber],
          secondaryContactIds: []
        }
      });
    }

    const allContactIds = new Set();
    const contactMap = new Map(); 
    let primaryContact = null;

    for (const contact of matchingContacts) {
      allContactIds.add(contact.id);
      contactMap.set(contact.id, contact);

      if (contact.linkPrecedence === "secondary" && contact.linkedId) {
        const primary = await ContactModel.findOne({ where: { id: contact.linkedId } });
        if (primary) {
          allContactIds.add(primary.id);
          contactMap.set(primary.id, primary);
        }
      }
    }

    const allLinkedContacts = await ContactModel.findAll({
      where: {
        [Op.or]: [
          { id: Array.from(allContactIds) },
          { linkedId: Array.from(allContactIds) }
        ]
      },
      order: [['createdAt', 'ASC']]
    });

    const truePrimary = allLinkedContacts.find(c => c.linkPrecedence === "primary");
    primaryContact = truePrimary;

    for (const contact of allLinkedContacts) {
      if (
        contact.id !== primaryContact.id &&
        contact.linkPrecedence === "primary"
      ) {
        contact.linkPrecedence = "secondary";
        contact.linkedId = primaryContact.id;
        await contact.save();
      }
    }

    const emailExists = allLinkedContacts.some(c => c.email === email);
    const phoneExists = allLinkedContacts.some(c => c.phoneNumber === phoneNumber);

    if ((email && !emailExists) || (phoneNumber && !phoneExists)) {
      const newSecondary = await ContactModel.create({
        email,
        phoneNumber,
        linkedId: primaryContact.id,
        linkPrecedence: "secondary",
        deletedAt: null
      });

      allLinkedContacts.push(newSecondary);
    }

    const emails = [...new Set(allLinkedContacts.map(c => c.email).filter(Boolean))];
    const phoneNumbers = [...new Set(allLinkedContacts.map(c => c.phoneNumber).filter(Boolean))];
    const secondaryContactIds = allLinkedContacts
      .filter(c => c.linkPrecedence === "secondary")
      .map(c => c.id);

    return res.status(200).json({
      contact: {
        primaryContatctId: primaryContact.id,
        emails,
        phoneNumbers,
        secondaryContactIds
      }
    });
  }
  catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: error.message
    });
  }
};

module.exports = { identifyUser };