const schema = {
    properties: {
        body:{
            type: 'string',
            minLength: 1,
        },
    },
    required: ['body'],
 };

 module.exports.handler  = schema