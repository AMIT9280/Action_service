const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
const commonMiddleware = require('../lib/commonMiddleware');
const createError =  require('http-errors')

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const {title} = event.body;

  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() + 1)
  const auction = {
    id:uuidv4(),
    title,
    status: 'OPEN',
    createAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid:{
        amount: 0
    }
  }
console.log(process.env.AUCTIONS_TABLE_NAME);
try{
 await dynamodb.put({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auction,
  }).promise();
}catch(error){
  console.error(error);
  throw new createError.InternalServerError(error)
}
  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

//  export const handler = createAuction;
 module.exports.handler = commonMiddleware.handler(createAuction)

