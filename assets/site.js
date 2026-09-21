/* Rituals Capture Studio: shared site script (all pages). Feature blocks run only where their elements exist. */
(function(){
"use strict";
/* ===== STUDIO CONFIG (edit once, updates the whole site) ===== */
var CFG={
  waNumber:"917008911105",          // WhatsApp number with country code, no + or spaces
  phoneDisplay:"+91 70089 11105",
  email:"ritualscapture@gmail.com",
  instagram:"rituals_capture_studio",
  mapUrl:"https://share.google/Gb2dODf7B4HH9jxus"
};
var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
function wa(msg){return "https://wa.me/"+CFG.waNumber+"?text="+encodeURIComponent(msg)}
function sendLead(subject,fields){
  var body={_subject:subject,_template:"table",_captcha:"false",_honey:""};
  for(var k in fields){body[k]=fields[k]}
  return fetch("https://formsubmit.co/ajax/"+encodeURIComponent(CFG.email),{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(body)}).then(function(r){return r.ok}).catch(function(){return false});
}
function toast(t){var e=$("#toast");e.textContent=t;e.classList.add("show");setTimeout(function(){e.classList.remove("show")},3600)}

/* Contact links */
$$(".wa-link").forEach(function(a){a.href=wa(a.getAttribute("data-msg")||"Hello Rituals Capture Studio")});
$$(".tel-link").forEach(function(a){a.href="tel:+"+CFG.waNumber;a.textContent=CFG.phoneDisplay});
$$(".mail-link").forEach(function(a){a.href="mailto:"+CFG.email+"?subject="+encodeURIComponent("Booking Enquiry - Rituals Capture Studio");if(!a.querySelector("svg"))a.textContent=CFG.email});
$$(".map-link").forEach(function(a){a.href=CFG.mapUrl});
$$(".ig-profile").forEach(function(a){a.href="https://www.instagram.com/"+CFG.instagram+"/"});
$$(".ig-link").forEach(function(a){a.href="https://ig.me/m/"+CFG.instagram;if(!a.querySelector("svg"))a.textContent="@"+CFG.instagram});
var yr=$("#yr");if(yr)yr.textContent=new Date().getFullYear();

/* Header */
var hdr=$("header");
addEventListener("scroll",function(){hdr.classList.toggle("solid",scrollY>30)},{passive:true});
var burger=$("#burger"),menu=$("#menu");
burger.addEventListener("click",function(){var o=menu.classList.toggle("open");burger.setAttribute("aria-expanded",o)});
$$("#menu a").forEach(function(a){a.addEventListener("click",function(){menu.classList.remove("open");burger.setAttribute("aria-expanded","false")})});

/* Reveal */
if("IntersectionObserver" in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.12});
  $$(".reveal").forEach(function(el){io.observe(el)});
}else{$$(".reveal").forEach(function(el){el.classList.add("in")})}

function setBad(el,bad){var f=el.closest(".field");if(f)f.classList.toggle("bad",bad);el.classList&&el.classList.toggle("err",bad)}
var EMAIL_RE=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,PHONE_OK=function(v){return /^(\+?91[\s-]?)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g,"").replace(/^0/,""))};

