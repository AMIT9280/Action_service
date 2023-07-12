const AWS = require('aws-sdk');
const createError =  require('http-errors')
const validator = require('@middy/validator');
const commonMiddleware = require('../lib/commonMiddleware');
const getAuctionSchema = require('../lib/schemas/getAuctionsSchema');


const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  const {status} = event.queryStringParameters;
let auctions;

const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeValues: {
        ':status': status,
    },
    ExpressionAttributeNames: {
      '#status': status
    }
}

try {
    const results = await dynamodb.query(params).promise();
    
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
 .use(validator({inputSchema: getAuctionSchema, useDefaults: true}))

