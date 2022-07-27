import view from './view.js';

const GITHUB_ORG = 'GenesysCloudBlueprints';
const RESULTS_REPO = 'genesyscloud-blueprint-linter-results';
const BLUEPRINTS_INDEX_URL = `https://${GITHUB_ORG}.github.io/${RESULTS_REPO}/blueprints/index.json`;
const BLUEPRINTS_URL = `https://${GITHUB_ORG}.github.io/${RESULTS_REPO}/blueprints/`;
// const BLUEPRINTS_INDEX_URL = `http://localhost:8080/blueprints/index.json`;
// const BLUEPRINTS_URL = `http://localhost:8080/blueprints/`;

function getBlueprints() {
  let blueprintNames = [];

  // Get the index of blueprints
  return fetch(BLUEPRINTS_INDEX_URL)
    .then(response => response.json())
    .then(data => {
      blueprintNames = data;
      const blueprintPromises = [];

      blueprintNames.forEach(blueprint => {
        const blueprintURL = `${BLUEPRINTS_URL}${blueprint}.json`;
        blueprintPromises.push(fetch(blueprintURL).then(response => {
          return response.ok ? response.json() : null;
        }));
        console.log(`Getting ${blueprint} result`);
      });

      return Promise.all(blueprintPromises);
    })
    .then(resultsArr => {
      console.log('Got the blueprint results.')

      let blueprintResults = {};
      blueprintNames.forEach((blueprint, idx) => {
        blueprintResults[blueprint] = resultsArr[idx];
      });

      console.log(blueprintResults);

      return blueprintResults;
    });
}

function init(){
  view.initiate();

  getBlueprints()
  .then(blueprintData => {
    view.fillBlueprintSelector(blueprintData);
  })
}


init();
