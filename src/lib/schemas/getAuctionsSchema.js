const schema = {

    properties:{
        queryStringParameters:{
            type: 'object',
            properties: {
                status:{
                    type: 'string',
                    enum:  ['OPEN', 'CLOSED'],
                    default: 'OPEN',

                },
            },
        },
    },
    required:[
        'queryStringParameters',
    ]
};

module.exports.handler = schema