'use strict';
const $ = id => document.getElementById(id);
const E = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const N = n => new Intl.NumberFormat('fa-IR',{maximumFractionDigits:3}).format(n);
const D = (d,short=false) => new Intl.DateTimeFormat('fa-IR',{day:'numeric',month:short?'short':'long',...(short?{}:{year:'numeric'}),timeZone:'UTC'}).format(new Date(d+'T12:00:00Z'));
const today = new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tehran'}).format(new Date());
const offset = (d,i) => new Date(Date.parse(d+'T12:00:00Z')+i*86400000).toISOString().slice(0,10);
const branches = {tanje:'طنجه مدیترانه‌ای',termeh:'ترمه و طاووس',tash:'تش کباب'};
const locations = {central:'انبار مرکزی',...branches};
const sources = {
  tanje:['https://tanjee.tanjegroup.com/main/','https://gashtook.com/isfahan/restaurant/رستوران-مدیترانه-ای-طنجه-اصفهان'],
  termeh:['https://menu.termehtavoos.ir/main/','https://wanderlog.com/fa/place/details/9633408/ترمه-و-طاووس'],
  tash:['https://tashkebab.tanjegroup.com/','https://myrivan.com/13401']
};
const material = {
  lamb:['گوشت گوسفندی','کیلوگرم','پروتئین',960000,6],
  chicken:['مرغ','کیلوگرم','پروتئین',195000,8],
  fish:['ماهی شوریده','کیلوگرم','پروتئین',420000,3],
  rice:['برنج ایرانی','کیلوگرم','خشکبار',240000,10],
  chickpea:['نخود','کیلوگرم','خشکبار',135000,4],
  tomato:['گوجه‌فرنگی','کیلوگرم','صیفی‌جات',38000,5],
  eggplant:['بادمجان','کیلوگرم','صیفی‌جات',46000,4],
  yogurt:['ماست','کیلوگرم','لبنیات',110000,4],
  oil:['روغن','لیتر','مواد مصرفی',120000,3],
  bread:['نان پیتا','عدد','نان',18000,15]
};
const salesTypes=['کارت‌خوان','نقدی','آنلاین'];
const category=['غذای اصلی','پیش‌غذا','سالاد','دسر'];
const defaults = {
  tanje:[
    ['کادیش کباب',0,890000,{lamb:.22,eggplant:.08,tomato:.08,bread:1}],
    ['حمص فلافل',1,290000,{chickpea:.14,oil:.02,bread:1}],
    ['محامارا',1,315000,{}],['نان زعتر',1,185000,{bread:1,oil:.01}],
    ['ران درباری',0,1390000,{lamb:.3,rice:.15}],['سمکه المشوی',0,1020000,{fish:.32,oil:.02}],
    ['سالاد مخصوص طنجه',2,270000,{}],['خوراک مخصوص طنجه',0,990000,{}],
    ['پنیر مزه‌دار با نان پیتا',1,260000,{}]
  ],
  termeh:[['کباب برگ',0,1050000,{lamb:.23,rice:.16,tomato:.08}],['خورشت ماست',3,270000,{yogurt:.17,lamb:.025}]],
  tash:[['چلوکباب کوبیده',0,470000,{lamb:.18,rice:.16,tomato:.08},true],['جوجه‌کباب',0,420000,{chicken:.22,rice:.16,tomato:.08},true]]
};
const stockKeys=Object.keys(material), branchKeys=Object.keys(branches);
const byDate=(a,b)=>b.date.localeCompare(a.date);
const sum=(xs,fn)=>xs.reduce((t,x)=>t+fn(x),0);
const round=n=>Math.round(n*1e6)/1e6;
const legacyKey='tanje-operations-1', presentationKey='tanje-presentation-demo-1';
let key=legacyKey, storageIssue='', saving=false, periodStart=offset(today,-6);
try{if(new URLSearchParams(location.search).has('presentation'))key=presentationKey}catch{}
function seed(){
  const menu=Object.fromEntries(branchKeys.map(b=>[b,defaults[b].map(([name,cat,price,recipe],i)=>({id:b+(i+1),name,cat,price,recipe:{...recipe},demo:true}))]));
  const opening=Object.fromEntries(Object.keys(locations).map(loc=>[loc,Object.fromEntries(stockKeys.map((m,i)=>[m,m==='bread'?160:(loc==='central'?90:30)+i*4]))]));
  const records=[], purchases=[];
  const add=(type,b,date,rest)=>records.push({id:'sample-'+(records.length+1),type,b,date,sample:true,...rest});
  for(const [j,b] of branchKeys.entries()){
    const id='sample-po-'+b;
    purchases.push({id,b,date:offset(today,-2),m:'lamb',qty:10,price:material.lamb[3],supplier:'تأمین‌کننده نمونه',ref:'خرید-نمونه-'+b,status:'received',sample:true});
    add('receive',b,offset(today,-2),{m:'lamb',ordered:10,qty:10,price:material.lamb[3],budget:10*material.lamb[3],other:0,ref:'رسید-'+b,purchaseId:id,note:'دریافت نمونه مرتبط با سفارش خرید'});
    add('move',b,offset(today,-2),{m:'lamb',qty:8,ref:'حواله-'+b,note:'پخش نمونه به '+branches[b]});
    for(let d=-6;d<=0;d++){
      const item=menu[b].find(x=>Object.keys(x.recipe).length);
      add('sale',b,offset(today,d),{item:item.id,name:item.name,cat:item.cat,qty:3+j,price:item.price,recipe:{...item.recipe},method:salesTypes[j],ref:'فروش-'+b+'-'+d});
    }
    add('waste',b,today,{m:'lamb',qty:.3,use:'دورریز',note:'افت آماده‌سازی نمونه؛ کسر مستقل از فروش'});
    add('waste',b,today,{m:'rice',qty:.5,use:'غذای پرسنلی',note:'مصرف مستقیم مواد برای غذای پرسنلی نمونه'});
    const expected=balance({opening,records},b,today).lamb;
    add('count',b,today,{m:'lamb',qty:round(expected-.2),expected,staff:5,note:'شمارش نمونه؛ مغایرت فقط گزارش می‌شود'});
    purchases.push({id:'pending-'+b,b,date:today,m:'rice',qty:12,price:material.rice[3],supplier:'تأمین‌کننده نمونه',ref:'درخواست-'+b,status:'submitted',sample:true});
  }
  return {schema:2,sample:true,openingDate:offset(today,-7),menu,opening,records,purchases,activity:[]};
}
function balance(state,b,day){
  const result=Object.fromEntries(Object.entries(state.opening[b]).map(([m,q])=>[m,state.openingDate&&day<state.openingDate?0:q]));
  for(const x of state.records){
    if(x.date>day)continue;
    if(x.type==='receive'&&b==='central')result[x.m]+=x.qty;
    if(x.type==='move'&&b==='central')result[x.m]-=x.qty;
    if(x.b!==b)continue;
    if(x.type==='move')result[x.m]+=x.qty;
    if(x.type==='waste')result[x.m]-=x.qty;
    if(x.type==='sale')for(const [m,v] of Object.entries(x.recipe))result[m]-=v*x.qty;
  }
  return Object.fromEntries(Object.entries(result).map(([m,v])=>[m,round(v)]));
}
function validateState(state){
  verify(state&&typeof state==='object'&&Array.isArray(state.records)&&state.menu&&state.opening,'ساختار داده ذخیره‌شده قابل خواندن نیست.');
  for(const loc of Object.keys(locations))verify(state.opening[loc]&&stockKeys.every(m=>Number.isFinite(state.opening[loc][m])),'موجودی افتتاحیه ناقص است.');
  for(const branch of branchKeys)verify(Array.isArray(state.menu[branch])&&state.menu[branch].every(x=>x&&typeof x.name==='string'&&x.recipe&&typeof x.recipe==='object'),'ساختار منو معتبر نیست.');
  for(const x of state.records){verify(x&&branchKeys.includes(x.b)&&/^\d{4}-\d{2}-\d{2}$/.test(x.date)&&['sale','receive','move','waste','count'].includes(x.type),'یک گردش ذخیره‌شده معتبر نیست.');verify(Number.isFinite(x.qty)&&x.qty>=0,'مقدار گردش معتبر نیست.');if(x.type==='sale')verify(x.recipe&&Number.isFinite(x.price)&&x.price>=0&&Object.entries(x.recipe).every(([m,q])=>(material[m]||state.custom?.[m])&&Number.isFinite(q)&&q>=0),'ماده یا مقدار دستور و قیمت فروش معتبر نیست.');else {verify(material[x.m]||state.custom?.[x.m],'ماده گردش شناخته نشد.');if(x.type==='receive')verify(['price','ordered','budget','other'].every(k=>Number.isFinite(x[k])&&x[k]>=0),'مبلغ رسید معتبر نیست.');}}
  verify(!state.purchases||Array.isArray(state.purchases),'فهرست خرید ذخیره‌شده معتبر نیست.');
  return state;
}
function loadState(){try{const raw=localStorage.getItem(key);return raw?validateState(JSON.parse(raw)):seed()}catch{storageIssue='داده ذخیره‌شده خوانده نشد؛ اصل آن حفظ شده است. پیش از ادامه خروجی پشتیبان بگیرید یا فضای ارائه مستقل را باز کنید.';return seed()}}
let data=loadState(), b='tanje', day=today, view='overview', search='', sort='recent';
const views={overview:['داشبورد','grid'],inventory:['انبار و خرید','box'],distribution:['پخش مواد','truck'],menu:['منو و پورشن','plate'],cash:['صندوق روزانه','wallet'],audit:['مغایرت‌ها','alert'],waste:['پرتی و غذای پرسنلی','leaf'],report:['گزارش کارفرما','report']};
const paths={
 grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
 box:'<path d="M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4m-9 4v10M7 5l9 4"/>',
 truck:'<path d="M3 5h12v12H3zM15 9h4l3 4v4h-7"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
 plate:'<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="4"/><path d="M2 4v16m20-16v16"/>',
 wallet:'<path d="M3 6h16v4m1 0h-5a2 2 0 0 0 0 4h5m0-4h1v4h-1m0 0v5H3V6l13-3 1 3"/>',
 alert:'<path d="M12 3L2 21h20zM12 9v5m0 3v.1"/>',
 leaf:'<path d="M20 4c-8-1-15 2-15 8a6 6 0 0 0 6 6c6 0 9-7 9-14ZM3 21 15 9"/>',
 report:'<path d="M5 3h10l4 4v14H5zM14 3v5h5M8 12h8m-8 4h8"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v5m10-5v5M3 10h18"/>',
 bell:'<path d="M5 16h14l-2-3V9a5 5 0 0 0-10 0v4zM10 20h4"/>',
 plus:'<path d="M12 5v14M5 12h14"/>', arrow:'<path d="M19 12H5m6-6-6 6 6 6"/>',
 menu:'<path d="M4 6h16M4 12h16M4 18h16"/>', close:'<path d="m6 6 12 12M18 6 6 18"/>',
 check:'<path d="m4 12 5 5L20 6"/>', trend:'<path d="m3 17 6-6 4 4 8-9m-5 0h5v5"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
 mark:'<path d="M4 21v-9c0-4 5-6 8-10 3 4 8 6 8 10v9M8 21v-8c0-3 2-4 4-6 2 2 4 3 4 6v8M4 21h16m-8-8v8"/>',
 download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>'
};
const I=(icon,size=17)=>`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[icon]||''}</svg>`;
const btn=(label,action,kind='',icon='')=>`<button type="button" class="btn ${kind}" data-act="${E(action)}">${icon?I(icon,15):''}${E(label)}</button>`;
const badge=(s,kind='')=>`<span class="badge ${kind}">${E(s)}</span>`;
const unit=(m,q)=>N(q)+' '+material[m][1];
const money=x=>N(x)+' تومان';
const ref=x=>E(x.ref||'—');
const inPeriod=x=>x.date>=periodStart&&x.date<=day;
const rec=(type,date)=>data.records.filter(x=>x.b===b&&x.type===type&&!x.supersededBy&&(date?x.date===date:inPeriod(x)));
const referenceCost=x=>x.qty*material[x.m][3];
const recipeCost=x=>sum(Object.entries(x.recipe||{}),([m,q])=>material[m]?q*x.qty*material[m][3]:0);
const purchaseList=()=> (data.purchases||[]).filter(x=>x.b===b&&inPeriod(x));
const metrics=(branch=b)=>{const rows=data.records.filter(x=>x.b===branch&&inPeriod(x)),sales=rows.filter(x=>x.type==='sale'), waste=rows.filter(x=>x.type==='waste');return {sales:gross(sales),cost:sum(sales,recipeCost),purchase:sum(rows.filter(x=>x.type==='receive'),x=>x.qty*x.price),waste:sum(waste.filter(x=>x.use==='دورریز'),referenceCost),staff:sum(waste.filter(x=>x.use==='غذای پرسنلی'),referenceCost),inventory:sum(Object.entries(balance(data,branch,day)),([m,q])=>q*material[m][3]),low:stockKeys.filter(m=>balance(data,branch,day)[m]<material[m][4]).length,pending:(data.purchases||[]).filter(x=>x.b===branch&&inPeriod(x)&&['draft','submitted','reviewed'].includes(x.status)).length};};
const gross=items=>sum(items,x=>x.qty*x.price);
const purchaseGap=x=>x.budget-x.qty*x.price-x.other;
const missingQty=x=>round(x.ordered-x.qty);
const counts=(date)=>rec('count',date).map(x=>{
  const expected=x.expected??balance(data,b,x.date)[x.m],delta=round(x.qty-expected);
  return {...x,expected,delta,value:Math.round(Math.abs(delta)*material[x.m][3])};
});
function table(headers,rows,empty='برای این تاریخ رکوردی ثبت نشده است.'){
  if(!rows.length)return `<div class="empty">${E(empty)}</div>`;
  return `<div class="table-wrap"><table><thead><tr>${headers.map(t=>`<th scope="col">${E(t)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(cell=>`<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
const card=(title,sub,body,action='')=>`<section class="card"><div class="card-head"><div><h2>${E(title)}</h2>${sub?`<p>${E(sub)}</p>`:''}</div>${action}</div><div class="card-body">${body}</div></section>`;
const info=t=>`<div class="info">${E(t)}</div>`;
const head=(title,sub,actions='')=>`<div class="page-head"><div><small>${E(branches[b])} · ${D(day)}</small><h1>${E(title)}</h1><p>${E(sub)}</p></div><div class="actions">${actions}</div></div>`;
const stat=(label,value,measure,sub,icon,kind='')=>`<article><div class="stat-top">${E(label)}<span class="${kind}">${I(icon)}</span></div><strong class="stat-val">${E(value)}<small>${E(measure)}</small></strong><div class="stat-sub">${E(sub)}</div></article>`;
const statRow=(...items)=>`<div class="stats">${items.join('')}</div>`;
function chart(){
  const chartStart=periodStart>offset(day,-6)?periodStart:offset(day,-6);
  const series=Array.from({length:7},(_,i)=>offset(day,-6+i)).filter(d=>d>=chartStart).map(d=>[d,gross(rec('sale',d))]);
  const max=Math.max(1,...series.map(x=>x[1]));
  return `<div class="legend">فروش ثبت‌شده · میلیون تومان</div><div class="chart" aria-label="فروش روزانه در حداکثر هفت روز پایانی بازه">${series.map(([d,v])=>`<div class="barcol"><span>${N(Math.round(v/100000)/10)}</span><i class="bar" style="height:${v/max*95}px"></i><span>${D(d,true)}</span></div>`).join('')}</div>`;
}
function note(title,sub,kind,icon='alert'){
  return `<div class="notice"><span class="notice-icon ${kind==='bad'?'red':''}">${I(icon,16)}</span><div><h3>${E(title)}</h3><p>${E(sub)}</p></div>${badge(kind==='bad'?'نیاز به بررسی':'ثبت شد',kind)}</div>`;
}
function alerts(){
  return [...rec('receive').filter(x=>purchaseGap(x)||missingQty(x)).map(x=>note('تطبیق خرید '+material[x.m][0],(purchaseGap(x)?money(Math.abs(purchaseGap(x)))+(purchaseGap(x)>0?' بودجه تسویه‌نشده':' بالاتر از بودجه')+' · ':'')+(missingQty(x)?unit(x.m,Math.abs(missingQty(x)))+(missingQty(x)>0?' کسری تحویل':' مازاد تحویل'):'بررسی اسناد خرید'),'bad')),
    ...counts().filter(x=>x.delta).map(x=>note('مغایرت موجودی '+material[x.m][0],unit(x.m,Math.abs(x.delta))+(x.delta<0?' کسری در شمارش':' مازاد در شمارش'),'bad'))];
}
function overview(){
  const m=metrics(), issues=alerts();
  return `<section class="hero"><div class="hero-content"><div class="eyebrow"><span class="dot"></span> نمونه قابل اجرای مدیریت عملیات</div><h1>هر تصمیم، پشتوانه یک گردش</h1><p>خرید، موجودی و مصرف شعبه را کنار فروش ببینید؛ اختلاف‌ها را پیش از جمع‌بندی روز پیدا کنید.</p><div class="hero-buttons">${btn('سناریوی پنج‌دقیقه‌ای','go:presentation','amber','arrow')}${btn('درخواست خرید','new:purchase','ghost','plus')}</div></div><div class="hero-summary"><span>شعبه انتخابی</span><strong>${E(branches[b])}</strong><small>${D(periodStart)} تا ${D(day)}</small><span class="badge">داده نمونه / ثبت محلی</span></div></section>`
  +statRow(stat('ارزش موجودی',N(m.inventory),'تومان','مانده تا تاریخ پایان × بهای مرجع نمونه','box'),stat('خرید دوره',N(m.purchase),'تومان','مقدار دریافت‌شده × نرخ رسید','truck'),stat('فروش دوره',N(m.sales),'تومان','تعداد آیتم × قیمت ثبت‌شده','wallet'),stat('بهای مصرف مواد',N(m.cost),'تومان','پورشن زمان فروش × بهای مرجع نمونه','plate'))
  +`<div class="decision-strip"><div><span>دورریز دوره</span><strong>${money(m.waste)}</strong></div><div><span>زیر آستانه تأمین</span><strong>${N(m.low)} ماده</strong></div><div><span>خرید در انتظار تأیید نمایشی</span><strong>${N(m.pending)} درخواست</strong></div><div><span>شمارش دارای اختلاف</span><strong>${N(counts().filter(x=>x.delta).length)} مورد</strong></div></div>`
  +`<div class="grid">${card('فروش روزانه','حداکثر هفت روز پایانی بازه؛ واحد: میلیون تومان',chart(),btn('مشاهده صندوق','go:cash','mini','arrow'))}${card('اولویت بررسی مدیر','بر اساس رسید و شمارش شعبه انتخابی',issues.slice(0,4).join('')||info('در این بازه مغایرت ثبت‌شده‌ای وجود ندارد.'),btn('جزئیات مغایرت','go:audit','mini','arrow'))}</div>`
  +branchPerformance()+card('آخرین گردش‌های مرتبط','همان داده‌هایی که شاخص‌ها از آن محاسبه می‌شوند.',table(['مرجع','نوع','موضوع','مقدار','تاریخ'],data.records.filter(x=>x.b===b&&inPeriod(x)).slice().sort(byDate).slice(0,6).map(x=>[ref(x),E(({sale:'فروش',receive:'دریافت',move:'پخش',waste:'مصرف خارج از فروش',count:'شمارش'})[x.type]),E(x.name||material[x.m]?.[0]||''),x.m?unit(x.m,x.qty):N(x.qty)+' آیتم',D(x.date)])));
}
function branchPerformance(){return card('وضعیت شعب در بازه انتخابی','جدول مقایسه همه شعب؛ مستقل از فیلتر شعبه بالای صفحه. مبالغ: تومان.',table(['شعبه','فروش','بهای مواد فروش','دورریز','درخواست باز'],branchKeys.map(branch=>{const m=metrics(branch);return [E(branches[branch]),money(m.sales),money(m.cost),money(m.waste),N(m.pending)]})));}
function inventory(){
  const own=balance(data,b,day), central=balance(data,'central',day), rows=stockKeys.filter(m=>material[m][0].includes(search));
  return head('انبار و خرید','ثبت مقدار تحویلی، دسته‌بندی مواد و بررسی بودجه خرید.',btn('افزودن ماده','new:material','','plus')+btn('درخواست خرید','new:purchase','','plus')+btn('ثبت بار ورودی','new:receive','primary','plus'))
    +card('موجودی مواد اولیه','مانده سیستمی در پایان تاریخ انتخابی',table(['ماده','دسته‌بندی','انبار مرکزی','موجودی مجموعه','وضعیت مجموعه'],rows.map(m=>[E(material[m][0]),E(material[m][2]),unit(m,central[m]),unit(m,own[m]),own[m]<material[m][4]?badge('نیاز به تأمین','bad'):badge('موجود')]),'ماده‌ای با این نام پیدا نشد.'),`<input class="filter" id="search" placeholder="جست‌وجوی ماده…" aria-label="جست‌وجوی ماده" value="${E(search)}">`)
    +purchasePanel()
    +card('رسیدهای خرید','بار به انبار مرکزی وارد می‌شود و با حواله پخش به موجودی مجموعه منتقل می‌شود.',table(['ماده','ثبت خرید','شمارش تحویل','بودجه','ارزش بار','تسویه‌نشده / مازاد هزینه','مرجع'],rec('receive').map(x=>[E(material[x.m][0]),unit(x.m,x.ordered),unit(x.m,x.qty),money(x.budget),money(x.qty*x.price),badge(money(purchaseGap(x)),purchaseGap(x)?'bad':''),ref(x)])));
}
function distribution(){
  const rows=rec('move').slice().sort((a,z)=>sort==='amount'?material[a.m][1].localeCompare(material[z.m][1],'fa')||z.qty-a.qty:sort==='material'?material[a.m][0].localeCompare(material[z.m][0],'fa'):0);
  const all=data.records.filter(x=>x.type==='move'&&x.date===day);
  const summary=stockKeys.filter(m=>all.some(x=>x.m===m)).map(m=>[E(material[m][0]),...branchKeys.map(k=>unit(m,sum(all.filter(x=>x.m===m&&x.b===k),x=>x.qty))),unit(m,sum(all.filter(x=>x.m===m),x=>x.qty))]);
  return head('پخش مواد','گزارش پخش‌کننده و مقصد هر ماده از انبار مرکزی.',btn('ورود گزارش پخش','new:moveCsv','','report')+btn('ثبت حواله','new:move','primary','plus'))
    +card('حواله‌های این مجموعه','پخش ثبت‌شده در تاریخ انتخابی',table(['ماده','مبدأ','مقصد','مقدار','پخش‌کننده / توضیح','مرجع'],rows.map(x=>[E(material[x.m][0]),locations.central,E(branches[b]),unit(x.m,x.qty),E(x.note),ref(x)])),`<select class="filter" id="sort" aria-label="ترتیب حواله‌ها"><option value="recent">ترتیب ثبت</option><option value="material" ${sort==='material'?'selected':''}>نام ماده</option><option value="amount" ${sort==='amount'?'selected':''}>مقدار در هر واحد</option></select>`)
    +card('توزیع بین مجموعه‌ها','جمع هر ماده به تفکیک مقصد',table(['ماده',...Object.values(branches),'جمع پخش'],summary));
}
function menuPage(){
  const items=data.menu[b];
  return head('منو و پورشن','مقدار استاندارد هر ماده برای یک پرس در مجموعه انتخاب‌شده.',btn('افزودن آیتم','new:recipe','primary','plus'))
    +info('قیمت‌ها و دستورهای اولیه برای نمایش هستند. مقدارهای تأییدشده آشپزخانه را پیش از استفاده عملیاتی وارد کنید.')
    +card('آیتم‌های منو',N(items.length)+' آیتم در این مجموعه',table(['آیتم','دسته','قیمت نمایشی / ثبت‌شده','مواد هر پرس','منبع','ویرایش'],items.map(x=>[E(x.name),category[x.cat],money(x.price),Object.entries(x.recipe).map(([m,v])=>E(material[m][0])+' '+unit(m,v)).join(' · ')||badge('تعریف نشده','warn'),badge(x.added?'ثبت محلی کاربر':'نام برگرفته از منو؛ نرخ و پورشن نمونه','warn'),btn('ویرایش','recipe:'+x.id,'mini')])))
    +card('منابع منو','فهرست فعلی بخشی از منوی مجموعه‌هاست.',`<div class="actions"><a class="btn" target="_blank" rel="noopener" href="${sources[b][0]}">منوی رسمی مجموعه</a><a class="btn" target="_blank" rel="noopener" href="${sources[b][1]}">منبع عمومی تکمیلی</a></div>`);
}
function breakdown(items,values,field){
  const total=gross(items);
  return values.map((name,i)=>{
    const group=items.filter(x=>x[field]===(field==='cat'?i:name));
    const value=gross(group);
    return [E(name),N(sum(group,x=>x.qty)),money(value),N(total?100*value/total:0)+'٪'];
  });
}
function cash(){
  const sales=rec('sale'), amount=gross(sales), qty=sum(sales,x=>x.qty);
  const span=Math.max(1,Math.round((Date.parse(day)-Date.parse(periodStart))/86400000)+1);
  const prior=gross(data.records.filter(x=>x.b===b&&x.type==='sale'&&x.date>=offset(periodStart,-span)&&x.date<periodStart));
  return head('صندوق روزانه','تحلیل ریز فروش در بازه انتخابی، به تفکیک دسته و کانال پرداخت.',btn('ورود گزارش صندوق','new:saleCsv','','report')+btn('ثبت سفارش','new:sale','primary','plus'))
    +statRow(stat('فروش ناخالص',N(amount),'تومان','جمع ردیف‌های ثبت‌شده','wallet'),stat('آیتم فروخته‌شده',N(qty),'عدد','تعداد پرس و آیتم','plate'),stat('میانگین هر آیتم',N(qty?Math.round(amount/qty):0),'تومان','فروش تقسیم بر تعداد آیتم','trend','gold'),stat('تغییر نسبت به بازه قبل',prior?N(Math.round((amount/prior-1)*100))+'٪':'—','',prior?'مبنای مقایسه: بازه قبلی با طول برابر':'فروش مقایسه‌ای در دسترس نیست','calendar'))
    +`<div class="grid">${card('فروش بر اساس دسته','سهم هر گروه از فروش',table(['دسته','تعداد','مبلغ','سهم'],breakdown(sales,category,'cat')))}${card('روش‌های پرداخت','توزیع دریافتی ثبت‌شده',table(['کانال','تعداد','مبلغ','سهم'],breakdown(sales,salesTypes,'method')))}</div>`
    +card('ردیف‌های سفارش','مصرف هر آیتم با پورشن زمان ثبت محاسبه می‌شود.',table(['آیتم','دسته','تعداد','قیمت واحد','فروش','پرداخت','مرجع'],sales.slice().reverse().map(x=>[E(x.name),category[x.cat],N(x.qty),money(x.price),money(x.price*x.qty),E(x.method),ref(x)])));
}
function audit(){
  const checks=counts(), issues=rec('receive').filter(x=>purchaseGap(x)||missingQty(x));
  return head('تطبیق و مغایرت‌ها','کنترل بودجه خرید و اختلاف شمارش فیزیکی با موجودی سیستم.',btn('ثبت شمارش','new:count','primary','plus'))
    +card('مغایرت خرید','بودجه تسویه‌نشده برابر است با بودجه منهای ارزش تحویل و مبالغ مستند.',table(['ماده','اختلاف سفارش و تحویل','بودجه','ارزش تحویل','مبالغ مستند','اختلاف بودجه','مرجع'],issues.map(x=>[E(material[x.m][0]),unit(x.m,missingQty(x)),money(x.budget),money(x.qty*x.price),money(x.other),badge(money(purchaseGap(x)),'bad'),ref(x)])))
    +card('شمارش فیزیکی','برای ثبت‌های جدید، مانده زمان شمارش ثابت می‌ماند؛ شمارش بعدی تاریخچه قبلی را حفظ می‌کند.',table(['ماده','سیستم هنگام ثبت','شمارش','اختلاف شمارش','ارزش اختلاف مرجع','پرسنل','توضیح'],checks.map(x=>[E(material[x.m][0]),unit(x.m,x.expected),unit(x.m,x.qty),badge(unit(x.m,x.delta),x.delta?'bad':''),money(x.value),N(x.staff),E(x.note||'—')])))
    +info('مغایرت فقط برای بررسی ثبت می‌شود؛ کسر از حقوق، بدهی کارمند و اصلاح موجودی در این دمو اجرا نمی‌شود. ارزش اختلاف بر پایه بهای مرجع نمونه است.');
}
function waste(){
  const rows=rec('waste'), cost=x=>x.qty*material[x.m][3];
  return head('پرتی و غذای پرسنلی','تفکیک دورریز از مازاد سالمِ مصرف‌شده برای غذای پرسنل.',btn('ثبت مصرف یا پرتی','new:waste','primary','plus'))
    +`<div class="grid">${card('ارزش دورریز','بر اساس بهای مرجع نمایشی',`<strong class="stat-val">${money(Math.round(sum(rows.filter(x=>x.use==='دورریز'),cost)))}</strong>`)}${card('ارزش مصرف پرسنلی','به‌صورت جداگانه از دورریز',`<strong class="stat-val">${money(Math.round(sum(rows.filter(x=>x.use!=='دورریز'),cost)))}</strong>`)}</div>`
    +card('گردش مصرف خارج از فروش','هر ثبت، موجودی همان مجموعه را به اندازه مقدار ثبت‌شده کاهش می‌دهد.',table(['ماده','مقدار','مصرف','ارزش مرجع','توضیح'],rows.map(x=>[E(material[x.m][0]),unit(x.m,x.qty),badge(x.use,x.use==='دورریز'?'bad':''),money(Math.round(cost(x))),E(x.note)])));
}
function report(){
 const m=metrics(),inventoryRows=stockKeys.map(k=>[E(material[k][0]),unit(k,balance(data,b,day)[k]),money(balance(data,b,day)[k]*material[k][3])]);
 const useRows=stockKeys.map(k=>[k,sum(rec('sale'),x=>(x.recipe[k]||0)*x.qty)]).filter(([,q])=>q>0).map(([k,q])=>[E(material[k][0]),unit(k,q),money(q*material[k][3])]);
 return head('گزارش کارفرما','خلاصه تصمیم‌گیری بر اساس بازه و شعبه انتخابی؛ مبالغ به تومان.',btn('خروجی CSV','export-report','','download')+btn('چاپ / ذخیره PDF','print','primary','download'))
 +info('همه اعداد از داده محلی همین دمو محاسبه شده‌اند. بهای مواد، ارزش مرجع نمونه است؛ این گزارش سود خالص یا حسابداری مالی نیست.')
 +statRow(stat('فروش دوره',N(m.sales),'تومان','جمع فروش‌های بازه','wallet'),stat('بهای مواد فروش',N(m.cost),'تومان','بر پایه پورشن ثابت فروش','plate'),stat('دورریز',N(m.waste),'تومان','مصرف کارکنان در این عدد نیست','leaf'),stat('حاشیه مواد',N(m.sales-m.cost),'تومان','فروش منهای بهای مرجع مواد؛ قبل سایر هزینه‌ها','report'))
 +`<div class="grid">${card('گزارش موجودی','مانده در پایان بازه؛ مبنای قیمت مرجع نمونه',table(['ماده','مانده','ارزش مرجع'],inventoryRows))}${card('گزارش مصرف فروش','جمع مواد در پورشن ثبت‌شده فروش‌های بازه',table(['ماده','مصرف','بهای مرجع'],useRows))}</div>`
 +card('گزارش خرید','فقط رسیدهای دریافت‌شده؛ درخواست تأییدنشده خرید قطعی نیست.',table(['مرجع','ماده','دریافت','نرخ','ارزش'],rec('receive').map(x=>[ref(x),E(material[x.m][0]),unit(x.m,x.qty),money(x.price),money(x.qty*x.price)])))
 +card('گزارش دورریز و کارکنان','هر ردیف فقط یک بار از موجودی کم می‌شود.',table(['ماده','نوع','مقدار','بهای مرجع'],rec('waste').map(x=>[E(material[x.m][0]),E(x.use),unit(x.m,x.qty),money(referenceCost(x))])))+branchPerformance();
}
function purchasePanel(){
 const stateNames={draft:'پیش‌نویس',submitted:'در انتظار بررسی',reviewed:'بررسی‌شده',approved:'تأیید نمایشی',received:'دریافت‌شده',partially_received:'دریافت جزئی'};
 return card('درخواست‌ها و سفارش‌های خرید','گردش تأیید در این مرورگر شبیه‌سازی می‌شود؛ کنترل نقش واقعی فعال نیست.',table(['مرجع','ماده','مقدار','مبلغ پیشنهادی','وضعیت','اقدام بعدی'],purchaseList().map(x=>[E(x.ref),E(material[x.m][0]),unit(x.m,x.qty),money(x.qty*x.price),badge(stateNames[x.status]||x.status,x.status==='submitted'?'warn':''),x.status==='draft'?btn('ارسال برای بررسی','purchase-submit:'+x.id,'mini'):x.status==='submitted'?btn('بررسی درخواست','purchase-review:'+x.id,'mini'):x.status==='reviewed'?btn('تأیید نمایشی سفارش','purchase-approve:'+x.id,'mini'):['approved','partially_received'].includes(x.status)?btn('ثبت دریافت مرتبط','purchase-receive:'+x.id,'mini'):badge('رسید مرتبط ثبت شد')])));
}
function presentation(){
 const m=metrics(), steps=['درخواست خرید','بررسی درخواست','تأیید نمایشی سفارش','دریافت در انبار مرکزی','پخش به شعبه','ثبت سفارش و مصرف','ثبت دورریز','گزارش مدیر'];
 return head('ارائه به مالک مجموعه','از یک درخواست تا اثر آن روی موجودی و هزینه؛ مسیر مرور پیشنهادی کمتر از پنج دقیقه.',btn('بازگشت به داشبورد','go:overview','primary','arrow'))
 +`<section class="presentation-intro"><span class="eyebrow">طنجه · مدیریت عملیات رستورانی</span><h2>اطلاعات پراکنده، به یک مسیر قابل توضیح تبدیل می‌شوند.</h2><p>این نمونه نشان می‌دهد خرید، دریافت، پخش، فروش و مصرف چگونه کنار هم قرار می‌گیرند. هدف، دیدن سریع اختلاف‌ها و کاهش زمان جمع‌بندی است؛ میزان صرفه‌جویی هنوز اندازه‌گیری نشده است.</p><div class="actions">${btn('اجرای سناریو از خرید','go:inventory','primary','arrow')}${btn('فضای نمونه مستقل','sample-space','','plus')}</div></section>`
 +card('سناریوی قابل اجرا','برای نمایش زنده: درخواست ۱۰ کیلو گوشت، دریافت ۱۰، پخش ۵ به شعبه، فروش ۲ پرس و دورریز ۰٫۱ کیلو. هر مرحله را با مرجع مشخص ثبت کنید.',`<ol class="scenario">${steps.map((x,i)=>`<li><span>${N(i+1)}</span><strong>${x}</strong></li>`).join('')}</ol><p class="muted">در منوی طنجه، کادیش کباب با ۰٫۲۲ کیلو گوشت در هر پرس تعریف شده است؛ دو پرس ۰٫۴۴ کیلو مصرف می‌کند. اثر خالص این سناریو بر موجودی شعبه: ۵ − ۰٫۴۴ − ۰٫۱ = ۴٫۴۶ کیلو افزایش.</p>`)
 +`<div class="grid">${card('امروز در همین دمو','واقعاً قابل اجرا در مرورگر',`<ul class="plain-list"><li>ثبت دستی، پورشن، دریافت و پخش محلی</li><li>محاسبه فروش، مواد، دورریز و گزارش مشترک</li><li>ورود متن با پیش‌نمایش و خروجی CSV</li><li>تاریخچه فعالیت محلی و تأییدهای شبیه‌سازی‌شده</li></ul>`)}${card('در معماری نسخه عملیاتی پیش‌بینی شده','در این دمو فعال نیست',`<ul class="plain-list"><li>حساب کارکنان و احراز هویت واقعی</li><li>اعمال نقش و محدوده شعبه در Backend</li><li>دیتابیس مرکزی و دفتر موجودی قابل اتکا</li><li>Audit امن، پشتیبان‌گیری و بازیابی آزموده‌شده</li></ul>`)}</div>`
 +card('نقش‌ها و کنترل مدیریتی','توضیح طراحی آینده؛ این جدول مجوز واقعی ایجاد نمی‌کند.',table(['نقش پیشنهادی','مسئولیت'],[['مالک / مدیر عملیات','مشاهده کل مجموعه و تأییدهای مدیریتی'],['مسئول خرید','درخواست، سفارش و اسناد تأمین'],['انباردار و تحویل‌گیرنده شعبه','شمارش مستقل و ثبت دریافت'],['مسئول آشپزخانه / صندوق','پورشن، مصرف، ضایعات و فروش'],['بازرس','مرور اطلاعات و تاریخچه با دسترسی مجاز']]))
 +card('فعالیت‌های همین مرورگر','قابل ویرایش و حذف در مرورگر؛ Audit امن سازمانی نیست.',table(['زمان','شرح','مرجع'],(data.activity||[]).slice().reverse().slice(0,12).map(x=>[new Intl.DateTimeFormat('fa-IR',{dateStyle:'short',timeStyle:'short'}).format(new Date(x.at)),E(x.label),E(x.ref||'—')])))
 +card('مسیر تبدیل به نسخه عملیاتی','نیازمند تأیید دامنه و تصمیم‌های واقعی مدیران',`<ol class="roadmap">${['تأیید طرح','کشف عملیات واقعی','طراحی نهایی','پیاده‌سازی Backend و Database','تست و پایلوت'].map(x=>`<li>${E(x)}</li>`).join('')}</ol>`);
}
const pages={overview,inventory,distribution,menu:menuPage,cash,audit,waste,report,presentation};
function render(focus=false){
  $('rail').innerHTML=`<div class="brand"><div class="mark">${I('mark',28)}</div><div><strong>طنجه</strong><small lang="en" dir="ltr">TANJE GROUP</small></div></div><div class="nav-label">عملیات روزانه</div><nav class="nav" aria-label="عملیات روزانه">${Object.entries(views).slice(0,5).map(nav).join('')}</nav><div class="nav-label">کنترل و گزارش</div><nav class="nav" aria-label="کنترل و گزارش">${Object.entries(views).slice(5).map(nav).join('')}</nav><nav class="nav">${nav(['presentation',['ارائه به مالک','report']])}</nav><div class="rail-bottom"><span class="dot"></span>محیط نمایشی مدیریت<br>طراحی برای مجموعه‌های طنجه</div>`;
  $('branch').value=b;
  $('day').value=day;
  $('date-label').innerHTML=I('calendar',15)+' '+D(day);
  $('notifications').innerHTML=I('bell',19)+(alerts().length?'<b></b>':'');
  $('page').innerHTML=(storageIssue?`<div class="storage-warning" role="alert">${E(storageIssue)} ${btn('خروجی داده محفوظ','export-backup')} ${btn('فضای ارائه مستقل','sample-space')}</div>`:'')+pages[view]();
  $('period-start').value=periodStart;
  $('workspace-label').textContent=key===presentationKey?'فضای نمونه مستقل':'فضای محلی مرورگر';
  if(focus)$('page').focus({preventScroll:true});
}
function nav([v,[label,icon]]){
  return `<button type="button" class="${view===v?'active':''}" ${view===v?'aria-current="page"':''} data-act="go:${v}">${I(icon)}${E(label)}</button>`;
}
const label=(name,field,wide=false)=>`<label${wide?' class="wide"':''}>${name}${field}</label>`;
const input=(name,type='text',attr='')=>`<input name="${name}" type="${type}" required ${attr}>`;
const opt=(k,v)=>`<option value="${E(k)}">${E(v)}</option>`;
const select=(name,options)=>`<select name="${name}" required>${options.map(([k,v])=>opt(k,v)).join('')}</select>`;
const options=values=>values.map(v=>[v,v]);
const num=(name,min=0,step='1',attr='')=>input(name,'number',`min="${min}" step="${step}" ${attr}`);
const chooseMaterial=()=>select('m',stockKeys.map(m=>[m,material[m][0]+' · '+material[m][1]]));
const chooseItem=()=>select('item',data.menu[b].map(x=>[x.id,x.name+(Object.keys(x.recipe).length?'':' · بدون پورشن')]));
const desc=(name='note',required=false)=>`<input name="${name}" maxlength="150" ${required?'required':''}>`;
const dateField=()=>label('تاریخ ثبت',input('date','date',`value="${E(day)}" min="2020-01-01"`));
const qtyField=(caption='مقدار',min='0.001')=>label(caption,num('qty',min,'.001'));
const reference=()=>label('شناسه مرجع',input('ref','text','maxlength="50"'));
const formatGuide=(name,help,example)=>label(name,`<small>${E(help)}</small><textarea name="rows" dir="auto" required placeholder="${E(example)}"></textarea>`,true);
const forms={
 purchase:['درخواست خرید نمونه','درخواست به شعبه انتخابی مرتبط است و پس از بررسی و تأیید نمایشی، دریافت جداگانه دارد.',()=>dateField()+label('ماده اولیه',chooseMaterial())+qtyField()+label('نرخ پیشنهادی واحد (تومان)',num('price'))+reference()+label('تأمین‌کننده پیشنهادی',desc('supplier',true))],
 receive:['ثبت بار ورودی','ثبت خرید و شمارش مستقل تحویل به انبار مرکزی.',()=>dateField()+label('ماده اولیه',chooseMaterial())+label('مقدار ثبت‌شده توسط خرید',num('ordered',0,'.001'))+qtyField('مقدار واقعی تحویل','.001')+label('بهای واحد (تومان)',num('price'))+label('بودجه تخصیصی (تومان)',num('budget'))+label('مبالغ تسویه‌شده مستند (تومان)',num('other',0,'1','value="0"'))+reference()+label('تأمین‌کننده / توضیح',desc(),true)],
 move:['ثبت حواله پخش','موجودی از انبار مرکزی به مجموعه انتخابی منتقل می‌شود.',()=>dateField()+label('ماده اولیه',chooseMaterial())+qtyField()+reference()+label('پخش‌کننده / توضیح',desc('note',true),true)],
 moveCsv:['ورود گزارش پخش‌کننده','هر خط یک ردیف حواله. تمام ردیف‌ها با هم بررسی و ثبت می‌شوند.',()=>dateField()+formatGuide('ردیف‌های گزارش','ترتیب ستون‌ها با | جدا شود: نام ماده | نام مجموعه | مقدار | شناسه حواله | پخش‌کننده',`برنج ایرانی | ${branches[b]} | ۵ | پخش-۴ | پخش صبح`)],
 sale:['ثبت سفارش','ثبت فروش و کسر مواد از موجودی همین مجموعه.',()=>dateField()+label('آیتم منو',chooseItem())+label('تعداد آیتم',num('qty',1))+label('قیمت واقعی واحد (تومان)',num('price'))+label('پرداخت',select('method',options(salesTypes)))+reference()],
 saleCsv:['ورود ریز صندوق','هر خط یک ردیف از خروجی صندوق. قیمت‌ها به تومان هستند.',()=>dateField()+formatGuide('ردیف‌های گزارش','ترتیب ستون‌ها با | جدا شود: آیتم | تعداد | بهای واحد | روش پرداخت | شناسه یکتای ردیف',`${data.menu[b][0].name} | ۲ | ${data.menu[b][0].price} | کارت‌خوان | صندوق-۴`)],
 count:['ثبت شمارش فیزیکی','آخرین شمارش همان ماده در همان روز مبنای تطبیق قرار می‌گیرد.',()=>dateField()+label('ماده اولیه',chooseMaterial())+qtyField('موجودی شمارش‌شده',0)+label('تعداد افراد آشپزخانه',num('staff',1))+label('توضیح شمارش',desc(),true)],
 waste:['ثبت پرتی یا غذای پرسنلی','مقدار مصرف‌شده از موجودی همین مجموعه کسر می‌شود.',()=>dateField()+label('ماده اولیه',chooseMaterial())+qtyField()+label('نوع مصرف',select('use',options(['دورریز','غذای پرسنلی'])))+label('دلیل یا توضیح تأیید مازاد سالم',desc('note',true),true)],
 material:['افزودن ماده اولیه','واحد، دسته و بهای مرجع ماده را برای همه مجموعه‌ها تعریف کنید.',()=>label('نام ماده',input('name','text','maxlength="65"'))+label('واحد',select('unit',options(['کیلوگرم','لیتر','عدد'])))+label('دسته‌بندی',input('group','text','maxlength="55"'))+label('بهای مرجع هر واحد (تومان)',num('price'))+label('آستانه تأمین',num('min',0,'.001'))],
 recipe:['تعریف آیتم و پورشن','برای هر ماده مقدار مصرف در یک پرس را بر حسب واحد نشان‌داده‌شده وارد کنید.',item=>label('نام آیتم',input('name','text',`maxlength="75" value="${E(item?.name)}"`))+label('دسته‌بندی',`<select name="cat">${category.map((v,k)=>`<option value="${k}" ${k===item?.cat?'selected':''}>${E(v)}</option>`).join('')}</select>`)+label('قیمت واحد (تومان)',num('price',0,'1',`value="${item?.price??''}"`))+stockKeys.map(m=>label(E(material[m][0]+' · '+material[m][1]),`<input name="mat-${m}" type="number" min="0" step=".001" value="${item?.recipe[m]??''}" placeholder="۰">`)).join('')]
};
let current, editor;
function openForm(type,item){
  current=type;
  editor=item;
  verify(forms[type],'این فرم پشتیبانی نمی‌شود.');
  const [title,sub,fields]=forms[type];
  $('entry').innerHTML=`<div class="dialog-head"><div><h2 id="dialog-title">${E(title)}</h2><p class="muted">${E(sub)}</p></div><button type="button" class="iconbtn" data-act="close" aria-label="بستن">${I('close')}</button></div><div class="fields">${fields(item)}</div><div id="error" class="error" role="alert"></div><div class="dialog-foot">${btn('انصراف','close')}<button class="btn primary" type="submit">${I('check',15)} ذخیره</button></div>`;
  $('dialog').setAttribute('aria-labelledby','dialog-title');
  if(type==='sale'){
    const form=$('entry');
    const itemSelect=form.querySelector('select[name="item"]'), priceInput=form.querySelector('input[name="price"]');
    const fill=()=>{const selected=data.menu[b].find(x=>x.id===itemSelect?.value);if(selected&&priceInput)priceInput.value=selected.price;else{$('error').textContent='آیتم قابل انتخابی در منو نیست؛ ابتدا آیتم و پورشن را تعریف کنید.';form.querySelector('[type="submit"]').disabled=true;}};
    if(itemSelect)itemSelect.addEventListener('change',fill);fill();
  }
  importPreviewHash='';formConsumed=false;
  $('dialog').showModal();
}
function say(text){
  $('toast').textContent=text;
  $('toast').classList.add('show');
  clearTimeout(say.timer);
  say.timer=setTimeout(()=>$('toast').classList.remove('show'),3500);
}
function verify(ok,msg){if(!ok)throw new Error(msg)}
function numeric(value,min=0,whole=false){
  const normalized=String(value??'').trim().replace(/[۰-۹]/g,c=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(c)).replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c)).replace(/٫/g,'.').replace(/٬/g,'');
  const v=Number(normalized);
  verify(/^\d+(?:\.\d{1,3})?$/.test(normalized)&&Number.isFinite(v)&&v>=min&&v<=1e12&&(!whole||Number.isInteger(v)),'مقدار عددی واردشده معتبر نیست.');
  return v;
}
function saleRecord(item,qty,price,method,date,ref){
  verify(item,'آیتم در منوی این مجموعه پیدا نشد.');
  verify(Object.keys(item.recipe).length,'ابتدا پورشن این آیتم را در منو تعریف کنید.');
  verify(salesTypes.includes(method),'روش پرداخت معتبر نیست.');
  return {type:'sale',b,date,name:item.name,item:item.id,cat:item.cat,qty:numeric(qty,1,true),price:numeric(price,0,true),method,recipe:{...item.recipe},ref};
}
function checkReference(state,x){
  if(!['sale','receive','move'].includes(x.type))return;
  verify(x.ref&&x.ref.length<=50,'شناسه مرجع لازم است و حداکثر ۵۰ نویسه دارد.');
  verify(!state.records.some(y=>y.type===x.type&&y.b===x.b&&y.date===x.date&&y.ref===x.ref&&(x.type==='sale'||y.m===x.m)),'این شناسه برای همین ردیف قبلاً ثبت شده است.');
}
function ensureStock(state,places,date){
  const dates=[date,...new Set(state.records.filter(x=>x.date>date).map(x=>x.date))];
  for(const place of places)for(const d of dates){
    const shortage=Object.entries(balance(state,place,d)).find(([,q])=>q<0);
    verify(!shortage,'موجودی '+(shortage?material[shortage[0]][0]:'')+' در '+locations[place]+' برای '+D(d)+' کافی نیست.');
  }
}
function applyEntry(state,f){
  if(current==='purchase'){verify(f.ref&&f.supplier,'مرجع و تأمین‌کننده لازم است.');state.purchases??=[];verify(!state.purchases.some(x=>x.b===b&&x.ref===f.ref),'مرجع درخواست تکراری است.');verify(f.date&&/^\d{4}-\d{2}-\d{2}$/.test(f.date)&&Number.isFinite(Date.parse(f.date+'T12:00:00Z')),'تاریخ معتبر لازم است.');state.purchases.push({id:crypto.randomUUID(),b,date:f.date,m:f.m,qty:numeric(f.qty,.001),price:numeric(f.price,0,true),supplier:f.supplier,ref:f.ref,status:'draft',sample:key===presentationKey});return;}
  const date=f.date, ref=f.ref;
  const rows=[];
  if(current==='recipe'){
    verify(f.name,'نام آیتم لازم است.');
    verify(!state.menu[b].some(x=>x.name===f.name&&x.id!==editor?.id),'این نام در منو وجود دارد.');
    const recipe=Object.fromEntries(stockKeys.filter(m=>f['mat-'+m]&&numeric(f['mat-'+m])>0).map(m=>[m,numeric(f['mat-'+m])]));
    const item={id:editor?.id||crypto.randomUUID(),name:f.name,cat:Number(f.cat),price:numeric(f.price,0,true),recipe,demo:editor?.demo,added:editor?.added??!editor};
    state.menu[b]=editor?state.menu[b].map(x=>x.id===editor.id?item:x):[...state.menu[b],item];
    return;
  }
  if(current==='material'){
    verify(f.name&&f.group,'نام ماده و دسته‌بندی لازم هستند.');
    verify(!stockKeys.some(m=>material[m][0]===f.name),'این ماده قبلاً تعریف شده است.');
    const id='m'+crypto.randomUUID();
    state.custom??={};
    state.custom[id]=[f.name,f.unit,f.group,numeric(f.price,0,true),numeric(f.min)];
    for(const loc of Object.keys(locations))state.opening[loc][id]=0;
    return;
  }
  verify(date&&date>='2020-01-01'&&Number.isFinite(Date.parse(date+'T12:00:00Z')),'تاریخ معتبر وارد کنید.');
  const base={type:current,b,date,id:crypto.randomUUID(),sample:key===presentationKey};
  if(linkedPurchase&&current==='receive'){const po=(state.purchases||[]).find(x=>x.id===linkedPurchase);verify(po&&['approved','partially_received'].includes(po.status)&&po.b===b,'سفارش مرتبط دیگر آماده دریافت نیست.');verify(po.m===f.m,'ماده دریافت باید با سفارش مرتبط یکسان باشد.');const already=sum(state.records.filter(x=>x.type==='receive'&&x.purchaseId===po.id),x=>x.qty);verify(numeric(f.qty,.001)<=round(po.qty-already),'دریافت نمی‌تواند از مانده سفارش بیشتر باشد.');base.purchaseId=po.id;po.status=round(already+numeric(f.qty))===po.qty?'received':'partially_received';}
  if(['receive','move','count','waste'].includes(current))verify(stockKeys.includes(f.m),'ماده اولیه معتبر نیست.');
  if(current==='receive')rows.push({...base,m:f.m,qty:numeric(f.qty,.001),ordered:numeric(f.ordered),price:numeric(f.price,0,true),budget:numeric(f.budget,0,true),other:numeric(f.other,0,true),note:f.note,ref});
  if(current==='move')rows.push({...base,m:f.m,qty:numeric(f.qty,.001),note:f.note,ref});
  if(current==='sale')rows.push(saleRecord(state.menu[b].find(x=>x.id===f.item),f.qty,f.price,f.method,date,ref));
  if(current==='count'){
    for(const old of state.records)if(old.type==='count'&&old.b===b&&old.date===date&&old.m===f.m&&!old.supersededBy)old.supersededBy=base.id;
    base.expected=balance(state,b,date)[f.m];
    rows.push({...base,m:f.m,qty:numeric(f.qty),staff:numeric(f.staff,1,true),note:f.note});
  }
  if(current==='waste'){
    verify(f.note,'دلیل یا توضیح مصرف را وارد کنید.');
    rows.push({...base,m:f.m,qty:numeric(f.qty,.001),use:f.use,note:f.note});
  }
  if(current==='moveCsv'||current==='saleCsv'){
    const lines=f.rows.split(/\r?\n/).filter(t=>t.trim());
    verify(lines.length&&lines.length<=500,'بین ۱ تا ۵۰۰ ردیف وارد کنید.');
    for(const [i,line] of lines.entries()){
      try{
        const values=line.split('|').map(x=>x.trim());
        verify(values.length===5&&values.every(Boolean),'هر ردیف باید ۵ ستون تکمیل‌شده داشته باشد.');
        if(current==='moveCsv'){
          const [name,target,qty,ref,note]=values;
          const m=stockKeys.find(k=>material[k][0]===name), destination=branchKeys.find(k=>branches[k]===target);
          verify(m&&destination,'نام ماده یا مقصد با فهرست پنل مطابقت ندارد.');
          rows.push({type:'move',b:destination,date,m,qty:numeric(qty,.001),note,ref});
        }else{
          const [name,qty,price,method,ref]=values;
          rows.push(saleRecord(state.menu[b].find(x=>x.name===name),qty,price,method,date,ref));
        }
      }catch(err){throw new Error('ردیف '+N(i+1)+' · '+err.message)}
    }
  }
  for(const row of rows){
    checkReference(state,row);
    row.id??=crypto.randomUUID();
    state.records.push(row);
  }
  if(rows.some(x=>['move','sale','waste'].includes(x.type))){
    ensureStock(state,new Set(rows.flatMap(x=>x.type==='move'?['central',x.b]:[x.b])),date);
  }
}
function addCustomMaterials(){
  for(const [m,details] of Object.entries(data.custom||{})){
    if(!material[m])stockKeys.push(m);
    material[m]=details;
  }
}
addCustomMaterials();
let linkedPurchase=null, importPreviewHash='', formConsumed=false;
$('entry').addEventListener('submit',e=>{
  e.preventDefault();
  if(saving||formConsumed)return;
  const f=Object.fromEntries([...new FormData(e.target)].map(([k,v])=>[k,v.trim()]));
  try{
    verify(!storageIssue,'ابتدا داده محفوظ را بررسی کنید یا فضای ارائه مستقل را باز کنید.');
    const last=localStorage.getItem(key);
    const next=last?validateState(JSON.parse(last)):structuredClone(data);
    const preview=structuredClone(next);applyEntry(preview,f);
    if(current.endsWith('Csv')&&importPreviewHash!==JSON.stringify(f)){importPreviewHash=JSON.stringify(f);$('error').innerHTML='<strong>پیش‌نمایش معتبر: '+N(preview.records.length-next.records.length)+' ردیف</strong><p>هیچ ردیفی هنوز ثبت نشده است. برای ثبت همه ردیف‌ها، دوباره دکمه ثبت نهایی را بزنید.</p>';e.target.querySelector('[type="submit"]').textContent='ثبت نهایی ردیف‌ها';return;}
    if(['waste','count','receive'].includes(current)&&!confirm('ثبت '+forms[current][0]+' در داده محلی این مرورگر انجام شود؟'))return;
    saving=true;e.target.querySelector('[type="submit"]').disabled=true;
    applyEntry(next,f);
    next.activity??=[];next.activity.push({at:new Date().toISOString(),label:forms[current][0]+' · ثبت محلی',ref:f.ref||''});
    localStorage.setItem(key,JSON.stringify(next));
    formConsumed=true;
    data=next;
    addCustomMaterials();
    if(f.date){day=f.date;if(periodStart>day)periodStart=day;}
    linkedPurchase=null;
    $('dialog').close();
    if(current==='receive')view='inventory';
    if(current.startsWith('move'))view='distribution';
    if(current.startsWith('sale'))view='cash';
    if(current==='count')view='audit';
    if(current==='waste')view='waste';
    render(true);
    if(current==='purchase')view='inventory';
    render();
    say('در همین مرورگر ذخیره شد.');
  }catch(err){
    $('error').textContent=err.name==='QuotaExceededError'?'فضای ذخیره مرورگر پر است؛ هیچ تغییری ثبت نشد.':err.message;
  }finally{saving=false;const submit=$('entry').querySelector('[type="submit"]');if(submit)submit.disabled=false;}

});
function setNavOpen(open,restoreFocus=false){
  $('rail').classList.toggle('open',open);
  $('nav-backdrop').hidden=!open;
  $('toggle-nav').setAttribute('aria-expanded',String(open));
  $('toggle-nav').setAttribute('aria-label',open?'بستن منو':'باز کردن منو');
  if(restoreFocus)$('toggle-nav').focus();
}
document.addEventListener('click',e=>{
  const action=e.target.closest('[data-act]')?.dataset.act;
  if(!action)return;
  const [cmd,id]=action.split(':');
  if(cmd==='go'){setNavOpen(false);view=id;search='';render(true);window.scrollTo(0,0)}
  if(cmd==='new'){linkedPurchase=null;openForm(id);}
  if(cmd==='recipe')openForm('recipe',data.menu[b].find(x=>x.id===id));
  if(cmd==='close'){$('dialog').close();linkedPurchase=null;}
  if(cmd.startsWith('purchase-'))purchaseAction(cmd,id);
  if(cmd==='sample-space')openSampleSpace();
  if(cmd==='export-backup'){try{downloadFile('tanje-local-backup.json',localStorage.getItem(key)||JSON.stringify(data,null,2),'application/json')}catch{say('دسترسی به ذخیره مرورگر ممکن نیست؛ اصل داده بازنویسی نشد.')}}
  if(cmd==='export-report')exportReport();
  if(cmd==='print')window.print();
});
$('branch').innerHTML=Object.entries(branches).map(([k,v])=>opt(k,v)).join('');
$('branch').addEventListener('change',e=>{b=e.target.value;search='';render()});
$('day').addEventListener('change',e=>{if(e.target.value){day=e.target.value;if(periodStart>day)periodStart=day;render()}});
$('notifications').addEventListener('click',()=>{view='audit';render(true);window.scrollTo(0,0)});
$('toggle-nav').innerHTML=I('menu',19);
$('toggle-nav').addEventListener('click',()=>setNavOpen(!$('rail').classList.contains('open')));
$('nav-backdrop').addEventListener('click',()=>setNavOpen(false,true));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('rail').classList.contains('open'))setNavOpen(false,true)});
$('page').addEventListener('change',e=>{if(e.target.id==='sort'){sort=e.target.value;render();$('sort').focus()}});
$('page').addEventListener('input',e=>{if(e.target.id==='search'){search=e.target.value;const end=e.target.selectionStart;render();$('search').focus();$('search').setSelectionRange(end,end)}});
window.addEventListener('storage',e=>{if(e.key===key){try{if(e.newValue){data=validateState(JSON.parse(e.newValue));storageIssue='';addCustomMaterials();render()}else{storageIssue='داده در برگه دیگری حذف شده است؛ برای جلوگیری از بازنویسی، ثبت متوقف شد.';render()}}catch{storageIssue='داده برگه دیگر معتبر نیست؛ اصل داده حفظ شده و ثبت متوقف است.';render()}}});
render();

$('period-start').addEventListener('change',e=>{if(e.target.value){periodStart=e.target.value;if(periodStart>day)day=periodStart;render()}});
function openSampleSpace(){
 if(!confirm('فضای نمونه مستقل باز شود؟ داده فضای فعلی حذف یا بازنویسی نمی‌شود.'))return;
 key=presentationKey;storageIssue='';data=loadState();addCustomMaterials();view='presentation';day=today;periodStart=offset(today,-6);render();say('فضای نمونه مستقل؛ داده قبلی محفوظ است.');
}
function downloadFile(name,text,type){const blob=new Blob(['\ufeff',text],{type:type+';charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function exportReport(){
 const rows=[['نوع داده','شعبه','از تاریخ','تا تاریخ','شاخص','مقدار','واحد']],m=metrics();
 for(const [name,v] of [['فروش',m.sales],['خرید دریافتی',m.purchase],['بهای مواد فروش',m.cost],['دورریز',m.waste],['مصرف کارکنان',m.staff],['ارزش موجودی پایان',m.inventory]])rows.push(['نمونه / ثبت محلی',branches[b],periodStart,day,name,v,'تومان']);
 const csv=rows.map(row=>row.map(v=>'"'+String(v).replace(/^[=+@-]/,"'").replace(/"/g,'""')+'"').join(',')).join('\r\n');downloadFile('tanje-demo-report.csv',csv,'text/csv');say('خروجی CSV همین بازه آماده شد.');
}
function purchaseAction(cmd,id){
 try{verify(!storageIssue,'داده محلی نیازمند بررسی است.');const raw=localStorage.getItem(key),next=raw?validateState(JSON.parse(raw)):structuredClone(data),x=(next.purchases||[]).find(x=>x.id===id);verify(x&&x.b===b,'درخواست در این شعبه پیدا نشد.');
 if(cmd==='purchase-receive'){
 verify(['approved','partially_received'].includes(x.status),'ابتدا سفارش را تأیید نمایشی کنید.');linkedPurchase=id;openForm('receive');const f=$('entry'), remaining=round(x.qty-sum(next.records.filter(r=>r.type==='receive'&&r.purchaseId===x.id),r=>r.qty));for(const [name,value] of Object.entries({m:x.m,ordered:remaining,qty:remaining,price:x.price,budget:remaining*x.price,ref:'رسید-'+x.id.slice(-8)+'-'+(next.records.filter(r=>r.purchaseId===x.id).length+1),note:x.supplier})){const el=f.elements.namedItem(name);if(el)el.value=value;}return;
 }
 const transitions={'purchase-submit':['draft','submitted'],'purchase-review':['submitted','reviewed'],'purchase-approve':['reviewed','approved']},transition=transitions[cmd];verify(transition&&x.status===transition[0],'مرحله این درخواست قبلاً تغییر کرده است.');
 if(cmd==='purchase-approve'&&!confirm('این تأیید صرفاً نمایشی و محلی است؛ ثبت شود؟'))return;
 x.status=transition[1];next.activity??=[];next.activity.push({at:new Date().toISOString(),label:({'purchase-submit':'ارسال برای بررسی','purchase-review':'بررسی درخواست','purchase-approve':'تأیید نمایشی سفارش'})[cmd],ref:x.ref});localStorage.setItem(key,JSON.stringify(next));data=next;render();say('وضعیت محلی درخواست به‌روز شد.');
 }catch(err){say(err.message)}
}
