const {getEndedAuctions} =  require('../lib/getEndedAuctions')

async function processAuction(event,context){
    const auctionsToClose = await getEndedAuctions();
    console.log(auctionsToClose);
}

module.exports.handler = processAuction