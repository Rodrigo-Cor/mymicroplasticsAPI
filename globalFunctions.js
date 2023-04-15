module.exports = function send(status, body){
    return {
        status,
        body,
    };
};