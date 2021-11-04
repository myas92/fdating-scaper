const yargs = require('yargs');
const { loader } = require('./loader');

yargs.command({
    command: 'start',
    describe: 'Get List of Users',
    builder: {
        gender: {
            alias : 'g',
            demandOption: false,
            type: 'string',
            describe: 'Age'
        },
        ageFrom: {
            alias : 'f',
            demandOption: false,
            type: 'number',
            describe: 'Age From'
        },
        ageTo: {
            alias : 't',
            demandOption: false,
            type: 'number',
            describe: 'Age To'
        },
        photo: {
            alias : 'p',
            demandOption: false,
            type: 'boolean',
            describe: 'photo'
        },
        limit: {
            alias : 'l',
            demandOption: false,
            type: 'number',
            describe: 'Limit'
        }
    },
    handler: (argv) => {
        loader(argv)
    }
})

yargs.parse()