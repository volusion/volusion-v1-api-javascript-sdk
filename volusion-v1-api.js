const axios = require('axios');
const querystring = require('querystring');

module.exports = class v1Api {

    constructor(config) {
        this.config = config;
    }

    // Carts

    getCart = async function getCart(id, options) {
        return await this.makeV1ApiRequest({method: "GET", url: `/carts/${id}` + otq(options)})
    }

    //*********************************************************
    makeV1ApiRequest = async function makeV1ApiRequest(r) {
        try {
            const { data } = await axios({
                headers: {
                    "Authorization": this.config.apiKey,
                    "Content-Type": "application/json"
                },
                url: this.config.baseUrl + r.url,
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
