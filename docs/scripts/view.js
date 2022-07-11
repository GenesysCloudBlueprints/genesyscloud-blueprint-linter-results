function showBlueprintResult(blueprintResult){
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
}

export default {
  initiate(){
    let yuriEl = document.getElementById('yuri');
    if(!yuriEl) return;

    yuriEl.addEventListener('click', () => {
      alert('Yuri says "Please fix the errors. I know where you live."');
    });
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
        showBlueprintResult(blueprints[bpName]);
      });

      blueprintSelectorEl.appendChild(btn)
    });
  },
}