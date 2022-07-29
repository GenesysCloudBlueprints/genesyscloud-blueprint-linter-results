let currentBPshown = '';

function _showBlueprintResult(blueprintResult, bpName){
  showContentSection();
  // History related 
  if(currentBPshown !== bpName){
    history.pushState(bpName, null, `?bp=${bpName}`);
    currentBPshown = bpName
  }

  // Element references
  const resultBodyEl = document.getElementById('result-table-body');
  const timestampEl = document.getElementById('timestamp');
  if(!resultBodyEl || !timestampEl) throw new Error('Missing element');

  // Clear stuff
  resultBodyEl.replaceChildren(); 
  timestampEl.innerText = '';

  if(!blueprintResult) {
    alert('This blueprint does not have any linter results.');
    return;
  }

  // Build a row for each failed cases
  blueprintResult.failed.forEach((failCase, idx) => {

    // Build the file highlights first
    let fileHighlights = '';
    if(failCase.fileHighlights){
      let fileHighlightsArr = failCase.fileHighlights.map(highlight => {
        return `
          <p>
            <strong>${highlight.path} (line: ${highlight.lineNumber})</strong>
            <div class="code-snippet">${highlight.lineContent}</div>
          </p></br>
        `;
      });

      fileHighlights = fileHighlightsArr.join('\n');
    }

    let rowTmpl = `
    <tr>
      <td>${failCase.id}</td>
      <td>❌</td>
      <td>${failCase.description}</td>
      <td>
        ${fileHighlights}
      </td>
    </tr>
    `;
    
    resultBodyEl.innerHTML += rowTmpl;
  });

  // Add timestamp
  timestampEl.innerText = luxon.DateTime.fromISO(blueprintResult.timestamp).toLocaleString(luxon.DateTime.DATETIME_MED) ;

  // Link to Repo and bpname
  const linkToRepoEl = document.getElementById('link-to-repo');
  const bpNameEl = document.getElementById('bpname');
  if(!linkToRepoEl || !bpNameEl) return;

  linkToRepoEl.href = `https://github.com/GenesysCloudBlueprints/${bpName}/`;
  bpNameEl.innerText = bpName;
}

function onFirstEnter(){
  // Easter egg on Yuri
  let yuriEl = document.getElementById('yuri');
  if(!yuriEl) return;

  yuriEl.addEventListener('click', () => {
    alert('Yuri says "Please fix the errors. I know where you live."');
  });

  // Content Section blank
  hideContentSection();
}

function hideContentSection(){
  const contentSectionEl = document.getElementById('content-section');
  if(!contentSectionEl) return;

  contentSectionEl.style.display = 'none';
}

function showContentSection(){
  const contentSectionEl = document.getElementById('content-section');
  const selectNoticeEl = document.getElementById('select-a-blueprint');
  if(!contentSectionEl || !selectNoticeEl) return;

  contentSectionEl.style.display = '';
  selectNoticeEl.style.display = 'none';
}

export default {
  initiate(){
    onFirstEnter();
  },

  /**
   * Fill the left column with blueprint links
   * @param {Object} blueprints blueprint results data 
   */
  fillBlueprintSelector(blueprints){
    if(!blueprints) throw new Error('No blueprints data provided'); 

    const blueprintSelectorEl = document.getElementById('blueprint-selector');

    // Add buttons for each blueprint
    Object.keys(blueprints).forEach(bpName => {
      let btn = document.createElement('button');
      btn.classList.add('button');
      btn.innerText = bpName;
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        _showBlueprintResult(blueprints[bpName], bpName);
      });

      blueprintSelectorEl.appendChild(btn)
    });
  },

  showBlueprintResult(blueprintResult, bpName){
    _showBlueprintResult(blueprintResult, bpName)
  }
}