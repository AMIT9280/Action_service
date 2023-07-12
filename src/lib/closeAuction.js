const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function closeAuction(auction){

        const params ={
            TableName: process.env.AUCTION_TABLE_NAME,
            Key:{id: auction.id},
            UpdateExpression: 'set #status = :status',
            ExpressionAttributeValue:{
                ':status': 'CLOSED',
            },
            ExpressionAttributeNames:{
                '#status': 'status',
            }
        }
}
