const middy = require('@middy/core')
const httpErrorHandler = require('@middy/http-error-handler')
const createError = require('http-errors')
const {getAuctionById} = require('./getAuction')
const {uploadPictureToS3} = require('../lib/uploadPictureToS3')
const {setAuctionPictureUrl} =  require('../lib/setAuctionPictureUrl')

async function uploadAuctionPicture (event) {
    const {id} = event.pathParameters;
    const auction = await getAuctionById(id);
    const base64 = event.body.replace(/^data:image\/\W+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');
    
    let updateAuction
    
    try {
        const pictureUrl = await uploadPictureToS3(auction.id + '.jpg', buffer)
        updateAuction = await setAuctionPictureUrl(auction.id,pictureUrl)
        console.log(uploadS3Result);
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error)
    }
    return{
        statusCode:200,
        body: JSON.stringify(updateAuction)
    }
}
module.exports.handler = middy(uploadAuctionPicture)
.use(httpErrorHandler())