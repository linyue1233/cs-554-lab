const { ApolloServer, gql } = require('apollo-server');
const uuid = require("uuid");
const redis = require('redis');
const client = redis.createClient();
const bluebird = require('bluebird');
const axios = require('axios');
const unsplashApi = require('./config/unsplashApi');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);



const typeDefs = gql`
    type Query{
        unsplashImages(pageNum: Int): [ImagePost],
        binnedImages: [ImagePost],
        userPostedImages: [ImagePost],
    }

    type ImagePost{
        id: ID!
        url: String!
        description: String!
        posterName: String!
        userPosted: Boolean!
        binned: Boolean!
    }
    
    type Mutation{
        uploadImage(url: String!, description: String!, posterName: String!): ImagePost 
        updateImage(id: ID!, url: String, posterName: String, description: String, userPosted: Boolean, binned: Boolean): ImagePost
        deleteImage(id: ID!): ImagePost
    }
`;


const resolvers = {
    Query: {
        unsplashImages: async (_, args) => {
            let pageNum = args.pageNum;
            let data = await unsplashApi.photos.list({ page: pageNum, perPage: 15 });
            let results = data.response.results;
            let ans = results.map(e => { return { id: e.id, url: e.urls.raw, posterName: e.user.username, description: e.description == null ? "No description" : e.description, userPosted: false, binned: false } });
            return ans;
        },

        binnedImages: async () => {
            let ans = [];
            let imageBin = await getRes('benchMoonBin');
            for (let item of imageBin) {
                let temp = JSON.parse(item);
                if (temp.binned) {
                    ans.push(temp);
                }
            }
            return ans;
        },

        userPostedImages: async () => {
            let ans = [];
            let imageBin = await getRes('benchMoon');
            for (let item of imageBin) {
                let temp = JSON.parse(item);
                if (temp.userPosted) {
                    ans.push(temp);
                }
            }
            return ans;
        },
    },
    Mutation: {
        uploadImage: async (_, args) => {
            const newImage = {
                id: uuid.v4(),
                url: args.url,
                posterName: args.posterName,
                description: args.description,
                binned: false,
                userPosted: true
            }

            await client.lpush("benchMoon", JSON.stringify(newImage));
            return newImage;
        },
        updateImage: async (_, args) => {
            let oldPost;
            let newPost = { id: args.id, url: args.url, posterName: args.posterName, description: args.description, binned: args.binned, userPosted: args.userPosted };
            let allBinPosts = await getRes('benchMoonBin');
            for (let item of allBinPosts) {
                let temp = JSON.parse(item);
                if (temp.id == args.id) {
                    oldPost = temp;
                    break;
                }
            }
            // from userPost
            if(args.userPosted){
                let allUserPosts = await getRes('benchMoon');
                // delete from bin
                if( oldPost != undefined && !args.binned){
                    await client.lrem('benchMoonBin', 0, JSON.stringify(oldPost));
                }
                // add into bin
                if( oldPost == undefined && args.binned){
                    await client.lpush('benchMoonBin', JSON.stringify(newPost));
                }
                // update userpost key
                for (let index in allUserPosts) {
                    let temp = JSON.parse(allUserPosts[index]);
                    if (temp.id == args.id) {
                        allUserPosts[index] = JSON.stringify(newPost);
                    }
                }
                await client.del('benchMoon');
                for(let item of allUserPosts){
                    client.rpush('benchMoon',item);
                }
            }else{
                // from unsplash site
                if (oldPost == undefined && args.binned) {
                    await client.lpush('benchMoonBin', JSON.stringify(newPost));
                }else if(oldPost != undefined && !args.binned){
                    await client.lrem('benchMoonBin', 0, JSON.stringify(oldPost));
                }
            }
            return newPost;
        },
        deleteImage: async (_, args) => {
            let deletedPost;
            let allPosts = await getRes('benchMoon');
            let allBinPosts = await getRes('benchMoonBin');
            let deletBin;
            for (let item of allPosts) {
                let temp = JSON.parse(item);
                if (temp.id == args.id) {
                    deletedPost = temp;
                    break;
                }
            }
            for (let item of allBinPosts) {
                let temp = JSON.parse(item);
                if (temp.id == args.id) {
                    deletBin = temp;
                    break;
                }
            }
            await client.lrem('benchMoon', 0, JSON.stringify(deletedPost));
            await client.lrem('benchMoonBin', 0, JSON.stringify(deletBin));
            return deletedPost;
        }
    }
}

const getRes = async (redisName) => {
    return await new Promise(resolve => {
        client.lrange(redisName, 0, -1, (error, items) => {
            if (!error) {
                resolve(items);
            } else {
                throw new Error(error);
            }
        });
    });

}

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`????  Server ready at ${url} ????`);
});
