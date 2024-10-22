import express from 'express';
import { Client, Databases } from 'node-appwrite';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = 3001; // Use a different port from your frontend

// Appwrite SDK Setup
const client = new Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1') // Appwrite endpoint
    .setProject('67150ead0038b4908893')
    .setKey("standard_2331d9a8679e7ad53aea16d73ecee6a53c9956bdbade2260f8085cd91555aaa894970d216916e51675e5278b5d27de401a78824d45985bc623beb3e3db51dafc37a0532708f3481a6cc3e17ebcd1f0dcbcd0d96d5c0668d5ea25be8300955d9c695b264d1ad7020569df25a721c9593447a3f85b7629e718703c859a92a644f6");    // Replace with your Appwrite project ID
             // Replace with your Appwrite API key

const database = new Databases(client);
const databaseId = '671730d60011353ebdae';      // Replace with your database ID
const collectionId = '671730ea002925e55ce6';  // Replace with your collection ID

// Middleware
app.use(cors()); // Allow CORS for all origins
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes

// Fetch all contacts
app.get('/contact', async (req, res) => {
    try {
        const response = await database.listDocuments(databaseId, collectionId);
        res.json(response.documents);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).send({ message: 'Error fetching contacts', error });
    }
});

// Add a new contact
app.post('/contact', async (req, res) => {
    const { firstName, lastName, email, company, phone } = req.body;
    try {
        const response = await database.createDocument(
            databaseId,
            collectionId,
            'unique()',  // Generate a unique ID
            {
                firstName,
                lastName,
                email,
                company,
                phone
            }
        );
        res.status(201).json(response);
    } catch (error) {
        console.error('Error adding contact:', error);
        res.status(500).send({ message: 'Error adding contact', error });
    }
});

// Get contact by ID
app.get('/contact/:contactId', async (req, res) => {
    try {
        const document = await database.getDocument(databaseId, collectionId, req.params.contactId);
        res.json(document);
    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).send({ message: 'Error fetching contact', error });
    }
});

// Update contact by ID
app.put('/contact/:contactId', async (req, res) => {
    const { firstName, lastName, email, company, phone } = req.body;
    try {
        const response = await database.updateDocument(
            databaseId,
            collectionId,
            req.params.contactId,
            {
                firstName,
                lastName,
                email,
                company,
                phone
            }
        );
        res.json(response);
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).send({ message: 'Error updating contact', error });
    }
});

// Delete contact by ID
app.delete('/contact/:contactId', async (req, res) => {
    try {
        await database.deleteDocument(databaseId, collectionId, req.params.contactId);
        res.json({ message: 'Successfully deleted contact' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).send({ message: 'Error deleting contact', error });
    }
});

// Server setup
app.listen(PORT, () => 
    console.log(`Your server is running on port ${PORT}`)
);
