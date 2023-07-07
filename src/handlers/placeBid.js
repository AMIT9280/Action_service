const AWS = require('aws-sdk');
const commonMiddleware = require('../lib/commonMiddleware');
const createError =  require('http-errors')
const {getAuctionById} = require('./getAuction');

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
 
const {id} = event.pathParameters;
const {amount} = event.body;

const auction = await getAuctionById(id);

if(amount <= auction.highestBid.amount){
    throw new createError.Forbidden(`Your bid higher than ${auction.highestBid.amount}!`)
}

const params ={
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: {id},
    UpdateExpressions: 'set highestBid.amount = :amount',
    ExpressionAttributes:{
        ':amount': amount,
    },
    ReturnValues: 'ALL_NEW'
};
let updateAuction;

try {
    const results = await dynamodb.update(params).promise();
    updateAuction = results.Attributes;
} catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error)
}
return {
    statusCode: 200,
    body: JSON.stringify(updateAuction),
  };
}
 module.exports.handler = commonMiddleware.handler(placeBid)

