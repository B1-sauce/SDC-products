const Express = require("express");
const BodyParser = require("body-parser");
const PORT = 3030;
var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.listen(PORT, () => { console.log('Listening to ' + PORT) });