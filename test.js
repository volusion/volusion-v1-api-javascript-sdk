const v1Client = require('./volusion-v1-api');
const v1 = new v1Client({
    apiKey: process.env.V1_API_KEY,
    baseUrl: "http://www.v65.com/api/v1"
});

// I know we're supposed to mock, but let's actually call the real API

test('have a V1_API_KEY env variable set', () => {
    expect(process.env.V1_API_KEY).toBeDefined();
})

// --------------------------------------------------------------------
// Carts
// --------------------------------------------------------------------

describe('Carts', function() {
    test('for getCart() the cart is returned', async () => {
        const data = await v1.getCart();
        expect(data).toHaveProperty('data');
    });
});

