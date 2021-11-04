const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
class UsersScraper {
    async sendRquest(page) {
        const gender = 1,
            ageFrom = 18,
            ageTo = 99,
            photo = true;

        const config = {
            method: 'get',
            url: `https://fdating.com/search?do=Search;gender=${gender};ageFrom=${ageFrom};ageTo=${ageTo};photo=${photo};mode=gallery;sort=add;saveAs=;page=${page};`,
        };
        try {
            const response = await axios(config);
            const $ = cheerio.load(response.data);
            // const users = $('body > div.wrapper > div.container.clearfix > div.main > div > div > div.inner > center > ul:nth-child(3)').text();
            let ids = []
            const users = $('body > div.wrapper > div.container.clearfix > div.main > div > div > div.inner > center').find('li')
                .each((index, value) => {
                    let id = ($(value).find('a').attr('href'));
                    ids.push(id.match(/(\d+)/)[0])
                })

            return ids
        } catch (error) {
            console.log(error);
            throw new Error('Sending request Faild in Daily Weather')
        }

    }

    process() {

    }

    save(currentIds) {
        const path = `${process.cwd()}/temp/user-ids.json`;
        for (let userIds of currentIds) {
            let storedIds = [],
            uniqeIds
            if (userIds.status == 'fulfilled') {
                let oldIds = fs.readFileSync(path, 'utf-8');
                if (oldIds) {
                    storedIds = JSON.parse(oldIds);
                    uniqeIds = [...new Set([...JSON.parse(oldIds), ...userIds.value])]
                }
                else {
                    uniqeIds = userIds.value
                }
                fs.writeFileSync(path, JSON.stringify(uniqeIds))
            }
        }

    }
}

module.exports = UsersScraper