import express from 'express';
import { Client, Databases } from 'node-appwrite';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = 3001; // Port different from your frontend

// Appwrite SDK Setup
const client = new Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1') // Appwrite endpoint
    .setProject('67150ead0038b4908893');
    

const database = new Databases(client);
const databaseId = '671730d60011353ebdae'; // Your database ID
const collectionId = '671730ea002925e55ce6'; // Your collection ID

// Middleware
app.use(cors()); // Allow CORS for all origins
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Fetch all contacts (Read)
app.get('/contacts', async (_req, res) => {
    try {
        const response = await database.listDocuments(databaseId, collectionId);
        res.json(response.documents);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).send({ message: 'Error fetching contacts', error });
    }
});

// Add a new contact (Create)
app.post('/contacts', async (req, res) => {
    const { firstName, lastName, email, company, phone } = req.body;
    try {
        const response = await database.createDocument(
            databaseId,
            collectionId,
            'unique()',  // Generate a unique ID
            { firstName, lastName, email, company, phone }
        );
        res.status(201).json(response);
    } catch (error) {
        console.error('Error adding contact:', error);
        res.status(500).send({ message: 'Error adding contact', error });
    }
});

// Fetch a single contact by ID (Read)
app.get('/contacts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const response = await database.getDocument(databaseId, collectionId, id);
        res.json(response);
    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).send({ message: 'Error fetching contact', error });
    }
});

// Update a contact by ID (Update)
app.put('/contacts/:id', async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, company, phone } = req.body;
    try {
        const response = await database.updateDocument(
            databaseId,
            collectionId,
            id,
            { firstName, lastName, email, company, phone }
        );
        res.json(response);
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ message: 'Error updating contact', error });
    }
});

// Delete a contact by ID (Delete)
app.delete('/contacts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await database.deleteDocument(databaseId, collectionId, id);
        res.status(204).send(); // No content after successful deletion
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).send({ message: 'Error deleting contact', error });
    }
});

// Server setup
app.listen(PORT, () => 
    console.log(`Your server is running on port ${PORT}`)
);
