const v1Client = require('./volusion-v1-api');
const v1 = new v1Client({
    apiKey: process.env.V1_API_KEY,
    baseUrl: "http://www.v65.com"
});
jest.setTimeout(15000);

// I know we're supposed to mock, but let's actually call the real API

test('have a V1_API_KEY env variable set', () => {
    expect(process.env.V1_API_KEY).toBeDefined();
})

// --------------------------------------------------------------------
// From New Session to Order Placed ✅
// --------------------------------------------------------------------

let cartId = ''
let customerId = null
let email = 'john.smith-test-' + Math.random().toString(36).substr(2,7) + '@volusion.com'; // random unique name "test-[7 random characters]"

describe('From New Session to Order Placed', function() {
    test('for createCart() the new cart id is returned', async () => {
        cartId = await v1.createCart('sampleproduct3'); // what's our new cart id?
        expect(cartId).toHaveLength(32);
    });

    // optional - - - - - - - - - - - - - - - - - - - - - - - 
    test('for getCart() the cart is returned', async () => {
        const data = await v1.getCart(cartId);
        expect(data).toHaveProperty('data');
    });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    test('for addUser() the user is added', async () => {
        const testAddUserModel = require('./models/User')
        testAddUserModel.email = email;
        const data = await v1.addUser(testAddUserModel);
        expect(data.data).toHaveProperty('id');
        customerId = data.data.id // what's our new customer id?
        console.log(`customerId ${customerId} created ✅`)
    });
    test('for addOrder() the order is added', async () => {
        const testAddOrderModel = require('./models/Order')
        testAddOrderModel.customer.id = customerId;
        testAddOrderModel.customer.emailAddress = email;
        const data = await v1.addOrder(cartId, testAddOrderModel);
        expect(data.data).toHaveProperty('id');
        const orderId = data.data.id // what's our new order id?
        console.log(`orderId ${orderId} created ✅`)
    });
});