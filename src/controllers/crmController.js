import mongoose from 'mongoose';
import { ContactSchema } from '../models/crmModel';

const Contact = mongoose.model('Contact', ContactSchema);

export const addNewContact = async (req, res) => {
    try {
        const newContact = new Contact(req.body);
        const contact = await newContact.save();
        res.status(201).json(contact);
    } catch (err) {
        res.status(500).send({ message: 'Error saving contact', error: err });
    }
};

export const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().exec();
        res.json(contacts);
    } catch (err) {
        res.status(500).send({ message: 'Error retrieving contacts', error: err });
    }
};

export const getContactWithID = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.contactId).exec();
        if (!contact) {
            return res.status(404).send({ message: 'Contact not found' });
        }
        res.json(contact);
    } catch (err) {
        res.status(500).send({ message: 'Error retrieving contact', error: err });
    }
};

export const updateContact = async (req, res) => {
    try {
        const contact = await Contact.findOneAndUpdate(
            { _id: req.params.contactId },
            req.body,
            { new: true, runValidators: true }
        ).exec();
        if (!contact) {
            return res.status(404).send({ message: 'Contact not found' });
        }
        res.json(contact);
    } catch (err) {
        res.status(500).send({ message: 'Error updating contact', error: err });
    }
};

export const deleteContact = async (req, res) => {
    try {
        const result = await Contact.deleteOne({ _id: req.params.contactId }).exec();
        if (result.deletedCount === 0) {
            return res.status(404).send({ message: 'Contact not found' });
        }
        res.json({ message: 'Successfully deleted contact' });
    } catch (err) {
        res.status(500).send({ message: 'Error deleting contact', error: err });
    }
};
