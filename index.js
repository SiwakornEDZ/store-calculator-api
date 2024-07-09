const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const prices = {
    "Red set": 50,
    "Green set": 40,
    "Blue set": 30,
    "Yellow set": 50,
    "Pink set": 80,
    "Purple set": 90,
    "Orange set": 120
};

function calculatePrice(orders, memberCard) {
    let total = 0;
    const discounts = { "Orange set": 0.05, "Pink set": 0.05, "Green set": 0.05 };

    for (const item in orders) {
        const quantity = orders[item];
        if (discounts[item]) {
            const bundles = Math.floor(quantity / 2);
            const nonBundleQuantity = quantity % 2;
            total += (bundles * 2 * prices[item] * (1 - discounts[item])) + (nonBundleQuantity * prices[item]);
        } else {
            total += quantity * prices[item];
        }
    }

    if (memberCard) {
        total *= 0.9;
    }

    return Math.round(total * 100) / 100;
}

app.post('/calculate', (req, res) => {
    const { orders, member_card } = req.body;
    const totalPrice = calculatePrice(orders, member_card);
    res.json({ total_price: totalPrice });
});

const port = 5002;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
