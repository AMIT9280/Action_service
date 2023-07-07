const AWS = require('aws-sdk');
const commonMiddleware = require('../lib/commonMiddleware');
const createError =  require('http-errors')

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
let auctions;

try {
    const results = await dynamodb.scan({
        TableName: process.env.AUCTIONS_TABLE_NAME
    }).promise();
    
    auctions = results.Items;
} catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
}

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}
 module.exports.handler = commonMiddleware.handler(getAuctions)

