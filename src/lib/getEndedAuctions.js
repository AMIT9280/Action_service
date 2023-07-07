const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getEndedAuctions(){
    const now = new Date();
    const params= { 
        TableName: process.env.AUCTION_TABLE_NAME,
        
    }
}
