const userData = require('../data/users');
const blogData = require('../data/blogs');

async function getPersonById() {
    let person = {
        _id: "61f2002c9af7c91b2b0b33f7",
        username: "benchMoon"
    }
    try {
        const peopledata = await blogData.createBlog("My experience Teaching JavaScript","This is the blog post body.. here is the actually blog post content.. blah blah blah.....",person);
        
        console.log(peopledata);
    } catch (e) {
        console.log(e);
    }
}
getPersonById();
