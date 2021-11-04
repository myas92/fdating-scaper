const DatingContorller = require('./dating-controller');
const fs = require('fs');
const datingController = new DatingContorller()
const loader = async ({ gender = 1, ageFrom = 18, ageTo = 99, photo = true, limit = 5 }) => {
    console.log('-----------------');
    console.log(gender);
    console.log(ageFrom);
    console.log(ageTo);
    console.log(photo);
    console.log('-----------------');
    let pages = fs.readFileSync(`${process.cwd()}/temp/requests.json`, 'utf-8');
    if (pages=='')
        await datingController.getSearchResult({ gender, ageFrom, ageTo, photo })
    await datingController.getAllUsers(limit)
    await datingController.getUsersInfoPerPage(limit)

}

//TODO: command this line
let obj = { gender: 1, ageFrom: 18, ageTo: 99, photo: true }
loader(obj)

module.exports = {
    loader
}

