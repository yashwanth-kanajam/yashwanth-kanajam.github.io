(() => {
  'use strict';
  const examples=window.API_EXAMPLES, select=document.getElementById('api-choice');
  if (!examples || !select) return;
  Object.keys(examples).forEach(path=>{const o=document.createElement('option');o.value=path;o.textContent='GET '+path;select.append(o);});
  const summaries={
    '/health':'Service status, confirming that the API and its packaged results are available.',
    '/quality/summary':'Validation test results for four checks (duplicates, broken links, date order and payment reconciliation), with flagged rows, false alarms, misses, precision and recall.',
    '/spending/summary':'Validated paid total ($15,905.27, as 1,590,527 cents), claims, members, member-months and rates, plus the inflated total from the incorrect join and the overstatement.',
    '/access/counties/25011':'Franklin County: population, physician count and rate per 100,000, poverty and age-65+ shares, and whether it was shortlisted.',
    '/access/counties?selection=invalid':'Unsupported filter values return HTTP 422 with an error code and a short message.'
  };
  function render(){
    const path=select.value,response=examples[path];
    document.getElementById('api-request').textContent='GET '+path;
    document.getElementById('api-summary').textContent=summaries[path]||'';
    document.getElementById('api-response').textContent=JSON.stringify(response,null,2);
    document.getElementById('api-status').textContent=response.error?'Recorded HTTP 422: unsupported filter value.':'Recorded response: HTTP 200.';
  }
  select.addEventListener('change',render);document.getElementById('api-example-app').hidden=false;render();
})();
