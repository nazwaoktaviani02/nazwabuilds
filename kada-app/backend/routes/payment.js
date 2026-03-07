import midtransClient from 'midtrans-client';
import dotenv from 'dotenv';
import express from 'express'; 

dotenv.config();
const router = express.Router(); 

const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

// 1. Route to create the payment token
router.post('/token', async (req, res) => {
    try {
        const { amount, first_name, email } = req.body;

        // ✅ DEBUG: log what we received — check this in your backend terminal
        console.log("📦 Payment token request body:", { amount, first_name, email });
        console.log("🔑 Midtrans Server Key loaded:", !!process.env.MIDTRANS_SERVER_KEY);

        const order_id = `ORDER-${Date.now()}`;
        
        const parameter = {
            transaction_details: {
                order_id: order_id,
                gross_amount: Number(amount) 
            },
            customer_details: {
                first_name: first_name || "Customer",
                email: email
            }
        };

        const transaction = await snap.createTransaction(parameter);
        
        res.status(200).json({
            token: transaction.token,
            redirect_url: transaction.redirect_url,
            order_id: order_id
        });
    } catch (error) {
        // ✅ DEBUG: log the full error so we can see exactly what Midtrans says
        console.error("❌ Midtrans token error:", error.message);
        console.error("❌ Full error:", error);
        res.status(500).json({ message: "Failed to create token", error: error.message });
    }
});

// 2. Transaction status
router.get('/status/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        console.log("Checking status for:", orderId);

        const statusResponse = await snap.transaction.status(orderId);
        res.status(200).json(statusResponse);
    } catch (error) {
        console.error("Midtrans Status Error:", error.message);
        res.status(500).json({ message: "Failed to fetch status", error: error.message });
    }
});

export default router;