/* ---- Portfolio ---- */
(function(){
if(!$("#pfGrid"))return;
/* Portfolio: category filters, balanced masonry, load more, lightbox */
var GDATA=window.GDATA||[];
var LABEL={wedding:"Wedding",prewedding:"Pre-Wedding",maternity:"Maternity",birthday:"Birthday",annaprasanna:"Annaprasanna",thread:"Thread Ceremony"};
var PH=GDATA.map(function(a){return{id:a[0],w:a[1],h:a[2],c:a[0].split("-")[0]}});
var pfGrid=$("#pfGrid"),pfMore=$("#pfMore"),pfCount=$("#pfCount"),pfFil=$$("#pfFilters button");
var pfF="all",pfList=PH,pfShown=0,pfCols=[],pfH=[],PF_STEP=24;
pfFil.forEach(function(b){var f=b.getAttribute("data-f"),n=f==="all"?PH.length:PH.filter(function(x){return x.c===f}).length;var sp=document.createElement("span");sp.className="n";sp.textContent=n;b.appendChild(sp)});
function pfColCount(){var w=innerWidth;return w>=1100?4:w>=760?3:2}
var pfTiles=[];
function pfMake(i){
  var it=pfList[i],b=document.createElement("button");b.type="button";b.className="ph";b._i=i;
  b.setAttribute("aria-label","Open "+LABEL[it.c]+" photo");
  b.appendChild(pfImg(it));
  var tg=document.createElement("span");tg.className="tg";tg.textContent=LABEL[it.c];b.appendChild(tg);
  b.addEventListener("click",function(){lbOpen(b._i,b)});
  return b;
}
function pfImg(it){
  var im=document.createElement("img");im.width=it.w;im.height=it.h;im.decoding="async";im.alt=LABEL[it.c]+" photography by Rituals Capture Studio, Sambalpur";
  im.onload=function(){im.classList.add("ld")};im.src="images/thumb/"+it.id+".webp";return im;
}
function pfEff(){var k=pfColCount();return pfList.length-(pfList.length%k>0&&pfList.length>k?pfList.length%k:0)}
function pfBuild(n){
  pfGrid.innerHTML="";pfTiles=[];pfShown=0;pfAdd(n);
}
function pfAdd(n){
  var k=pfColCount(),eff=pfEff(),end=Math.min(pfShown+n,eff);
  if(end<eff&&end%k)end-=end%k;
  for(var i=pfShown;i<end;i++){var b=pfMake(i);pfGrid.appendChild(b);pfTiles.push(b)}
  pfShown=end;
  pfCount.textContent="Showing "+pfShown+" of "+pfList.length+" photos";
  pfMore.style.display=pfShown<eff?"inline-flex":"none";
}
/* Live wall: every 6s, 3-5 tiles change to other photos, staggered */
function pfSwap(){
  if(document.hidden||!lb.hidden||matchMedia("(prefers-reduced-motion:reduce)").matches)return;
  var used={};pfTiles.forEach(function(t){used[t._i]=1});
  var pool=[];for(var i=0;i<pfList.length;i++)if(!used[i])pool.push(i);
  if(!pool.length)return;
  var vis=pfTiles.filter(function(t){var r=t.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight&&!t.matches(":hover")});
  if(!vis.length)return;
  var n=Math.min(3+Math.floor(Math.random()*3),vis.length,pool.length);
  vis.sort(function(){return Math.random()-.5});pool.sort(function(){return Math.random()-.5});
  for(var j=0;j<n;j++)(function(t,ni,d){
    var it=pfList[ni],im=pfImg(it);im.classList.add("in");
    im.addEventListener("load",function(){setTimeout(function(){
      if(!t.isConnected)return;
      t.insertBefore(im,t.firstChild);void im.offsetWidth;im.classList.add("ld");
      var old=t.querySelectorAll("img");
      t.classList.add("chg");t._i=ni;t.querySelector(".tg").textContent=LABEL[it.c];
      setTimeout(function(){for(var q=0;q<old.length;q++)if(old[q]!==im&&old[q].parentNode===t)t.removeChild(old[q]);t.classList.remove("chg")},3000);
    },d)},{once:true});
  })(vis[j],pool[j],j*1100+Math.random()*500);
}
setInterval(pfSwap,6000);
pfFil.forEach(function(b){b.addEventListener("click",function(){
  pfFil.forEach(function(x){x.classList.remove("active");x.setAttribute("aria-selected","false")});
  b.classList.add("active");b.setAttribute("aria-selected","true");
  pfF=b.getAttribute("data-f");pfList=pfF==="all"?PH:PH.filter(function(x){return x.c===pfF});
  pfBuild(PF_STEP);pfGrid.classList.remove("swap");void pfGrid.offsetWidth;pfGrid.classList.add("swap");
})});
pfMore.addEventListener("click",function(){pfAdd(PF_STEP)});
var pfLastCols=pfColCount(),pfRz;
addEventListener("resize",function(){clearTimeout(pfRz);pfRz=setTimeout(function(){var c=pfColCount();if(c!==pfLastCols){pfLastCols=c;pfBuild(pfShown)}},200)});
pfBuild(PF_STEP);
/* Lightbox */
var lb=$("#lb"),lbImg=$("#lbImg"),lbCap=$("#lbCap"),lbI=0,lbFrom=null,tx=0;
function lbShow(i){
  lbI=(i+pfList.length)%pfList.length;var it=pfList[lbI];
  lbImg.style.opacity=.25;lbImg.onload=function(){lbImg.style.opacity=1};
  lbImg.src="images/full/"+it.id+".webp";lbImg.alt=LABEL[it.c]+" photography by Rituals Capture Studio, Sambalpur";
  lbCap.textContent=LABEL[it.c]+"  \u00B7  "+(lbI+1)+" / "+pfList.length;
  var nx=pfList[(lbI+1)%pfList.length],pv=pfList[(lbI-1+pfList.length)%pfList.length];
  new Image().src="images/full/"+nx.id+".webp";new Image().src="images/full/"+pv.id+".webp";
}
function lbOpen(i,btn){lbFrom=btn;lb.hidden=false;document.body.style.overflow="hidden";lbShow(i);$("#lbX").focus()}
function lbClose(){lb.hidden=true;document.body.style.overflow="";lbImg.removeAttribute("src");if(lbFrom)lbFrom.focus()}
$("#lbX").addEventListener("click",lbClose);
$("#lbPrev").addEventListener("click",function(){lbShow(lbI-1)});
$("#lbNext").addEventListener("click",function(){lbShow(lbI+1)});
lb.addEventListener("click",function(e){if(e.target===lb)lbClose()});
document.addEventListener("keydown",function(e){if(lb.hidden)return;if(e.key==="Escape")lbClose();else if(e.key==="ArrowLeft")lbShow(lbI-1);else if(e.key==="ArrowRight")lbShow(lbI+1)});
lb.addEventListener("touchstart",function(e){tx=e.changedTouches[0].clientX},{passive:true});
lb.addEventListener("touchend",function(e){var d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)lbShow(lbI+(d<0?1:-1))},{passive:true});


})();
/* ---- Quick booking form (name, phone, date) ---- */
(function(){
var forms=$$("form.qform");if(!forms.length)return;
var t0=new Date();t0.setMinutes(t0.getMinutes()-t0.getTimezoneOffset());var today=t0.toISOString().slice(0,10);
function fmtDate(v){var p=v.split("-");return p[2]+"/"+p[1]+"/"+p[0]}
var pkg="";try{pkg=new URLSearchParams(location.search).get("pkg")||""}catch(e){}
forms.forEach(function(f){
  var nm=f.elements.name,ph=f.elements.phone,dt=f.elements.date,btn=f.querySelector("button[type=submit]");
  dt.min=today;
  if(pkg){f.elements.pkg.value=pkg;var q=f.querySelector(".qpkg");q.hidden=false;q.textContent="Package selected: "+pkg}
  $$("input",f).forEach(function(el){el.addEventListener("input",function(){var fd=el.closest(".field");if(fd)fd.classList.remove("bad")})});
  f.addEventListener("submit",function(e){
    e.preventDefault();
    var a=nm.value.trim().length>1,b=/^(\+?91[\s-]?)?[6-9]\d{9}$/.test(ph.value.replace(/[\s-]/g,"").replace(/^0/,"")),c=!!dt.value&&dt.value>=today;
    setBad(nm,!a);setBad(ph,!b);setBad(dt,!c);
    if(!(a&&b&&c)){toast("Please complete the highlighted fields.");return}
    var P=f.elements.pkg.value;
    var msg="*NEW DATE ENQUIRY | Rituals Capture Studio*\n\nName: "+nm.value.trim()+"\nPhone: "+ph.value.trim()+"\nRequired Date: "+fmtDate(dt.value)+(P?"\nPackage: "+P:"")+"\n\nPlease confirm availability for my date. Thank you!";
    btn.disabled=true;
    window.open(wa(msg),"_blank","noopener");
    var d={"Name":nm.value.trim(),"Phone":ph.value.trim(),"Required Date":fmtDate(dt.value)};if(P)d["Package"]=P;
    sendLead("Date Enquiry - "+nm.value.trim()+" ("+fmtDate(dt.value)+")",d).then(function(ok){btn.disabled=false;toast(ok?"Thank you! Bikash will contact you shortly to confirm your date.":"Opening WhatsApp with your details. Please send the message to complete your enquiry.")});
  });
});
})();
/* ---- Package tabs ---- */
(function(){
if(!$(".pk-tabs"))return;
/* Package tabs + selection */
var ptabs=$$(".pk-tabs button");
ptabs.forEach(function(b){b.addEventListener("click",function(){
  ptabs.forEach(function(x){x.classList.remove("on");x.setAttribute("aria-selected","false")});
  b.classList.add("on");b.setAttribute("aria-selected","true");
  $$(".pk-panel").forEach(function(p){p.classList.toggle("on",p.id===b.getAttribute("data-p"))});
})});
$$(".pick").forEach(function(b){b.addEventListener("click",function(){
  location.href="book.html?pkg="+encodeURIComponent(b.getAttribute("data-pkg"));
})});


})();
/* ---- Instagram ---- */
(function(){
if(!$("#igFrame"))return;
/* Instagram feed loads only when scrolled into view */
var igf=$("#igFrame");
if(igf){
  if("IntersectionObserver" in window){var io2=new IntersectionObserver(function(es){if(es[0].isIntersecting){igf.src=igf.getAttribute("data-src");io2.disconnect()}},{rootMargin:"300px"});io2.observe(igf)}
  else{igf.src=igf.getAttribute("data-src")}
}


})();
/* ---- Reviews ---- */
(function(){
if(!$("#rvCar"))return;
/* Rotating reviews: shows every review in random order, changes by itself, pauses on hover/touch */
var slides=$$(".rv-slide"),cur=-1,queue=[],paused=false,timer=null;
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function nextIndex(){
  if(!queue.length){
    queue=shuffle(slides.map(function(_,i){return i}));
    if(queue.length>1&&queue[0]===cur){var k=1+Math.floor(Math.random()*(queue.length-1)),t=queue[0];queue[0]=queue[k];queue[k]=t}
  }
  return queue.shift();
}
function show(n){
  cur=n;
  slides.forEach(function(sl,i){sl.classList.toggle("on",i===cur);sl.setAttribute("aria-hidden",i===cur?"false":"true")});
}
function tick(){if(!paused&&!document.hidden)show(nextIndex())}
var car=$("#rvCar");
["mouseenter","touchstart"].forEach(function(ev){car.addEventListener(ev,function(){paused=true},{passive:true})});
["mouseleave","touchend"].forEach(function(ev){car.addEventListener(ev,function(){paused=false},{passive:true})});
show(nextIndex());
timer=setInterval(tick,6000);

})();

