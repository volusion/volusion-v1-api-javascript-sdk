const axios = require('axios');
const querystring = require('querystring');
const setCookie = require('set-cookie-parser');
const apiPath = '/api/v1'

module.exports = class v1Api {

    constructor(config) {
        this.config = config;
    }

    createCart = async function createCart(productCode) {
        // we don't have an api endpoint for this yet, so it's a lot of code, sorry!
        const addToCartUrl = this.config.baseUrl + `/shoppingcart.asp?productcode=${productCode}`
        const response = await axios({
            method: "get",
            url: addToCartUrl,
            maxRedirects: 0,
            validateStatus: function(status) {
                return status >= 200 && status < 303;
            },
        });
        const setCookieHeader = response.headers['set-cookie'];
        const cookies = setCookie.parse(setCookieHeader, {
            decodeValues: true,
            map: true
        })
        const cartId = cookies['CartID5'].value
        return cartId;
    }

    getCart = async function getCart(id, options) {
        return await this.makeV1ApiRequest({method: "GET", url: `/carts/${id}` + otq(options)})
    }

    addUser = async function addUser(data) {
        return await this.makeV1ApiRequest({method: "POST", url: `/users`, data: data})
    }

    addOrder = async function addOrder(cartId, data) {
        return await this.makeV1ApiRequest({method: "POST", url: `/orders/${cartId}`, data: data})
    }

    //*********************************************************
    makeV1ApiRequest = async function makeV1ApiRequest(r) {
        try {
            const { data } = await axios({
                headers: {
                    "Authorization": this.config.apiKey,
                    "vMethod": r.method,
                    "Content-Type": "application/json"
                },
                url: this.config.baseUrl + apiPath + r.url,
                method: r.method,
                data: r.data || null
            });
            return data;
        } catch (error) {
            handleError(error);
            throw error;
        }
    }

}

// ----------------------------------------------------
// Helper Functions
// ----------------------------------------------------

function otq(options) {
    
    // turns something like this:
    // {
    //     pageSize: 10,
    //     foo: bar    
    // }
    // into this:
    // "?pageSize=10&foo=bar"

    let qs = querystring.stringify(options);
    if (qs) {
        qs = "?" + qs
    }
    return qs;

}

function handleError(error) {
    if (error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        console.log("error.response.data", error.response.data);
        console.log("error.response.status", error.response.status);
    } else if (error.request) {
        // The request was made but no response was received
        console.log("error.request", error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log("error.message", error.message);
    }
}
