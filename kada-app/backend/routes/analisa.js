import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Call the Flask server
        const flaskResponse = await axios.get('http://localhost:5001/analisa');
        
        // Return Flask's response to the frontend
        res.status(200).json(flaskResponse.data);
    } catch (error) {
        console.error("Error calling Flask:", error.message);
        res.status(500).json({ message: "Failed to reach Flask server" });
    }
});

export default router;