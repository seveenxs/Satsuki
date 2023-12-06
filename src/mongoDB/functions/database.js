const user = require('../schemas/userschema');

function LatencyDB() {
    const timestamp = Date.now();
    user.find();
    return Date.now() - timestamp
}

module["exports"] = {
    LatencyDB
}