(() => {
  'use strict';
  const data=window.ACCESS_SCENARIOS, select=document.getElementById('scenario-choice');
  if (!data || !select) return;
  data.forEach((s,i)=>{const o=document.createElement('option');o.value=i;o.textContent=s.name;select.append(o);});
  function render(){
    const s=data[Number(select.value)];
    document.getElementById('scenario-status').textContent=`${s.selected.length} counties selected for investigation`;
    document.getElementById('scenario-counties').replaceChildren(...s.selected.map(name=>{const li=document.createElement('li');li.textContent=name;return li;}));
    document.getElementById('scenario-change').textContent=`Compared with baseline: added ${s.added.join(', ') || 'none'}; removed ${s.removed.join(', ') || 'none'}.`;
  }
  select.addEventListener('change',render);document.getElementById('scenario-app').hidden=false;render();
})();
