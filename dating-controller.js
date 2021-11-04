const SearchResultScraper = require('./dating-scrapers/search-result-scraper');
const UsersScraper = require('./dating-scrapers/users-scraper');
const UserInfoScraper = require('./dating-scrapers/user-info-scraper');
const fs = require('fs');
const async = require('async');

class DatingContoroller {
    constructor() {
        this.requestPath = './temp/requests.json'
        this.datingSearchResultScraper = new SearchResultScraper()
        this.usersScraper = new UsersScraper()
        this.userInfoScraper = new UserInfoScraper()
    }

    async getSearchResult({ gender, ageFrom, ageTo, photo }) {
        try {
            const searchResult = await this.datingSearchResultScraper.sendRquest({ gender, ageFrom, ageTo, photo })
            this.datingSearchResultScraper.save(searchResult)
        } catch (error) {
            console.log(error.message);
            throw error;
        }


    }

    async getAllUsers(limit) {
        const { PageNumber } = JSON.parse(fs.readFileSync(this.requestPath, 'utf-8'))
        const requests = this.manageRequestOfAllUsers(PageNumber, limit);
        for (const request of requests) {
            let result = await Promise.allSettled(request)
            this.usersScraper.save(result);
        }


    }

    getUsersInfoPerPage(limit) {
        const path = `${process.cwd()}/temp/user-ids.json`
        const pathState = `${process.cwd()}/temp/state.json`
        let userIds = fs.readFileSync(path, 'utf-8');
        let userScraped = fs.readFileSync(pathState, 'utf-8');
        if (userIds) {
            userIds = JSON.parse(userIds)
        }
        if (userScraped) {
            userScraped = JSON.parse(userScraped)
        }
        async.eachLimit(userIds, limit, async (id) => {
            if (!userScraped.includes(id)) {
                let result = await this.userInfoScraper.sendRquest(id)
                this.userInfoScraper.save(result)
            }

        })
    }


    manageRequestOfAllUsers(PageNumber, limit) {
        let limitRequests = [];
        let allRequests = [];
        for (let page = 1; page < +PageNumber; page++) {
            limitRequests.push(this.usersScraper.sendRquest(page))
            if (page % limit == 0) {
                limitRequests = [];
                allRequests.push(limitRequests)
            }

        }
        if (limitRequests) {
            allRequests.push(limitRequests)
        }
        return allRequests
    }
}

module.exports = DatingContoroller