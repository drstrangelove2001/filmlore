// These API header tokens work only for the sandbox environment, does not apply to live environment.
// Live environment tokens can be provided on demand due to limited number of requests.

const authHeaders = {
    endpoint: "https://api-gate2.movieglu.com",
    client: "<CLIENT_ID>",
    xApiKey: "<X_API_KEY>",
    authorization: "Basic <TOKEN>",
    territory: "XX",
    apiVersion: "v200",
    geolocation: "-22.0;14.0"
};

module.exports = authHeaders;