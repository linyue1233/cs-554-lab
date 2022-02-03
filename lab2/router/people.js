const express =require('express');
const router = express.Router();
const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();
const peopleData = require('../data/dummy');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);


router.get("/history",async (req,res)=>{
    client.lrange("peopleList",0,19,(error,historyData)=>{
        if(error){
            res.status(500).json({error:error});
        }else{
            let newArray = [];
            console.log(historyData.length);
            for(let item of historyData){
                newArray.push(JSON.parse(item));
            }
            res.status(200).json(newArray);
            return;
        }
    });
});

router.get("/:id", async (req,res,next)=>{
    const peopleId = req.params.id;
    client.get("people"+peopleId,async(error,cacheData) => {
        if(error) throw error;
        if( cacheData != null ){
            await client.lpush('peopleList',cacheData);
            res.send(cacheData);
            return;
        }else{
            next();
        }
    })
})

router.get("/:id", async (req,res)=>{
    let peolpeId= req.params.id;
    try{
        peopleData.getById(peolpeId).then(async data => {
            res.json(data);
            // store single people
            await client.setAsync('people'+peolpeId,JSON.stringify(data));
            // store into list
            await client.lpush('peopleList',JSON.stringify(data));
            console.log(JSON.stringify(data));
            return;
        }).catch(err => {
            throw err;
        })
    }catch(e){
        res.status(404).json({error: e.message});
        return;
    }
    
})

module.exports = router;