/* ---- Hero videos: play the clips in random order, cross-fading; page keeps its normal hero if no clip loads ---- */
(function(){
var hero=$("#home[data-videos]");if(!hero)return;
if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;
var c=navigator.connection||{};if(c.saveData)return;
var list=hero.getAttribute("data-videos").split(",").map(function(x){return x.trim()}).filter(Boolean);
var box=document.createElement("div");box.className="hv";box.setAttribute("aria-hidden","true");hero.insertBefore(box,hero.firstChild);
var vs=[0,1].map(function(){var v=document.createElement("video");v.muted=true;v.defaultMuted=true;v.playsInline=true;v.setAttribute("playsinline","");v.setAttribute("muted","");v.preload="auto";v.disablePictureInPicture=true;box.appendChild(v);return v});
var good=[],queue=[],cur=-1,MAXMS=14000,timer;
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
function nextSrc(){if(!queue.length){queue=shuffle(good.slice());if(queue.length>1&&queue[0]===vs[Math.max(cur,0)]._src)queue.push(queue.shift())}return queue.shift()}
function play(){
  clearTimeout(timer);
  var n=nextSrc();if(!n)return;
  cur=cur===0?1:0;
  var v=vs[cur],o=vs[1-cur];
  v._src=n;v.src=n;v.currentTime=0;
  var go=function(){v.loop=good.length===1;v.play().then(function(){v.classList.add("on");o.classList.remove("on");hero.classList.add("vid-on");if(good.length>1)timer=setTimeout(play,Math.min(MAXMS,Math.max(4000,(v.duration||8)*1000-900)))}).catch(function(){})};
  if(v.readyState>=3)go();else v.addEventListener("canplay",go,{once:true});
}
var pending=list.length;
list.forEach(function(src){
  var p=document.createElement("video");p.preload="metadata";
  p.addEventListener("loadedmetadata",function(){good.push(src);done()},{once:true});
  p.addEventListener("error",function(){done()},{once:true});
  p.src=src;
});
function done(){pending--;if(pending===0){if(good.length)play();else box.remove()}}
document.addEventListener("visibilitychange",function(){var v=vs[Math.max(cur,0)];if(!v||!v._src)return;if(document.hidden){v.pause();clearTimeout(timer)}else{v.play().catch(function(){});if(good.length>1)timer=setTimeout(play,4000)}});
})();

