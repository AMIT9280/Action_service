const AWS = require('aws-sdk');
const commonMiddleware = require('../lib/commonMiddleware');
const createError =  require('http-errors')
const {getAuctionById} = require('./getAuction');
const validator = require('@middy/validator');
const placeBidSchema = require('../lib/schemas/placeBidSchema');

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
 
const {id} = event.pathParameters;
const {amount} = event.body;
const {email} = event.requestContext.authorizer

const auction = await getAuctionById(id);

// Bid identity validation
if(email === auction.seller){
    throw new createError.Forbidden(`You cannot bid on your own actions!`)
}
//Avoid Double binding 
if(email === auction.highestBid.bidder){
    throw new createError.Forbidden(`You are already the highest bidder!`)
}
//Auction status validation
if(auction.status !== 'OPEN'){
    throw new createError.Forbidden(`You cannot bid on closed auctions!`)
}
//Bid amount validation
if(amount <= auction.highestBid.amount){
    throw new createError.Forbidden(`Your bid higher than ${auction.highestBid.amount}!`)
}

const params ={
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: {id},
    UpdateExpressions: 'set highestBid.amount = :amount, highestBid.bidder = :bidder',
    ExpressionAttributes:{
        ':amount': amount,
        ':bidder': email
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
 .use(validator({inputSchema: placeBidSchema}))

