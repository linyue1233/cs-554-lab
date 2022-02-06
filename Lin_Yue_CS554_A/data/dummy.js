const axios = require('axios');

async function getAll() {
    const {data} = await axios.get("https://gist.githubusercontent.com/graffixnyc/ed50954f42c3e620f7c294cf9fe772e8/raw/925e36aa8e3d60fef4b3a9d8a16bae503fe7dd82/lab2");
    return data;
}
function getById(id) {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            // find project
            
            const peopleData = await getAll();
            let hasProject = false;
            let project;
            for (let item of peopleData) {
                if (item.id ===  +id) {
                    hasProject = true;
                    project = item;
                }
            }
            if (hasProject) {
                resolve(project);
            } else {
                reject(new Error("something went wrong"));
            }
        },5000);
    });
};

module.exports = {
    firstName: "Yue",
    lastName: "Lin",
    studentId: "10479231",
    getById
};