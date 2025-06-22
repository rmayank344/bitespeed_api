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
  }
  catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: error.message
    });
  }
};

module.exports = { identifyUser };