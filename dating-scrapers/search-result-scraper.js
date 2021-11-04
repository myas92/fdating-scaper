const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
class SearchResultScraper {
    async sendRquest({gender, ageFrom, ageTo, photo}) {
        const config = {
            method: 'get',
            url: `https://fdating.com/search?gender=${gender};ageFrom=${ageFrom};ageTo=${ageTo};photo=${photo};do=Search;`,
        };
        try {
            const response = await axios(config);
            const $ = cheerio.load(response.data);
            const usersNumber = $('center > div:nth-child(1) > b:nth-child(1)').text();
            const PageNumber = $('center > div:nth-child(1) > b:nth-child(4)').text();
            return { usersNumber, PageNumber }

        } catch (error) {
            console.log(error);
            throw new Error('Sending request Faild in Daily Weather')
        }

    }

    process() {

    }

    save(searchResult) {
        const path = `${process.cwd()}/temp/requests.json`;
        fs.writeFileSync(path, JSON.stringify(searchResult));
    }
}

module.exports = SearchResultScraper