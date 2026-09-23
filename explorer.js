(function () {
  'use strict';
  const data = window.PORTFOLIO_DATA, calc = window.PortfolioMetrics;
  if (!data || !calc) return;
  const $ = id => document.getElementById(id);
  const money = n => n === null ? 'Not defined' : new Intl.NumberFormat('en-US', {style:'currency',currency:'USD'}).format(n);
  const decimal = n => n === null ? 'Not defined' : new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(n);
  const month = value => new Date(value + 'T12:00:00Z').toLocaleDateString('en-US',{month:'short',year:'numeric',timeZone:'UTC'});
  const measures = {
    paid: {label:'Paid spending (USD)',value:r=>r.paid_cents/100,format:money},
    pmpm: {label:'Paid per enrolled member-month (USD)',value:r=>r.paid_per_member_month,format:money},
    claims: {label:'Claim count',value:r=>r.claims,format:decimal},
    rate: {label:'Claims per 1,000 enrolled member-months',value:r=>r.claims_per_1000_member_months,format:decimal}
  };
  const state = {view:'monthly',start:0,end:11,measure:'paid',cohortMeasure:'pmpm',groups:[1,2,3]};
  function node(tag, text, className) {
    const n=document.createElement(tag); if(text!==undefined)n.textContent=text; if(className)n.className=className; return n;
  }
  function kpis(target, entries) {
    target.replaceChildren(...entries.map(([label,value])=>{
      const n=node('div',undefined,'kpi');n.append(node('span',label),node('strong',value));return n;
    }));
  }
  function chart(target, rows, measure, labels, colors=[]) {
    const max=Math.max(0,...rows.map(measure.value).filter(v=>v!==null));
    target.replaceChildren(...rows.map((row,i)=>{
      const value=measure.value(row),item=node('div',undefined,'chart-row');
      const label=node('span',labels[i],'chart-label');
      const track=node('div',undefined,'chart-track');track.setAttribute('aria-hidden','true');
      const bar=node('div',undefined,'chart-bar');bar.style.width=(max && value!==null?value/max*100:0)+'%';
      if(colors[i])bar.classList.add(colors[i]);track.append(bar);
      item.append(label,track,node('strong',measure.format(value),'chart-value'));return item;
    }));
  }
  function table(target, caption, headers, rows) {
    const t=node('table');t.append(node('caption',caption));const head=node('thead'),hr=node('tr');
    headers.forEach(h=>{const th=node('th',h);th.scope='col';hr.append(th);});head.append(hr);t.append(head);
    const body=node('tbody');rows.forEach(row=>{const tr=node('tr');row.forEach((v,i)=>{const cell=node(i?'td':'th',String(v));if(!i)cell.scope='row';tr.append(cell);});body.append(tr);});t.append(body);target.replaceChildren(t);
  }
  function updateUrl() {
    try {
      const u=new URL(location.href);u.search='';u.searchParams.set('view',state.view);
      if(state.view==='monthly'){u.searchParams.set('from',String(state.start+1));u.searchParams.set('to',String(state.end+1));u.searchParams.set('measure',state.measure);}
      if(state.view==='cohorts')u.searchParams.set('measure',state.cohortMeasure);
      if(state.view==='join')u.searchParams.set('groups',state.groups.join(','));
      history.replaceState(null,'',u);
    } catch (_) { /* Direct-file browsers may restrict history; the explorer still works. */ }
  }
  function renderMonthly() {
    const valid=state.start<=state.end;
    $('period-error').hidden=valid;
    $('period-error').textContent=valid?'':'Choose a start month on or before the end month.';
    $('start-month').setAttribute('aria-invalid',String(!valid));$('end-month').setAttribute('aria-invalid',String(!valid));
    $('download-selection').disabled=!valid;
    if(!valid){$('monthly-kpis').replaceChildren();$('monthly-chart').replaceChildren();$('monthly-table').replaceChildren();$('monthly-caption').textContent='No results for an invalid period.';$('period-status').textContent='Adjust the selected period to see results.';return;}
    const rows=calc.selectMonths(data.monthly,state.start,state.end),total=calc.summarize(rows),measure=measures[state.measure];
    $('period-status').textContent=`${month(rows[0].month)} – ${month(rows[rows.length-1].month)} · ${rows.length} months · ${total.claims} claims · ${total.member_months} enrolled member-months`;
    kpis($('monthly-kpis'),[['Paid spending',money(total.paid_cents/100)],['Paid / member-month',money(total.paid_per_member_month)],['Claims / 1,000 member-months',decimal(total.claims_per_1000_member_months)]]);
    $('monthly-caption').textContent=measure.label;
    chart($('monthly-chart'),rows,measure,rows.map(r=>month(r.month)));
    table($('monthly-table'),'Selected monthly source values',['Month','Member-months','Claims','Paid (USD)','Paid / member-month','Claims / 1,000 member-months'],rows.map(r=>[month(r.month),r.member_months,r.claims,money(r.paid_cents/100),money(r.paid_per_member_month),decimal(r.claims_per_1000_member_months)]));
  }
  function renderCohorts() {
    const measure=measures[state.cohortMeasure];$('cohort-caption').textContent=measure.label;
    chart($('cohort-chart'),data.cohorts,measure,data.cohorts.map(r=>r.cohort));
    table($('cohort-table'),'Full-year age-cohort source values',['Age cohort','Members','Member-months','Claims','Paid (USD)','Paid / member-month'],data.cohorts.map(r=>[r.cohort,r.members,r.member_months,r.claims,money(r.paid_cents/100),money(r.paid_per_member_month)]));
  }
  function renderJoin() {
    const s=calc.summarizeJoin(data.join_groups,state.groups);
    $('join-status').textContent=s.rows.length?`${s.claims} claims selected · ${state.groups.length} line-count ${state.groups.length===1?'group':'groups'}`:'No claim groups selected. Choose at least one group to compare totals.';
    kpis($('join-kpis'),[['Correct total',money(s.paid_cents/100)],['Overstatement',money(s.difference_cents/100)],['Overstatement rate',s.overstatement===null?'Not defined':decimal(s.overstatement)+'%']]);
    chart($('join-chart'),[{paid_cents:s.joined_paid_cents},{paid_cents:s.paid_cents}],measures.paid,['Incorrect join','Correct total'],['incorrect','']);
    table($('join-table'),'Claim groups and repeated header payments',['Lines / claim','Claims','Correct paid','Incorrect joined paid'],s.rows.map(r=>[r.lines_per_claim,r.claims,money(r.paid_cents/100),money(r.joined_paid_cents/100)]));
  }
  function render() {
    document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===state.view)));
    for(const view of ['monthly','cohorts','join'])$(view+'-panel').hidden=state.view!==view;
    if(state.view==='monthly')renderMonthly();else if(state.view==='cohorts')renderCohorts();else renderJoin();
    updateUrl();
  }
  for(const r of data.monthly){for(const id of ['start-month','end-month']){const o=node('option',month(r.month));o.value=String(data.monthly.indexOf(r));$(id).append(o);}}
  const query=new URLSearchParams(location.search);
  if(['monthly','cohorts','join'].includes(query.get('view')))state.view=query.get('view');
  const readMonth=(key,fallback)=>{const raw=query.get(key),n=Number(raw);return raw!==null&&Number.isInteger(n)&&n>=1&&n<=12?n-1:fallback;};
  state.start=readMonth('from',0);state.end=readMonth('to',11);
  if(Object.hasOwn(measures,query.get('measure'))){if(state.view==='cohorts'&&query.get('measure')!=='claims')state.cohortMeasure=query.get('measure');else state.measure=query.get('measure');}
  if(query.has('groups')){const raw=query.get('groups');const groups=raw===''?[]:raw.split(',').map(Number);if(groups.every(n=>[1,2,3].includes(n)))state.groups=[...new Set(groups)].sort();}
  function syncControls(){ $('start-month').value=String(state.start);$('end-month').value=String(state.end);$('measure').value=state.measure;$('cohort-measure').value=state.cohortMeasure;document.querySelectorAll('[name="line-group"]').forEach(c=>c.checked=state.groups.includes(Number(c.value))); }
  document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{state.view=b.dataset.view;render();}));
  for(const [id,key] of [['start-month','start'],['end-month','end'],['measure','measure'],['cohort-measure','cohortMeasure']])$(id).addEventListener('change',()=>{state[key]=key==='start'||key==='end'?Number($(id).value):$(id).value;render();});
  $('reset-period').addEventListener('click',()=>{state.start=0;state.end=11;syncControls();render();});
  document.querySelectorAll('[name="line-group"]').forEach(c=>c.addEventListener('change',()=>{state.groups=[...document.querySelectorAll('[name="line-group"]:checked')].map(c=>Number(c.value));render();}));
  $('download-selection').addEventListener('click',()=>{
    const rows=calc.selectMonths(data.monthly,state.start,state.end),keys=Object.keys(rows[0]);
    const csv=[keys.join(','),...rows.map(r=>keys.map(k=>r[k]).join(','))].join('\r\n')+'\r\n';
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=node('a');a.href=url;a.download=`synthetic-monthly-${state.start+1}-${state.end+1}.csv`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  syncControls();$('explorer-app').hidden=false;render();
  if(document.modelContext?.registerTool){
    const controller=new AbortController();
    const tool={name:'configure_claims_explorer',title:'Configure synthetic claims explorer',description:'Select the visible analysis view and its filters. Changes only this page; does not change source data or download files.',annotations:{readOnlyHint:false,untrustedContentHint:false},inputSchema:{type:'object',properties:{view:{type:'string',enum:['monthly','cohorts','join']},fromMonth:{type:'integer',minimum:1,maximum:12},throughMonth:{type:'integer',minimum:1,maximum:12},measure:{type:'string',enum:['paid','pmpm','claims','rate']},lineGroups:{type:'array',items:{type:'integer',enum:[1,2,3]},uniqueItems:true}},required:['view'],additionalProperties:false},execute(input){
      if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(k=>!['view','fromMonth','throughMonth','measure','lineGroups'].includes(k))||!['monthly','cohorts','join'].includes(input.view))throw new Error('Invalid explorer configuration.');
      const next={...state,groups:[...state.groups],view:input.view};
      for(const [key,target] of [['fromMonth','start'],['throughMonth','end']])if(input[key]!==undefined){if(!Number.isInteger(input[key])||input[key]<1||input[key]>12)throw new Error('Months must be integers from 1 to 12.');next[target]=input[key]-1;}
      if(next.start>next.end)throw new Error('Start month must not follow end month.');
      if(input.measure!==undefined){if(!Object.hasOwn(measures,input.measure)||(next.view==='cohorts'&&input.measure==='claims'))throw new Error('Unsupported measure for this view.');next[next.view==='cohorts'?'cohortMeasure':'measure']=input.measure;}
      if(input.lineGroups!==undefined){if(!Array.isArray(input.lineGroups)||input.lineGroups.some(n=>![1,2,3].includes(n))||new Set(input.lineGroups).size!==input.lineGroups.length)throw new Error('Invalid line groups.');next.groups=[...input.lineGroups].sort();}
      Object.assign(state,next);syncControls();render();
      return {view:state.view,fromMonth:state.start+1,throughMonth:state.end+1,measure:state.view==='cohorts'?state.cohortMeasure:state.measure,lineGroups:[...state.groups],summary:state.view==='monthly'?calc.summarize(calc.selectMonths(data.monthly,state.start,state.end)):state.view==='join'?calc.summarizeJoin(data.join_groups,state.groups):data.cohorts};
    }};
    try{Promise.resolve(document.modelContext.registerTool(tool,{signal:controller.signal})).catch(()=>{});}catch(_){}
    window.addEventListener('pagehide',()=>controller.abort(),{once:true});
  }
})();