/* ---- Portfolio: slow film behind the page heading for categories that have one (videos/portfolio-<category>.mp4) ---- */
(function(){
var sec=$("#portfolio"),fil=$("#pfFilters");if(!sec||!fil)return;
if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;
var nc=navigator.connection||{};if(nc.saveData)return;
var RATE=0.5,box=null,vids={},bad={},cur=null;
function size(){if(box)box.style.height=Math.round(fil.getBoundingClientRect().bottom-sec.getBoundingClientRect().top+34)+"px"}
function make(f){
  var v=document.createElement("video");v.muted=true;v.defaultMuted=true;v.playsInline=true;v.setAttribute("playsinline","");v.setAttribute("muted","");v.loop=true;v.preload="auto";v.disablePictureInPicture=true;
  v.defaultPlaybackRate=RATE;v.playbackRate=RATE;
  v.addEventListener("loadedmetadata",function(){v.playbackRate=RATE});
  v.addEventListener("playing",function(){v.playbackRate=RATE;if(cur===f){v.classList.add("on");box.classList.add("ready");sec.classList.add("pf-vid")}});
  v.addEventListener("error",function(){bad[f]=1;if(cur===f)hide()});
  v.src="videos/portfolio-"+f+".mp4";box.appendChild(v);vids[f]=v;return v;
}
function hide(){
  sec.classList.remove("pf-vid");if(box)box.classList.remove("ready");
  Object.keys(vids).forEach(function(k){vids[k].pause();vids[k].classList.remove("on")});
}
function set(f){
  if(f===cur)return;
  hide();cur=f;
  if(!f||bad[f])return;
  if(!box){box=document.createElement("div");box.className="pfv show";box.setAttribute("aria-hidden","true");sec.insertBefore(box,sec.firstChild)}
  size();
  var v=vids[f]||make(f);
  v.currentTime=0;v.play().catch(function(){});
}
fil.addEventListener("click",function(e){var b=e.target.closest("button[data-f]");if(!b)return;var f=b.getAttribute("data-f");setTimeout(function(){set(f==="all"?null:f)},0)});
addEventListener("resize",size);
document.addEventListener("visibilitychange",function(){var v=cur&&vids[cur];if(!v)return;if(document.hidden)v.pause();else v.play().catch(function(){})});
})();

