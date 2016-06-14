var Authentication = require('../Autentication/Autentication.js');
var RouterV1 = require('./v1/index.js');


function Router(app) {

    //setup version
    var v1 = new RouterV1().router;
    app.use('/api/v1', Authentication.identify, v1);
}

module.exports = Router;