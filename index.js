import express from 'express';
import { Client, Databases } from 'node-appwrite';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = 3001; // Port different from your frontend

// Appwrite SDK Setup using environment variables
const client = new Client();
client
    .setEndpoint(process.env.APPWRITE_ENDPOINT) // Appwrite endpoint from .env
    .setProject(process.env.APPWRITE_PROJECT_ID) // Appwrite project ID from .env
    .setKey(process.env.APPWRITE_API_KEY); // Appwrite API key from .env

const database = new Databases(client);
const databaseId = process.env.APPWRITE_DATABASE_ID; // Database ID from .env
const collectionId = process.env.APPWRITE_COLLECTION_ID; // Collection ID from .env

// Middleware
app.use(cors()); // Allow CORS for all origins
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Fetch all contacts (Read)
app.get('/contacts', async (_req, res) => {
    try {
        const response = await database.listDocuments(databaseId, collectionId);
        
        // Create the response structure
        const result = {
            total: response.total, // Total number of documents
            documents: response.documents.map(doc => ({
                name: doc.name,
                birthday: doc.birthday,
                $id: doc.$id,
                $permissions: doc.$permissions,
                $collectionId: doc.$collectionId,
                $databaseId: doc.$databaseId,
                // Add any other fields you need here
            }))
        };

        // Return the structured result
        res.json(result);
    } catch (error) {
        // More detailed error logging
        console.error('Error fetching contacts:', error.message);
        console.error('Full Error:', error);
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
        console.error('Error adding contact:', error.message);
        console.error('Full Error:', error);
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
        console.error('Error fetching contact:', error.message);
        console.error('Full Error:', error);
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
        console.error('Error updating contact:', error.message);
        console.error('Full Error:', error);
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
        console.error('Error deleting contact:', error.message);
        console.error('Full Error:', error);
        res.status(500).send({ message: 'Error deleting contact', error });
    }
});

// Basic test route to check if the server is working
app.get('/', (req, res) => {
    res.send('API is working!');
});

// Server setup
app.listen(PORT, () => 
    console.log(`Your server is running on port ${PORT}`)
);
