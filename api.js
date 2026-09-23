(() => {
  'use strict';
  const examples=window.API_EXAMPLES, select=document.getElementById('api-choice');
  if (!examples || !select) return;
  Object.keys(examples).forEach(path=>{const o=document.createElement('option');o.value=path;o.textContent='GET '+path;select.append(o);});
  function render(){
    const path=select.value,response=examples[path];
    document.getElementById('api-request').textContent='GET '+path;
    document.getElementById('api-response').textContent=JSON.stringify(response,null,2);
    document.getElementById('api-status').textContent=response.error?'Recorded HTTP 422: unsupported filter value.':'Recorded HTTP 200: successful response.';
  }
  select.addEventListener('change',render);document.getElementById('api-example-app').hidden=false;render();
})();
