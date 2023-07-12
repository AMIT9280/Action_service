const AWS = require('aws-sdk');
const commonMiddleware = require('../lib/commonMiddleware');
const createError =  require('http-errors')
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctionById(id){
  let auction
  try {
    const results = await dynamodb.get({
     TableName:  process.env.AUCTIONS_TABLE_NAME,
     Key:{id}
    }).promise();
 
    auction = results.Item;
 } catch (error) {
     console.error(error);
     throw new createError.InternalServerError(error)
 }
 
 if(!auction) {
     throw new createError.NotFound(`Auction with ID "${id}" not found`)
 }
 return auction;
}

async function getAuction(event, context) {
const {id} = event.pathParameters;
const auction = await getAuctionById(id)
  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}
 module.exports.handler = commonMiddleware.handler(getAuction)
 module.exports.getAuctionById = commonMiddleware.handler(getAuctionById)

