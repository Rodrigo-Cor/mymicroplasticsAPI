function send(status, body) {
    return {
        status,
        body,
    };
};

function get3Element(arr, num) {
    const length = arr.length
    const newArr = []
    if (arr.length <= num) {
        return arr;
    }

    for (let i = 0; i < num; i++) {
        const index = Math.floor(Math.random() * length)
        const element = arr.splice(index, 1)[0];
        newArr.push(element)
    }
    return newArr
};

module.exports = {
    send,
    get3Element
};
