const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const {title} = JSON.parse(event.body);

  const now = new Date();
  const auction = {
    id:uuidv4(),
    title,
    status: 'OPEN',
    createAt: now.toISOString(),
  }
console.log(process.env.AUCTION_TABLE_NAME);
 await dynamodb.put({
      TableName: process.env.AUCTION_TABLE_NAME,
      Item: auction,
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

//  export const handler = createAuction;
 module.exports.handler = createAuction;

