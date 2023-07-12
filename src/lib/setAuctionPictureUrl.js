const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient()

async function setAuctionPictureUrl(id, pictureUrl) {

    const params = {
         
    }
    const result =  await dynamodb.update(params).promise();
}