/* ---- Soft background films: sections with data-bgvideos cross-fade through their clips at low opacity ---- */
(function(){
var secs=$$("[data-bgvideos]");if(!secs.length)return;
if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;
var nc=navigator.connection||{};if(nc.saveData)return;
var FADE=2600;
secs.forEach(function(sec){
  if(sec.id==="home")return;
  var list=sec.getAttribute("data-bgvideos").split(",").map(function(x){return x.trim()}).filter(Boolean);
  var box=document.createElement("div");box.className="bgv";box.setAttribute("aria-hidden","true");
  var vs=[0,1].map(function(){var v=document.createElement("video");v.muted=true;v.defaultMuted=true;v.playsInline=true;v.setAttribute("playsinline","");v.setAttribute("muted","");v.preload="auto";v.disablePictureInPicture=true;box.appendChild(v);return v});
  var vg=document.createElement("i");vg.className="bgv-vig";box.appendChild(vg);
  var good=[],queue=[],cur=-1,timer,visible=false,started=false,pending=list.length;
  function shuf(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
  function nextSrc(){if(!queue.length){queue=shuf(good.slice());if(queue.length>1&&cur>=0&&queue[0]===vs[cur]._src)queue.push(queue.shift())}return queue.shift()}
  function play(){
    clearTimeout(timer);if(!visible||document.hidden)return;
    var n=nextSrc();if(!n)return;
    var o=cur>=0?vs[cur]:null;cur=cur===0?1:0;var v=vs[cur];
    v._src=n;v.src=n;v.currentTime=0;
    v.play().then(function(){
      v.classList.add("on");if(o&&o!==v)o.classList.remove("on");
      var d=(v.duration||8)*1000;
      timer=setTimeout(play,Math.max(3500,Math.min(d-FADE,14000)));
    }).catch(function(){});
  }
  function begin(){if(started||!good.length)return;started=true;sec.insertBefore(box,sec.firstChild);sec.classList.add("has-bgv");play()}
  list.forEach(function(src){
    var p=document.createElement("video");p.preload="metadata";
    p.addEventListener("loadedmetadata",function(){good.push(src);done()},{once:true});
    p.addEventListener("error",function(){done()},{once:true});
    p.src=src;
  });
  function done(){pending--;if(pending===0&&good.length){
    if("IntersectionObserver" in window){new IntersectionObserver(function(es){var was=visible;visible=es[0].isIntersecting;if(visible){if(!started)begin();else if(!was)play()}else{clearTimeout(timer);vs.forEach(function(v){v.pause()})}},{rootMargin:"120px"}).observe(sec)}
    else{visible=true;begin()}
  }}
  document.addEventListener("visibilitychange",function(){if(!started)return;if(document.hidden){clearTimeout(timer);vs.forEach(function(v){v.pause()})}else if(visible){var v=vs[Math.max(cur,0)];if(v&&v.src)v.play().catch(function(){});timer=setTimeout(play,3000)}});
});
})();
})();
