import express from 'express';
import { Client, Databases, Functions } from 'node-appwrite';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';  // Import axios for the HTTP request

const app = express();
const PORT = 3001;

// Appwrite SDK Setup with hardcoded values
const client = new Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1')  // Your Appwrite endpoint
    .setProject('67150ead0038b4908893')           // Your hardcoded Project ID
    .setKey('standard_2331d9a8679e7ad53aea16d73ecee6a53c9956bdbade2260f8085cd91555aaa894970d216916e51675e5278b5d27de401a78824d45985bc623beb3e3db51dafc37a0532708f3481a6cc3e17ebcd1f0dcbcd0d96d5c0668d5ea25be8300955d9c695b264d1ad7020569df25a721c9593447a3f85b7629e718703c859a92a644f6'); // Your API key

const database = new Databases(client);
const functions = new Functions(client);

const databaseId = '671730d60011353ebdae';  // Hardcoded database ID
const collectionId = '671730ea002925e55ce6'; // Hardcoded collection ID

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes for Database Operations
app.get('/contact', async (req, res) => {
    try {
        const response = await database.listDocuments(databaseId, collectionId);
        res.json(response.documents);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).send({ message: 'Error fetching contacts', error });
    }
});

app.post('/contact', async (req, res) => {
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

// New Route for Listing Function Executions
app.get('/functions/:functionId/executions', async (req, res) => {
    const { functionId } = req.params;
    try {
        const result = await functions.listExecutions(functionId);
        res.json(result);
    } catch (error) {
        console.error('Error fetching function executions:', error);
        res.status(500).send({ message: 'Error fetching function executions', error });
    }
});

// New Route to Trigger a Function Using axios
app.post('/trigger-function/:functionId', async (req, res) => {
    const { functionId } = req.params;

    try {
        // Axios request to trigger the Appwrite function
        const response = await axios.post(
            `https://cloud.appwrite.io/v1/functions/${functionId}/executions`,
            {}, // Empty body for function trigger
            {
                headers: {
                    'x-appwrite-project': '67150ead0038b4908893', // Hardcoded Project ID
                    'x-appwrite-key': 'standard_2331d9a8679e7ad53aea16d73ecee6a53c9956bdbade2260f8085cd91555aaa894970d216916e51675e5278b5d27de401a78824d45985bc623beb3e3db51dafc37a0532708f3481a6cc3e17ebcd1f0dcbcd0d96d5c0668d5ea25be8300955d9c695b264d1ad7020569df25a721c9593447a3f85b7629e718703c859a92a644f6', // Hardcoded API Key
                    'Content-Type': 'application/json'
                }
            }
        );

        // Sending the response back to the client
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error triggering function:', error.response ? error.response.data : error.message);
        res.status(500).send({ message: 'Error triggering function', error });
    }
});

// Server setup
app.listen(PORT, () => console.log(`Your server is running on port ${PORT}`));

// axios-based function execution
async function triggerAppwriteFunction() {
    try {
        const response = await axios.post(
            `https://cloud.appwrite.io/v1/functions/6718b7a50017d23dcd09/executions`,
            {}, // Request body (optional)
            {
                headers: {
                    'x-appwrite-project': '67150ead0038b4908893', // Your Project ID
                    'x-appwrite-key': 'standard_2331d9a8679e7ad53aea16d73ecee6a53c9956bdbade2260f8085cd91555aaa894970d216916e51675e5278b5d27de401a78824d45985bc623beb3e3db51dafc37a0532708f3481a6cc3e17ebcd1f0dcbcd0d96d5c0668d5ea25be8300955d9c695b264d1ad7020569df25a721c9593447a3f85b7629e718703c859a92a644f6', // Your API Key
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('Function execution response:', response.data);
    } catch (error) {
        console.error('Error executing function:', error.response ? error.response.data : error.message);
    }
}

// Trigger the function
triggerAppwriteFunction();
