const { createApi } = require('unsplash-js');
const nodeFetch = require("node-fetch");

const unsplashApi = createApi({
    accessKey: "d2uQv6P89gz74EqVaubF9zVK_KQ7SY9e4ip95JmjdYg",
    fetch: nodeFetch,
})

module.exports = unsplashApi;