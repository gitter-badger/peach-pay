/**
 * Modules from the community: package.json
 */
var rp = require('request-promise');
var querystring = require('querystring');

var config = {
    authentication:
    {
        'authentication.userId': null,
        'authentication.password': null,
        'authentication.entityId': null
    },
    options:
    {
        uri: 'https://test.oppwa.com',
        headers:
        {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        json: true
    },
    currency: 'ZAR'
};

/**
 * Constructor
 */
var peach = function (options)
{
    if (!options.userId) throw new Error('Missing userId');
    if (!options.password) throw new Error('Missing password');
    if (!options.entityId) throw new Error('Missing entityId');

    config.authentication['authentication.userId'] = options.userId;
    config.authentication['authentication.password'] = options.password;
    config.authentication['authentication.entityId'] = options.entityId;

    if (options.production !== null && options.production) config.options.uri = 'PRODUCTION';
};

/**
 * Utility
 */
function request(path, method, parameters)
{
    function buildBody(data)
    {
        var obj = {};
        for (var attrname in config.authentication)
        {
            obj[attrname] = config.authentication[attrname];
        }
        for (var attrname in data)
        {
            obj[attrname] = data[attrname];
        }
        return obj;
    }

    var body = buildBody(parameters);

    var options = {};
    for (var attrname in config.options)
    {
        options[attrname] = config.options[attrname];
    }
    options.uri += path;
    options.method = method;
    options.body = querystring.stringify(body);

    return rp(options);
}

/**
 * Methods
 */
var transaction = {
    create: function (paymentId, amount)
    {
        if (!paymentId) throw new Error('Missing paymentId');
        if (!amount) throw new Error('Missing amount');

        var data = {
            'amount': amount,
            'currency': config.currency,
            'paymentType': 'CD',
        }
        var path = '/v1/registrations/' + paymentId + '/payments';

        return request(path, 'POST', data);
    },

    refund: function (transactionId, amount)
    {
        if (!transactionId) throw new Error('Missing transactionId');
        if (!amount) throw new Error('Missing amount');

        var data = {
            'amount': amount,
            'currency': config.currency,
            'paymentType': 'RF',
        }
        var path = '/v1/payments/' + transactionId;

        return request(path, 'POST', data);
    }
};

var card = {
    create: function (data)
    {
        if (!data.name) throw new Error('Missing payer name');
        if (!data.paymentBrand) throw new Error('Missing payment Brand');
        if (!data.ccNumber) throw new Error('Missing card number');
        if (!data.cardExpMonth) throw new Error('Missing card expiry Month');
        if (!data.ccExpYear) throw new Error('Missing card expiry Year');
        if (!data.ccCVV) throw new Error('Missing card cvv');

        var data = {
            'currency': config.currency,
            'paymentBrand': data.paymentBrand,
            'card.number': data.ccNumber,
            'card.holder': data.name,
            'card.expiryMonth': data.cardExpMonth,
            'card.expiryYear': data.ccExpYear,
            'card.cvv': data.ccCVV
        };

        var path = '/v1/registrations';
        return request(path, 'POST', data).then(function (res)
        {
            if (res && res.id) return res.id;
            return Promise.reject(res.result.description);
        });
    }
};

/**
 * Exports
 */
peach.prototype.transaction = transaction;
peach.prototype.card = card;
module.exports = peach;
