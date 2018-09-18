module.exports = function (app) {
    require("./auth")(app);
    require("./home")(app);
    require("./api")(app);
};
/*
 * GET home page.
 */


