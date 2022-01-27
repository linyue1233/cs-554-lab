const userData = require('../data/users');

async function getPersonById() {
    try {
        const peopledata = await userData.createUser("Yue Lin","benchMoon","119160");
        console.log(peopledata);
    } catch (e) {
        console.log(e);
    }
}
getPersonById();
