const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
class UserInfoScraper {
    async sendRquest(userId) {
        const config = {
            method: 'get',
            url: `https://fdating.com/profile?id=${userId};`,
        };
        try {
            const response = await axios(config);
            const $ = cheerio.load(response.data);
            const users = $('body > div.wrapper > div.container.clearfix > div.main > div > div > div.inner > div > div.description > table > tbody').text()
            const name = $('body > div.wrapper > div.container.clearfix > div.main > div > div > div.inner > div > h4').html().split('\'')[1]
            const bigImageUrl= $("#__SYS_ProfilePhoto").attr('src').split('\/').slice(0,5).join('/')

            let userInfo = users.replace(/\t/g, '').split('\n');

            let photolinks = []
            $('div.main > div > div > div.inner > div > div.user > p')
            .each((index, value) => {
                let photo = ($(value).find('a').attr('href'));
                photolinks.push(photo.match(/pid=(\d+)/)[1])
            })

            const objUser = {
                profile_id: userInfo[2],
                Registered: userInfo[6],
                Updated: userInfo[10],
                last_logged: userInfo[14],
                name: name,
                country: userInfo[24],
                state: userInfo[25],
                city: userInfo[38],
                marital_status: userInfo[48],
                age: userInfo[53],
                zodiac_sign: userInfo[57],
                height: userInfo[61],
                weight: userInfo[65],
                photolinks : photolinks,
                bigImageUrl : bigImageUrl
            }

            return objUser


        } catch (error) {
            console.log(error);
            throw new Error('Sending request Faild in Daily Weather')
        }

    }

    process() {

    }

    save(userInfo) {
        let storedIds = [],
            uniqeIds = []
        const path = `${process.cwd()}/temp/users-info/${userInfo.profile_id}.json`;
        const pathState = `${process.cwd()}/temp/state.json`;
        fs.writeFileSync(path, JSON.stringify(userInfo))
        let scrapedIds = fs.readFileSync(pathState, 'utf-8');
        if (scrapedIds) {
            storedIds = JSON.parse(scrapedIds);
            uniqeIds = [...new Set([...JSON.parse(scrapedIds), userInfo.profile_id])]
        }
        else {
            uniqeIds = [userInfo.profile_id]
        }
        fs.writeFileSync(pathState, JSON.stringify(uniqeIds))
    }
}

module.exports = UserInfoScraper