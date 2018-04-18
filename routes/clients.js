const express = require('express');
const router = express.Router();

/* GET prev client.*/
router.get('/prev', function(req, res, next) {
    let prevClientsStorage = req.app.get('prevClients');
    let prevClient = prevClientsStorage[prevClientsStorage.length-2];
    res.send({ip:prevClient ? prevClient.ip : null});
});

/* GET total clients accessed /prev.*/
router.get('/total', function(req, res, next) {
    let prevClientsStorage = req.app.get('prevClients');
    res.send({total: prevClientsStorage.length});
});

/* GET stats for clients.*/
router.get('/stats', function(req, res, next) {
    let prevClientsStorage = req.app.get('prevClients');
    let clientsStorage = req.app.get('clients');
    let allClientsStorage = clientsStorage.concat(prevClientsStorage);

    let clientsStorageStats = allClientsStorage.reduce((result, element)=>{
        if (result[element.ip]){
            result[element.ip].totalVisits++;
            let urlStats = result[element.ip].urls[element.url];
            if (urlStats){
                urlStats++;
            }
            else{
                urlStats = 1;
            }
            result[element.ip].urls[element.url] = urlStats;
        }
        else {
            let urls = {};
            urls[element.url] = 1;
            result[element.ip] = {
                totalVisits: 1,
                urls
            };
        }
        return result;
    }, {});
    res.send(clientsStorageStats);
});

module.exports = router;