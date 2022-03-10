const fetch = require('node-fetch');

const sites = [
    'https://dev-react-demo-re01.azurewebsites.net/',
    'https://dev-react-typescript-demo-re01.azurewebsites.net/',
    'https://dev-react-demo-storybook-re01.azurewebsites.net/',
    'https://dev-nodejs-json-server-re01.azurewebsites.net'
];

const run = async (context, eventTimer) => {
    context.log(`${new Date()} Called RunSitesHeartbeat.`);

    await Promise.all(sites.map(async (site) => {
        context.log(`${new Date()} Loading ${site}`);

        await fetch(site).then((result) => {
            context.log(`${new Date()} Completed ${site}`);
        }).catch((error) => {
            context.log(error);
        });
    }));

    context.log(`${new Date()} End RunSitesHeartbeat.`);
};

module.exports.handler = async (context, eventTimer) => {
    run(context, eventTimer)
};