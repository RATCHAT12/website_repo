require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post('/create-order', async (req, res) => {
    const orderOptions = {
        amount: 100,  // amount in the smallest currency unit (100 paise = 1 INR)
        currency: 'INR',
        receipt: 'receipt#1'
    };
    try {
        const order = await razorpay.orders.create(orderOptions);
        res.json({ id: order.id, amount: order.amount, key: process.env.RAZORPAY_KEY_ID });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
    }
});

app.post('/verify-payment', (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    const generated_signature = razorpay.utils.hmac_sha256(`${razorpay_order_id}|${razorpay_payment_id}`, process.env.RAZORPAY_KEY_SECRET);

    if (generated_signature === razorpay_signature) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.get('/download', (req, res) => {
    const filePath = path.join(__dirname, process.env.PDF_PATH);
    res.download(filePath);
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
