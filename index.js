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
    "Orange set": 120,
    "Black set": 200
};

function calculatePrice(orders, memberCard) {
    let total = 0;
    const discounts = { "Orange set": 0.05, "Pink set": 0.05, "Green set": 0.05, };
    const discountBlack = {"Black set": 0.2};
    for (const item in orders) {
        const quantity = orders[item];
        if (discounts[item] || discountBlack[item]) {
            if(discounts[item]){
                const bundles = Math.floor(quantity / 2);
                const nonBundleQuantity = quantity % 2;
                total += (bundles * 2 * prices[item] * (1 - discounts[item])) + (nonBundleQuantity * prices[item]);
            }
            else if(discountBlack[item]){
            const bundlesblack = Math.floor(quantity / 3);
            const nonBundleQuantityblack = quantity % 3;
            total += (bundlesblack * 3 * prices[item] * (1 - discountBlack[item])) + (nonBundleQuantityblack * prices[item]);
            // total += (bundles * 2 * prices[item] * (1 - discounts[item])) + (nonBundleQuantity * prices[item]);
            }
        }
        // else if(discountBlack[item]){
                // const bundles = Math.floor(quantity / 3);
                // const nonBundleQuantity = quantity % 3;
                // total += (bundles * 3 * prices[item] * (1 - discountBlack[item])) + (nonBundleQuantity * prices[item]);
        //     }
        else {
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
