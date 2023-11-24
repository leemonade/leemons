try{
var Vr=Object.defineProperty;var w=(o,e)=>()=>(o&&(e=o(o=0)),e);var It=(o,e)=>{for(var t in e)Vr(o,t,{get:e[t],enumerable:!0})};var u=w(()=>{});var g,p=w(()=>{g={NODE_ENV:"production",NODE_PATH:[],STORYBOOK:"true",PUBLIC_URL:"."}});var h=w(()=>{});var qn,Jn,Qn,es,ts,os,rs,is,ns,ss,as,ls,M,cs,ds,us,ps,m,hs,fs,ms,gs,vs,ys,bs,B=w(()=>{u();p();h();qn=__STORYBOOKTHEMING__,{CacheProvider:Jn,ClassNames:Qn,Global:es,ThemeProvider:ts,background:os,color:rs,convert:is,create:ns,createCache:ss,createGlobal:as,createReset:ls,css:M,darken:cs,ensure:ds,ignoreSsrWarning:us,isPropValid:ps,jsx:m,keyframes:hs,lighten:fs,styled:ms,themes:gs,typography:vs,useTheme:ys,withTheme:bs}=__STORYBOOKTHEMING__});var Pe={};It(Pe,{Children:()=>Zr,Component:()=>Gr,Fragment:()=>N,Profiler:()=>Xr,PureComponent:()=>Kr,StrictMode:()=>qr,Suspense:()=>qe,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:()=>Jr,cloneElement:()=>Qr,createContext:()=>ei,createElement:()=>ti,createFactory:()=>oi,createRef:()=>ri,default:()=>Wr,forwardRef:()=>ii,isValidElement:()=>ni,lazy:()=>Je,memo:()=>si,useCallback:()=>j,useContext:()=>ai,useDebugValue:()=>li,useEffect:()=>L,useImperativeHandle:()=>ci,useLayoutEffect:()=>di,useMemo:()=>ee,useReducer:()=>ui,useRef:()=>pi,useState:()=>T,version:()=>hi});var Wr,Zr,Gr,N,Xr,Kr,qr,qe,Jr,Qr,ei,ti,oi,ri,ii,ni,Je,si,j,ai,li,L,ci,di,ee,ui,pi,T,hi,H=w(()=>{u();p();h();Wr=__REACT__,{Children:Zr,Component:Gr,Fragment:N,Profiler:Xr,PureComponent:Kr,StrictMode:qr,Suspense:qe,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:Jr,cloneElement:Qr,createContext:ei,createElement:ti,createFactory:oi,createRef:ri,forwardRef:ii,isValidElement:ni,lazy:Je,memo:si,useCallback:j,useContext:ai,useDebugValue:li,useEffect:L,useImperativeHandle:ci,useLayoutEffect:di,useMemo:ee,useReducer:ui,useRef:pi,useState:T,version:hi}=__REACT__});var ks,Ns,Rs,Bs,js,Ls,Hs,Is,Fs,Ds,Us,zs,Vs,Ys,Ut,Ws,Zs,Gs,Xs,Ks,qs,Js,Qs,Me,ea,Te,ta,oa,pe,ra,ia,na,sa,W,aa,la,ca,zt,da,ua,pa,ha,fa,ma,ga,va,ya,ba,xa,Vt,_a,wa,$a,Sa,Ea,Aa,Ca,Pa,Ma,Ta,Oa,ka,Na,Ra,Ba,ja,La,Z=w(()=>{u();p();h();ks=__STORYBOOKCOMPONENTS__,{A:Ns,ActionBar:Rs,AddonPanel:Bs,Badge:js,Bar:Ls,Blockquote:Hs,Button:Is,ClipboardCode:Fs,Code:Ds,DL:Us,Div:zs,DocumentWrapper:Vs,ErrorFormatter:Ys,FlexBar:Ut,Form:Ws,H1:Zs,H2:Gs,H3:Xs,H4:Ks,H5:qs,H6:Js,HR:Qs,IconButton:Me,IconButtonSkeleton:ea,Icons:Te,Img:ta,LI:oa,Link:pe,ListItem:ra,Loader:ia,OL:na,P:sa,Placeholder:W,Pre:aa,ResetWrapper:la,ScrollArea:ca,Separator:zt,Spaced:da,Span:ua,StorybookIcon:pa,StorybookLogo:ha,Symbols:fa,SyntaxHighlighter:ma,TT:ga,TabBar:va,TabButton:ya,TabWrapper:ba,Table:xa,Tabs:Vt,TabsState:_a,TooltipLinkList:wa,TooltipMessage:$a,TooltipNote:Sa,UL:Ea,WithTooltip:Aa,WithTooltipPure:Ca,Zoom:Pa,codeCommon:Ma,components:Ta,createCopyToClipboardFunction:Oa,getStoryHref:ka,icons:Na,interleaveSeparators:Ra,nameSpaceClassNames:Ba,resetComponents:ja,withReset:La}=__STORYBOOKCOMPONENTS__});var Qe,Oe,fi,mi,gi,Yt,Wt,Zt,et=w(()=>{u();p();h();H();B();Z();Qe=function(o,e){return Object.defineProperty?Object.defineProperty(o,"raw",{value:e}):o.raw=e,o},Oe=function(o){var e=o.config,t=o.defer,r=t===void 0?!1:t,i=T(r?void 0:e.url),n=i[0],s=i[1],d=T(!1),a=d[0],l=d[1];return L(function(){if(r){var c=requestAnimationFrame(function(){s(e.url)});return function(){return cancelAnimationFrame(c)}}},[r,e.url]),L(function(){l(!1)},[n]),m("div",{css:fi},!a&&m(W,{css:mi},"Loading..."),m("iframe",{css:gi,src:n,allowFullScreen:e.allowFullscreen,onLoad:function(){return l(!0)}}))},fi=M(Yt||(Yt=Qe([`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  overflow: hidden;
`],[`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  overflow: hidden;
`]))),mi=M(Wt||(Wt=Qe([`
  position: absolute;
  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%);
`],[`
  position: absolute;
  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%);
`]))),gi=M(Zt||(Zt=Qe([`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;

  z-index: 1;
`],[`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;

  z-index: 1;
`])))});var tt,vi,Gt,ot=w(()=>{u();p();h();H();B();et();tt=/https:\/\/([w.-]+.)?figma.com\/(file|proto)\/([0-9a-zA-Z]{22,128})(?:\/.*)?$/,vi=function(o){return tt.test(o)},Gt=function(o){var e=o.config,t=ee(function(){var r=vi(e.url);if(!r)return console.warn(`[storybook-addon-designs] The URL you specified is not valid Figma URL.
The addon fallbacks to normal iframe mode.For more detail, please check <https://www.figma.com/developers/embed>.`),e;var i=e.embedHost||location.hostname,n="https://www.figma.com/embed?embed_host="+i+"&url="+e.url;return{url:n,allowFullscreen:e.allowFullscreen}},[e.url,e.allowFullscreen,e.embedHost]);return m(Oe,{defer:!0,config:t})}});var ke,Ne,nt,uo,he,po,O,st,Re,at=w(()=>{u();p();h();ke=window,Ne=ke.ShadowRoot&&(ke.ShadyCSS===void 0||ke.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,nt=Symbol(),uo=new WeakMap,he=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==nt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(Ne&&e===void 0){let r=t!==void 0&&t.length===1;r&&(e=uo.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&uo.set(t,e))}return e}toString(){return this.cssText}},po=o=>new he(typeof o=="string"?o:o+"",void 0,nt),O=(o,...e)=>{let t=o.length===1?o[0]:e.reduce((r,i,n)=>r+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+o[n+1],o[0]);return new he(t,o,nt)},st=(o,e)=>{Ne?o.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet):e.forEach(t=>{let r=document.createElement("style"),i=ke.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=t.cssText,o.appendChild(r)})},Re=Ne?o=>o:o=>o instanceof CSSStyleSheet?(e=>{let t="";for(let r of e.cssRules)t+=r.cssText;return po(t)})(o):o});var lt,Be,ho,Ei,fo,dt,mo,ct,ut,z,je=w(()=>{u();p();h();at();at();Be=window,ho=Be.trustedTypes,Ei=ho?ho.emptyScript:"",fo=Be.reactiveElementPolyfillSupport,dt={toAttribute(o,e){switch(e){case Boolean:o=o?Ei:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,e){let t=o;switch(e){case Boolean:t=o!==null;break;case Number:t=o===null?null:Number(o);break;case Object:case Array:try{t=JSON.parse(o)}catch{t=null}}return t}},mo=(o,e)=>e!==o&&(e==e||o==o),ct={attribute:!0,type:String,converter:dt,reflect:!1,hasChanged:mo},ut="finalized",z=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(e){var t;this.finalize(),((t=this.h)!==null&&t!==void 0?t:this.h=[]).push(e)}static get observedAttributes(){this.finalize();let e=[];return this.elementProperties.forEach((t,r)=>{let i=this._$Ep(r,t);i!==void 0&&(this._$Ev.set(i,r),e.push(i))}),e}static createProperty(e,t=ct){if(t.state&&(t.attribute=!1),this.finalize(),this.elementProperties.set(e,t),!t.noAccessor&&!this.prototype.hasOwnProperty(e)){let r=typeof e=="symbol"?Symbol():"__"+e,i=this.getPropertyDescriptor(e,r,t);i!==void 0&&Object.defineProperty(this.prototype,e,i)}}static getPropertyDescriptor(e,t,r){return{get(){return this[t]},set(i){let n=this[e];this[t]=i,this.requestUpdate(e,n,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)||ct}static finalize(){if(this.hasOwnProperty(ut))return!1;this[ut]=!0;let e=Object.getPrototypeOf(this);if(e.finalize(),e.h!==void 0&&(this.h=[...e.h]),this.elementProperties=new Map(e.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){let t=this.properties,r=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(let i of r)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let r=new Set(e.flat(1/0).reverse());for(let i of r)t.unshift(Re(i))}else e!==void 0&&t.push(Re(e));return t}static _$Ep(e,t){let r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}_$Eu(){var e;this._$E_=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(e=this.constructor.h)===null||e===void 0||e.forEach(t=>t(this))}addController(e){var t,r;((t=this._$ES)!==null&&t!==void 0?t:this._$ES=[]).push(e),this.renderRoot!==void 0&&this.isConnected&&((r=e.hostConnected)===null||r===void 0||r.call(e))}removeController(e){var t;(t=this._$ES)===null||t===void 0||t.splice(this._$ES.indexOf(e)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((e,t)=>{this.hasOwnProperty(t)&&(this._$Ei.set(t,this[t]),delete this[t])})}createRenderRoot(){var e;let t=(e=this.shadowRoot)!==null&&e!==void 0?e:this.attachShadow(this.constructor.shadowRootOptions);return st(t,this.constructor.elementStyles),t}connectedCallback(){var e;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$ES)===null||e===void 0||e.forEach(t=>{var r;return(r=t.hostConnected)===null||r===void 0?void 0:r.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$ES)===null||e===void 0||e.forEach(t=>{var r;return(r=t.hostDisconnected)===null||r===void 0?void 0:r.call(t)})}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$EO(e,t,r=ct){var i;let n=this.constructor._$Ep(e,r);if(n!==void 0&&r.reflect===!0){let s=(((i=r.converter)===null||i===void 0?void 0:i.toAttribute)!==void 0?r.converter:dt).toAttribute(t,r.type);this._$El=e,s==null?this.removeAttribute(n):this.setAttribute(n,s),this._$El=null}}_$AK(e,t){var r;let i=this.constructor,n=i._$Ev.get(e);if(n!==void 0&&this._$El!==n){let s=i.getPropertyOptions(n),d=typeof s.converter=="function"?{fromAttribute:s.converter}:((r=s.converter)===null||r===void 0?void 0:r.fromAttribute)!==void 0?s.converter:dt;this._$El=n,this[n]=d.fromAttribute(t,s.type),this._$El=null}}requestUpdate(e,t,r){let i=!0;e!==void 0&&(((r=r||this.constructor.getPropertyOptions(e)).hasChanged||mo)(this[e],t)?(this._$AL.has(e)||this._$AL.set(e,t),r.reflect===!0&&this._$El!==e&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(e,r))):i=!1),!this.isUpdatePending&&i&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((i,n)=>this[n]=i),this._$Ei=void 0);let t=!1,r=this._$AL;try{t=this.shouldUpdate(r),t?(this.willUpdate(r),(e=this._$ES)===null||e===void 0||e.forEach(i=>{var n;return(n=i.hostUpdate)===null||n===void 0?void 0:n.call(i)}),this.update(r)):this._$Ek()}catch(i){throw t=!1,this._$Ek(),i}t&&this._$AE(r)}willUpdate(e){}_$AE(e){var t;(t=this._$ES)===null||t===void 0||t.forEach(r=>{var i;return(i=r.hostUpdated)===null||i===void 0?void 0:i.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(e){return!0}update(e){this._$EC!==void 0&&(this._$EC.forEach((t,r)=>this._$EO(r,this[r],t)),this._$EC=void 0),this._$Ek()}updated(e){}firstUpdated(e){}};z[ut]=!0,z.elementProperties=new Map,z.elementStyles=[],z.shadowRootOptions={mode:"open"},fo?.({ReactiveElement:z}),((lt=Be.reactiveElementVersions)!==null&&lt!==void 0?lt:Be.reactiveElementVersions=[]).push("1.6.3")});function Co(o,e){if(!Array.isArray(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return go!==void 0?go.createHTML(e):e}function le(o,e,t=o,r){var i,n,s,d;if(e===V)return e;let a=r!==void 0?(i=t._$Co)===null||i===void 0?void 0:i[r]:t._$Cl,l=ge(e)?void 0:e._$litDirective$;return a?.constructor!==l&&((n=a?._$AO)===null||n===void 0||n.call(a,!1),l===void 0?a=void 0:(a=new l(o),a._$AT(o,t,r)),r!==void 0?((s=(d=t)._$Co)!==null&&s!==void 0?s:d._$Co=[])[r]=a:t._$Cl=a),a!==void 0&&(e=le(o,a._$AS(o,e.values),a,r)),e}var pt,Le,ae,go,ft,G,$o,Ai,re,me,ge,So,Ci,ht,fe,vo,yo,te,bo,xo,Eo,Ao,S,k,V,C,_o,oe,Pi,ve,mt,ye,ce,gt,Mi,vt,yt,bt,wo,Po,be=w(()=>{u();p();h();Le=window,ae=Le.trustedTypes,go=ae?ae.createPolicy("lit-html",{createHTML:o=>o}):void 0,ft="$lit$",G=`lit$${(Math.random()+"").slice(9)}$`,$o="?"+G,Ai=`<${$o}>`,re=document,me=()=>re.createComment(""),ge=o=>o===null||typeof o!="object"&&typeof o!="function",So=Array.isArray,Ci=o=>So(o)||typeof o?.[Symbol.iterator]=="function",ht=`[ 	
\f\r]`,fe=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,vo=/-->/g,yo=/>/g,te=RegExp(`>|${ht}(?:([^\\s"'>=/]+)(${ht}*=${ht}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),bo=/'/g,xo=/"/g,Eo=/^(?:script|style|textarea|title)$/i,Ao=o=>(e,...t)=>({_$litType$:o,strings:e,values:t}),S=Ao(1),k=Ao(2),V=Symbol.for("lit-noChange"),C=Symbol.for("lit-nothing"),_o=new WeakMap,oe=re.createTreeWalker(re,129,null,!1);Pi=(o,e)=>{let t=o.length-1,r=[],i,n=e===2?"<svg>":"",s=fe;for(let d=0;d<t;d++){let a=o[d],l,c,f=-1,x=0;for(;x<a.length&&(s.lastIndex=x,c=s.exec(a),c!==null);)x=s.lastIndex,s===fe?c[1]==="!--"?s=vo:c[1]!==void 0?s=yo:c[2]!==void 0?(Eo.test(c[2])&&(i=RegExp("</"+c[2],"g")),s=te):c[3]!==void 0&&(s=te):s===te?c[0]===">"?(s=i??fe,f=-1):c[1]===void 0?f=-2:(f=s.lastIndex-c[2].length,l=c[1],s=c[3]===void 0?te:c[3]==='"'?xo:bo):s===xo||s===bo?s=te:s===vo||s===yo?s=fe:(s=te,i=void 0);let _=s===te&&o[d+1].startsWith("/>")?" ":"";n+=s===fe?a+Ai:f>=0?(r.push(l),a.slice(0,f)+ft+a.slice(f)+G+_):a+G+(f===-2?(r.push(void 0),d):_)}return[Co(o,n+(o[t]||"<?>")+(e===2?"</svg>":"")),r]},ve=class o{constructor({strings:e,_$litType$:t},r){let i;this.parts=[];let n=0,s=0,d=e.length-1,a=this.parts,[l,c]=Pi(e,t);if(this.el=o.createElement(l,r),oe.currentNode=this.el.content,t===2){let f=this.el.content,x=f.firstChild;x.remove(),f.append(...x.childNodes)}for(;(i=oe.nextNode())!==null&&a.length<d;){if(i.nodeType===1){if(i.hasAttributes()){let f=[];for(let x of i.getAttributeNames())if(x.endsWith(ft)||x.startsWith(G)){let _=c[s++];if(f.push(x),_!==void 0){let b=i.getAttribute(_.toLowerCase()+ft).split(G),$=/([.?@])?(.*)/.exec(_);a.push({type:1,index:n,name:$[2],strings:b,ctor:$[1]==="."?gt:$[1]==="?"?vt:$[1]==="@"?yt:ce})}else a.push({type:6,index:n})}for(let x of f)i.removeAttribute(x)}if(Eo.test(i.tagName)){let f=i.textContent.split(G),x=f.length-1;if(x>0){i.textContent=ae?ae.emptyScript:"";for(let _=0;_<x;_++)i.append(f[_],me()),oe.nextNode(),a.push({type:2,index:++n});i.append(f[x],me())}}}else if(i.nodeType===8)if(i.data===$o)a.push({type:2,index:n});else{let f=-1;for(;(f=i.data.indexOf(G,f+1))!==-1;)a.push({type:7,index:n}),f+=G.length-1}n++}}static createElement(e,t){let r=re.createElement("template");return r.innerHTML=e,r}};mt=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var t;let{el:{content:r},parts:i}=this._$AD,n=((t=e?.creationScope)!==null&&t!==void 0?t:re).importNode(r,!0);oe.currentNode=n;let s=oe.nextNode(),d=0,a=0,l=i[0];for(;l!==void 0;){if(d===l.index){let c;l.type===2?c=new ye(s,s.nextSibling,this,e):l.type===1?c=new l.ctor(s,l.name,l.strings,this,e):l.type===6&&(c=new bt(s,this,e)),this._$AV.push(c),l=i[++a]}d!==l?.index&&(s=oe.nextNode(),d++)}return oe.currentNode=re,n}v(e){let t=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}},ye=class o{constructor(e,t,r,i){var n;this.type=2,this._$AH=C,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=i,this._$Cp=(n=i?.isConnected)===null||n===void 0||n}get _$AU(){var e,t;return(t=(e=this._$AM)===null||e===void 0?void 0:e._$AU)!==null&&t!==void 0?t:this._$Cp}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=le(this,e,t),ge(e)?e===C||e==null||e===""?(this._$AH!==C&&this._$AR(),this._$AH=C):e!==this._$AH&&e!==V&&this._(e):e._$litType$!==void 0?this.g(e):e.nodeType!==void 0?this.$(e):Ci(e)?this.T(e):this._(e)}k(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}$(e){this._$AH!==e&&(this._$AR(),this._$AH=this.k(e))}_(e){this._$AH!==C&&ge(this._$AH)?this._$AA.nextSibling.data=e:this.$(re.createTextNode(e)),this._$AH=e}g(e){var t;let{values:r,_$litType$:i}=e,n=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=ve.createElement(Co(i.h,i.h[0]),this.options)),i);if(((t=this._$AH)===null||t===void 0?void 0:t._$AD)===n)this._$AH.v(r);else{let s=new mt(n,this),d=s.u(this.options);s.v(r),this.$(d),this._$AH=s}}_$AC(e){let t=_o.get(e.strings);return t===void 0&&_o.set(e.strings,t=new ve(e)),t}T(e){So(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,r,i=0;for(let n of e)i===t.length?t.push(r=new o(this.k(me()),this.k(me()),this,this.options)):r=t[i],r._$AI(n),i++;i<t.length&&(this._$AR(r&&r._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){var r;for((r=this._$AP)===null||r===void 0||r.call(this,!1,!0,t);e&&e!==this._$AB;){let i=e.nextSibling;e.remove(),e=i}}setConnected(e){var t;this._$AM===void 0&&(this._$Cp=e,(t=this._$AP)===null||t===void 0||t.call(this,e))}},ce=class{constructor(e,t,r,i,n){this.type=1,this._$AH=C,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=C}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(e,t=this,r,i){let n=this.strings,s=!1;if(n===void 0)e=le(this,e,t,0),s=!ge(e)||e!==this._$AH&&e!==V,s&&(this._$AH=e);else{let d=e,a,l;for(e=n[0],a=0;a<n.length-1;a++)l=le(this,d[r+a],t,a),l===V&&(l=this._$AH[a]),s||(s=!ge(l)||l!==this._$AH[a]),l===C?e=C:e!==C&&(e+=(l??"")+n[a+1]),this._$AH[a]=l}s&&!i&&this.j(e)}j(e){e===C?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},gt=class extends ce{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===C?void 0:e}},Mi=ae?ae.emptyScript:"",vt=class extends ce{constructor(){super(...arguments),this.type=4}j(e){e&&e!==C?this.element.setAttribute(this.name,Mi):this.element.removeAttribute(this.name)}},yt=class extends ce{constructor(e,t,r,i,n){super(e,t,r,i,n),this.type=5}_$AI(e,t=this){var r;if((e=(r=le(this,e,t,0))!==null&&r!==void 0?r:C)===V)return;let i=this._$AH,n=e===C&&i!==C||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,s=e!==C&&(i===C||n);n&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,r;typeof this._$AH=="function"?this._$AH.call((r=(t=this.options)===null||t===void 0?void 0:t.host)!==null&&r!==void 0?r:this.element,e):this._$AH.handleEvent(e)}},bt=class{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){le(this,e)}},wo=Le.litHtmlPolyfillSupport;wo?.(ve,ye),((pt=Le.litHtmlVersions)!==null&&pt!==void 0?pt:Le.litHtmlVersions=[]).push("2.8.0");Po=(o,e,t)=>{var r,i;let n=(r=t?.renderBefore)!==null&&r!==void 0?r:e,s=n._$litPart$;if(s===void 0){let d=(i=t?.renderBefore)!==null&&i!==void 0?i:null;n._$litPart$=s=new ye(e.insertBefore(me(),d),d,void 0,t??{})}return s._$AI(o),s}});var xt,_t,F,Mo,To=w(()=>{u();p();h();je();je();be();be();F=class extends z{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,t;let r=super.createRenderRoot();return(e=(t=this.renderOptions).renderBefore)!==null&&e!==void 0||(t.renderBefore=r.firstChild),r}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Po(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)===null||e===void 0||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)===null||e===void 0||e.setConnected(!1)}render(){return V}};F.finalized=!0,F._$litElement$=!0,(xt=globalThis.litElementHydrateSupport)===null||xt===void 0||xt.call(globalThis,{LitElement:F});Mo=globalThis.litElementPolyfillSupport;Mo?.({LitElement:F});((_t=globalThis.litElementVersions)!==null&&_t!==void 0?_t:globalThis.litElementVersions=[]).push("3.3.3")});var Oo=w(()=>{u();p();h();});var D=w(()=>{u();p();h();je();be();To();Oo()});var ko=w(()=>{u();p();h();});function P(o){return(e,t)=>t!==void 0?Oi(o,e,t):Ti(o,e)}var Ti,Oi,wt=w(()=>{u();p();h();Ti=(o,e)=>e.kind==="method"&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(t){t.createProperty(e.key,o)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){typeof e.initializer=="function"&&(this[e.key]=e.initializer.call(this))},finisher(t){t.createProperty(e.key,o)}},Oi=(o,e,t)=>{e.constructor.createProperty(t,o)}});var No=w(()=>{u();p();h();wt();});var ie=w(()=>{u();p();h();});var Ro=w(()=>{u();p();h();ie();});var Bo=w(()=>{u();p();h();ie();});var jo=w(()=>{u();p();h();ie();});var Lo=w(()=>{u();p();h();ie();});var $t,hd,St=w(()=>{u();p();h();ie();hd=(($t=window.HTMLSlotElement)===null||$t===void 0?void 0:$t.prototype.assignedElements)!=null?(o,e)=>o.assignedElements(e):(o,e)=>o.assignedNodes(e).filter(t=>t.nodeType===Node.ELEMENT_NODE)});var Ho=w(()=>{u();p();h();ie();St();});var de=w(()=>{u();p();h();ko();wt();No();Ro();Bo();jo();Lo();St();Ho()});var Y,Io,He=w(()=>{u();p();h();D();Y=({title:o,children:e})=>S`
  <div class="error-background">
    <div class="error-container">
      <span class="error-title"
        ><span class="error-badge">Error</span>${o}</span
      >
      <span class="error-description">${e}</span>
    </div>
  </div>
`,Io=O`
  .error-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background: var(--error-bg);
    color: var(--error-fg);
  }

  .error-container {
    max-width: 800px;
    margin: auto;
    padding: 1em;
  }

  .error-badge {
    display: inline-block;
    font-size: 0.8em;
    padding: 0.2em 0.5em;
    margin-inline-end: 0.5em;

    background: var(--error-color);
    border-radius: 2px;
    color: var(--error-bg);
    text-transform: uppercase;
  }

  .error-title {
    display: block;
    font-size: 1.2em;

    font-weight: bold;
    text-transform: capitalize;
  }

  .error-description {
    display: block;
    margin-block-start: 1em;
  }
`});var Fo,Do,Ie,Uo=w(()=>{u();p();h();Fo={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Do=o=>(...e)=>({_$litDirective$:o,values:e}),Ie=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,r){this._$Ct=e,this._$AM=t,this._$Ci=r}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}});var zo,ki,ne,Vo=w(()=>{u();p();h();be();Uo();zo="important",ki=" !"+zo,ne=Do(class extends Ie{constructor(o){var e;if(super(o),o.type!==Fo.ATTRIBUTE||o.name!=="style"||((e=o.strings)===null||e===void 0?void 0:e.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(o){return Object.keys(o).reduce((e,t)=>{let r=o[t];return r==null?e:e+`${t=t.includes("-")?t:t.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${r};`},"")}update(o,[e]){let{style:t}=o.element;if(this.ht===void 0){this.ht=new Set;for(let r in e)this.ht.add(r);return this.render(e)}this.ht.forEach(r=>{e[r]==null&&(this.ht.delete(r),r.includes("-")?t.removeProperty(r):t[r]="")});for(let r in e){let i=e[r];if(i!=null){this.ht.add(r);let n=typeof i=="string"&&i.endsWith(ki);r.includes("-")||n?t.setProperty(r,n?i.slice(0,-11):i,n?zo:""):t[r]=i}}return V}})});var Fe=w(()=>{u();p();h();Vo()});function Yo(o){return{top:o.y,right:o.x+o.width,bottom:o.y+o.height,left:o.x}}function Zo(o,e){let t=Yo(o),r=Yo(e),i=!(t.top>r.bottom||t.bottom<r.top),n=!(t.left>r.right||t.right<r.left);if(n&&i){let c={x:(Math.max(t.left,r.left)+Math.min(t.right,r.right))/2,y:(Math.max(t.top,r.top)+Math.min(t.bottom,r.bottom))/2};return[{points:[{x:t.left,y:c.y},{x:r.left,y:c.y}]},{points:[{x:t.right,y:c.y},{x:r.right,y:c.y}]},{points:[{y:t.top,x:c.x},{y:r.top,x:c.x}]},{points:[{y:t.bottom,x:c.x},{y:r.bottom,x:c.x}]}]}let s=t.left>r.right,d=t.top>r.bottom,a={x:o.x+o.width/2,y:o.y+o.height/2};return[n?null:{points:[{x:s?t.left:t.right,y:a.y},{x:s?r.right:r.left,y:a.y}],bisector:i?void 0:[{x:s?r.right:r.left,y:a.y},{x:s?r.right:r.left,y:d?r.bottom:r.top}]},i?null:{points:[{y:d?t.top:t.bottom,x:a.x},{y:d?r.bottom:r.top,x:a.x}],bisector:n?void 0:[{y:d?r.bottom:r.top,x:a.x},{y:d?r.bottom:r.top,x:s?r.right:r.left}]}].filter(c=>!!c)}function _e(o){return Math.round(o*100)/100}function De(o,e){return[...Wo(o),...Wo(e)]}function Wo(o){return o?o instanceof Array?o:[o]:[]}var we=w(()=>{u();p();h()});var Ni,Go,Xo=w(()=>{u();p();h();de();Ni=function(o,e,t,r){var i=arguments.length,n=i<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,t):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(o,e,t,r);else for(var d=o.length-1;d>=0;d--)(s=o[d])&&(n=(i<3?s(n):i>3?s(e,t,n):s(e,t))||n);return i>3&&n&&Object.defineProperty(e,t,n),n},Go=o=>{class e extends o{constructor(...r){super(...r),this.selectedNode=null}updated(r){super.updated(r),r.has("selectedNode")&&this.dispatchEvent(new CustomEvent("nodeselect",{detail:{selectedNode:this.selectedNode}}))}}return Ni([P({attribute:!1})],e.prototype,"selectedNode",void 0),e}});function Ue(o){return o.touches.length===0||o.touches.length>2}function Ri(o,e){return Math.sqrt(Math.pow(o.x-e.x,2)+Math.pow(o.y-e.y,2))}var Ko,qo=w(()=>{u();p();h();Ko=o=>class extends o{constructor(...t){super(...t),this.previousTouches=null,this.addEventListener("touchstart",r=>{Ue(r)||(r.preventDefault(),this.previousTouches=r.touches)}),this.addEventListener("touchend",r=>{Ue(r)||(r.preventDefault(),this.previousTouches=null)}),this.addEventListener("touchcancel",r=>{Ue(r)||(r.preventDefault(),this.previousTouches=null)}),this.addEventListener("touchmove",r=>{if(Ue(r))return;let i=Array.from(this.previousTouches||[]),n=Array.from(r.touches);if(this.previousTouches=r.touches,!(n.length!==i.length||!n.every(s=>i.some(d=>d.identifier===s.identifier)))){if(n.length===1){this.onTouchPan({x:n[0].pageX-i[0].pageX,y:n[0].pageY-i[0].pageY});return}this.onTouchPinch(Ri({x:n[0].pageX,y:n[0].pageY},{x:i[0].pageX,y:i[0].pageY}))}})}get isTouching(){return!!(this.previousTouches&&this.previousTouches.length>0)}onTouchPan(t){}onTouchPinch(t){}}});var $e,U,Jo,Qo,er=w(()=>{u();p();h();de();qo();$e=function(o,e,t,r){var i=arguments.length,n=i<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,t):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(o,e,t,r);else for(var d=o.length-1;d>=0;d--)(s=o[d])&&(n=(i<3?s(n):i>3?s(e,t,n):s(e,t))||n);return i>3&&n&&Object.defineProperty(e,t,n),n},U=function(o,e,t,r){if(t==="a"&&!r)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?o!==e||!r:!e.has(o))throw new TypeError("Cannot read private member from an object whose class did not declare it");return t==="m"?r:t==="a"?r.call(o):r?r.value:e.get(o)},Jo=function(o,e,t,r,i){if(r==="m")throw new TypeError("Private method is not writable");if(r==="a"&&!i)throw new TypeError("Private accessor was defined without a setter");if(typeof e=="function"?o!==e||!i:!e.has(o))throw new TypeError("Cannot write private member to an object whose class did not declare it");return r==="a"?i.call(o,t):i?i.value=t:e.set(o,t),t},Qo=o=>{var e,t,r,i,n;class s extends Ko(o){constructor(...a){super(...a),this.panX=0,this.panY=0,this.scale=1,this.zoomSpeed=500,this.panSpeed=500,e.set(this,!1),t.set(this,(c,f)=>{this.panX+=c/this.scale/window.devicePixelRatio,this.panY+=f/this.scale/window.devicePixelRatio}),r.set(this,c=>{c.code==="Space"&&!U(this,e,"f")&&(Jo(this,e,!0,"f"),document.body.style.cursor="grab")}),i.set(this,c=>{c.code==="Space"&&U(this,e,"f")&&(Jo(this,e,!1,"f"),document.body.style.cursor="auto")}),n.set(this,()=>{document.addEventListener("keyup",U(this,i,"f")),document.addEventListener("keydown",U(this,r,"f"))}),this.addEventListener("wheel",c=>{if(this.isMovable)if(c.preventDefault(),c.ctrlKey){let{deltaY:f}=c;c.deltaMode===1&&(f*=15);let x=this.scale;this.scale*=1-f/((1e3-this.zoomSpeed)*.5);let _=c.offsetX-this.offsetWidth/2,b=c.offsetY-this.offsetHeight/2;this.panX+=_/this.scale-_/x,this.panY+=b/this.scale-b/x}else{let f=this.panSpeed*.002;this.panX-=c.deltaX*f/this.scale,this.panY-=c.deltaY*f/this.scale}},{passive:!1});let l=1;this.addEventListener("gesturestart",c=>{c.preventDefault(),l=this.scale}),this.addEventListener("gesturechange",c=>{let f=c;f.preventDefault(),this.scale=l*f.scale}),this.addEventListener("pointermove",c=>{c.buttons&4&&(c.preventDefault(),U(this,t,"f").call(this,c.movementX,c.movementY))}),U(this,n,"f").call(this),this.onmousedown=()=>{U(this,e,"f")&&(document.body.style.cursor="grabbing",this.onmousemove=({movementX:c,movementY:f})=>{U(this,t,"f").call(this,c,f)},this.onmouseup=()=>{document.body.style.cursor="grab",this.onmousemove=null,this.onmouseup=null})}}get isMovable(){return!0}get canvasTransform(){return[`scale(${this.scale})`,`translate(${this.panX}px, ${this.panY}px)`]}disconnectedCallback(){document.removeEventListener("keyup",U(this,i,"f")),document.removeEventListener("keydown",U(this,r,"f")),super.disconnectedCallback()}updated(a){super.updated(a),a.has("scale")&&this.dispatchEvent(new CustomEvent("scalechange",{detail:{scale:this.scale}})),(a.has("panX")||a.has("panY"))&&this.dispatchEvent(new CustomEvent("positionchange",{detail:{x:this.panX,y:this.panY}}))}onTouchPan(a){this.panX+=a.x/this.scale,this.panY+=a.y/this.scale}onTouchPinch(a){this.scale*=1-a/1e3}}return e=new WeakMap,t=new WeakMap,r=new WeakMap,i=new WeakMap,n=new WeakMap,$e([P({attribute:!1})],s.prototype,"panX",void 0),$e([P({attribute:!1})],s.prototype,"panY",void 0),$e([P({attribute:!1})],s.prototype,"scale",void 0),$e([P({type:Number,attribute:"zoom-speed"})],s.prototype,"zoomSpeed",void 0),$e([P({type:Number,attribute:"pan-speed"})],s.prototype,"panSpeed",void 0),s}});var Bi,ji,tr,or,rr,ir=w(()=>{u();p();h();D();Fe();we();Bi=({guide:o,reverseScale:e})=>{let t=Math.abs(o.points[0].x-o.points[1].x),r=Math.abs(o.points[0].y-o.points[1].y);return t===0&&r===0?null:k`
    <line
      class="distance-line"
      x1=${o.points[0].x}
      y1=${o.points[0].y}
      x2=${o.points[1].x}
      y2=${o.points[1].y}
    />

    ${o.bisector&&k`
        <line
          class="distance-line"
          x1=${o.bisector[0].x}
          y1=${o.bisector[0].y}
          x2=${o.bisector[1].x}
          y2=${o.bisector[1].y}
          style=${ne({strokeDasharray:`${4*e}`})}
          shape-rendering="geometricPrecision"
          fill="none"
        />
      `}
  `},ji=({guide:o,reverseScale:e,fontSize:t})=>{let r=Math.abs(o.points[0].x-o.points[1].x),i=Math.abs(o.points[0].y-o.points[1].y);if(r===0&&i===0)return null;let n=_e(Math.max(r,i)).toString(10),s=n.length*t*.5,d=t*.25,a=t*.25,l=t*.5,c=r>i?(o.points[0].x+o.points[1].x)/2-s/2:o.points[0].x,f=r>i?o.points[0].y:(o.points[0].y+o.points[1].y)/2-t/2,x=[`scale(${e})`,r>i?`translate(0, ${d+a})`:`translate(${d+l}, 0)`].join(" "),_=c+s/2,b=f+t/2,$=r>i?`${_} ${f}`:`${c} ${b}`;return k`
    <g class="distance-tooltip">
      <rect
        x=${c-l}
        y=${f-a}
        rx="2"
        width=${s+l*2}
        height=${t+a*2}
        transform=${x}
        transform-origin=${$}
        stroke="none"
      />

      <text
        x=${_}
        y=${f+t-a/2}
        text-anchor="middle"
        transform=${x}
        transform-origin=${$}
        stroke="none"
        fill="white"
        style="font-size: ${t}px"
      >
        ${n}
      </text>
    </g>
  `},tr=new Map,or=({node:o,distanceTo:e,reverseScale:t,fontSize:r})=>{let i=o.id+`
`+e.id,n=tr.get(i);return n||(n=Zo(o.absoluteBoundingBox,e.absoluteBoundingBox),tr.set(i,n)),[...n.map(s=>Bi({guide:s,reverseScale:t})),...n.map(s=>ji({guide:s,reverseScale:t,fontSize:r}))]},rr=O`
  .distance-line {
    shape-rendering: geometricPrecision;
    fill: none;
    opacity: 0;
  }

  .distance-tooltip {
    opacity: 0;
  }

  .guide:hover ~ .distance-line,
  .guide:hover ~ .distance-tooltip {
    opacity: 1;
  }
`});var nr,At,sr,ar,lr,Ct=w(()=>{u();p();h();D();nr=({onClick:o=()=>{}})=>k`
  <svg @click=${o} title="close icon" width="14" height="14" viewBox="0 0 20 20" fill="none">
    <path d="M1 19L19 1M19 19L1 1" stroke="#B3B3B3" stroke-width="2"/>
  </svg>
`,At=({onClick:o=()=>{}})=>k`
  <svg @click=${o} title="copy icon" width="14" height="14" viewBox="0 0 30 30" fill="none">
  <path d="M21 25.5C21 24.9477 20.5523 24.5 20 24.5C19.4477 24.5 19 24.9477 19 25.5H21ZM13 2H25V0H13V2ZM28 5V21H30V5H28ZM25 24H13V26H25V24ZM10 21V5H8V21H10ZM13 24C11.3431 24 10 22.6569 10 21H8C8 23.7614 10.2386 26 13 26V24ZM28 21C28 22.6569 26.6569 24 25 24V26C27.7614 26 30 23.7614 30 21H28ZM25 2C26.6569 2 28 3.34315 28 5H30C30 2.23858 27.7614 0 25 0V2ZM13 0C10.2386 0 8 2.23858 8 5H10C10 3.34315 11.3431 2 13 2V0ZM16.5 28H5V30H16.5V28ZM2 25V10H0V25H2ZM5 28C3.34315 28 2 26.6569 2 25H0C0 27.7614 2.23858 30 5 30V28ZM5 7H8V5H5V7ZM2 10C2 8.34315 3.34315 7 5 7V5C2.23858 5 0 7.23858 0 10H2ZM16.5 30C18.9853 30 21 27.9853 21 25.5H19C19 26.8807 17.8807 28 16.5 28V30Z" fill="#B3B3B3"/>
</svg>
`,sr=()=>k`
  <svg title="horizontal padding" width="14" height="14" viewBox="0 0 29 28" fill="none">
    <rect x="7" y="8" width="14" height="14" stroke="#B3B3B3" stroke-width="2"/>
    <path d="M27 1V28" stroke="#B3B3B3" stroke-width="2"/>
    <path d="M1 0V28" stroke="#B3B3B3" stroke-width="2"/>
  </svg>
`,ar=()=>k`
  <svg title="vertical padding" width="14" height="14" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="21" width="14" height="14" transform="rotate(-90 8 21)" stroke="#B3B3B3" stroke-width="2"/>
    <path d="M1 1L28 0.999999" stroke="#B3B3B3" stroke-width="2"/>
    <path d="M0 27L28 27" stroke="#B3B3B3" stroke-width="2"/>
  </svg>
`,lr=()=>k`
  <svg title="figma logo" width="11" height="16" viewBox="0 0 12 17" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.5 1.5h-2c-1.105 0-2 .895-2 2 0 1.105.895 2 2 2h2v-4zm-5 2c0 1.043.533 1.963 1.341 2.5C1.033 6.537.5 7.457.5 8.5c0 1.043.533 1.963 1.341 2.5C1.033 11.537.5 12.457.5 13.5c0 1.657 1.343 3 3 3 1.657 0 3-1.343 3-3V10.736c.53.475 1.232.764 2 .764 1.657 0 3-1.343 3-3 0-1.043-.533-1.963-1.341-2.5.808-.537 1.341-1.457 1.341-2.5 0-1.657-1.343-3-3-3h-5c-1.657 0-3 1.343-3 3zm1 5c0-1.105.895-2 2-2h2v4h-2c-1.105 0-2-.895-2-2zm0 5c0-1.105.895-2 2-2h2v2c0 1.105-.895 2-2 2-1.105 0-2-.895-2-2zm7-3c-1.105 0-2-.895-2-2 0-1.105.895-2 2-2 1.105 0 2 .895 2 2 0 1.105-.895 2-2 2zm0-5h-2v-4h2c1.105 0 2 .895 2 2 0 1.105-.895 2-2 2z"
      fill-rule="evenodd"
      fill-opacity="1"
      fill="#000"
      stroke="none"
    ></path>
  </svg>
`});var ue,Hi,Pt,ze,cr,Ii,Mt,dr=w(()=>{u();p();h();ue=o=>o.a===0?"transparent":o.a<1?`rgba(${cr(o).join(", ")}, ${o.a.toFixed(2)})`:Ii(o),Hi=o=>new Pt(o).cssColor,Pt=class{constructor(e){this.gradientHandles={start:e.gradientHandlePositions[0],end:e.gradientHandlePositions[1]},this.colors=e.gradientStops,this.colorObjects=this.createColorObjects(this.colors),this.angle=this.calculateAngle(this.gradientHandles.start,this.gradientHandles.end)}get cssGradientArray(){return this.colorObjects.map((e,t)=>{let r=this.floatToPercent(this.colors[t].position);return e+" "+r})}get cssColor(){let e=this.cssGradientArray;return e.unshift(this.angle+"deg"),`linear-gradient(${e.join(", ")})`}createColorObjects(e){return e.map(({color:t})=>ue(t))}floatToPercent(e){return(e*=100).toFixed(0)+"%"}calculateAngle(e,t){let r=Math.atan(this.calculateGradient(e,t));return parseInt(this.radToDeg(r).toFixed(1))}calculateGradient(e,t){return(t.y-e.y)/(t.x-e.x)*-1}radToDeg(e){return 180*e/Math.PI}},ze=class{constructor(e){var t,r,i;if(this.hasPadding=!1,this.height=`${Math.trunc(e.absoluteBoundingBox.height)}px`,this.width=`${Math.trunc(e.absoluteBoundingBox.width)}px`,(e.horizontalPadding||e.verticalPadding)&&(this.hasPadding=!0,this.horizontalPadding=`${e.horizontalPadding}px`,this.verticalPadding=`${e.verticalPadding}px`),e.style&&(this.fontFamily=e.style.fontFamily,this.fontPostScriptName=(t=e.style.fontPostScriptName)===null||t===void 0?void 0:t.replace("-"," "),this.fontWeight=e.style.fontWeight,this.fontSize=`${Math.ceil(e.style.fontSize)}px`,this.lineHeight=`${Math.trunc(e.style.lineHeightPx)}px`),e.rectangleCornerRadii&&(this.borderRadius=e.rectangleCornerRadii.filter(s=>s===e.cornerRadius).length<4?`${e.rectangleCornerRadii.join("px ")}px`:`${e.cornerRadius}px`),e.backgroundColor||e.backgroundColor){let s=e.backgroundColor||((r=e.background)===null||r===void 0?void 0:r[0].color);this.background=ue(s)}let n=(i=e.fills)===null||i===void 0?void 0:i[0];if(n&&n.visible!==!1&&(e.type==="TEXT"?this.color=ue(n.color):n.type.includes("GRADIENT")?this.backgroundImage=Hi(n):n.type==="SOLID"&&(this.background=ue(n.color))),e.strokes&&e.strokes.length>0&&(this.borderColor=ue(e.strokes[0].color),this.border=`${e.strokeWeight}px solid ${this.borderColor}`),e.effects&&e.effects.length>0){let{offset:s,radius:d,color:a}=e.effects[0];this.boxShadowColor=ue(a),this.boxShadow=`${s?.x||0}px ${s?.y||0}px 0 ${d} ${this.boxShadowColor}`}}getStyles(){return[this.height&&{property:"height",value:this.height},this.width&&{property:"width",value:this.width},this.fontFamily&&{property:"font-family",value:this.fontFamily},this.fontSize&&{property:"font-size",value:this.fontSize},this.fontWeight&&{property:"font-weight",value:this.fontWeight},this.lineHeight&&{property:"line-height",value:this.lineHeight},this.borderRadius&&{property:"border-radius",value:this.borderRadius},this.backgroundImage&&{property:"background-image",value:this.backgroundImage},this.boxShadow&&{property:"box-shadow",value:this.boxShadow,color:this.boxShadowColor},this.border&&{property:"border",value:this.border,color:this.borderColor},this.background&&{property:"background",value:this.background,color:this.background},this.color&&{property:"color",value:this.color,color:this.color}].filter(Boolean)}getStyleSheet(){return this.getStyles().map(Mt).join(`
`)}},cr=o=>[Math.trunc(255*o.r),Math.trunc(255*o.g),Math.trunc(255*o.b)],Ii=o=>{let[e,t,r]=cr(o);return"#"+((1<<24)+(e<<16)+(t<<8)+r).toString(16).slice(1)},Mt=({property:o,value:e})=>`${o}: ${e};`});var Fi,Tt,ur,Di,Ui,pr,hr=w(()=>{u();p();h();D();Ct();dr();Fi=function(o,e,t,r){function i(n){return n instanceof t?n:new t(function(s){s(n)})}return new(t||(t=Promise))(function(n,s){function d(c){try{l(r.next(c))}catch(f){s(f)}}function a(c){try{l(r.throw(c))}catch(f){s(f)}}function l(c){c.done?n(c.value):i(c.value).then(d,a)}l((r=r.apply(o,e||[])).next())})},Tt=o=>Fi(void 0,void 0,void 0,function*(){yield navigator.clipboard.writeText(o)}),ur=({node:o,onClose:e})=>{if(!o)return null;let t=new ze(o),r=i=>i.stopPropagation();return S`
    <div
      class="inspector-view"
      @click=${r}
      @wheel=${r}
      @keydown=${r}
      @keyup=${r}
      @pointermove=${r}
    >
      <div class="inspector-section selectable-content">
        <div class="title-section">
          <h4>${o.name}</h4>
          ${nr({onClick:e})}
        </div>
        <div class="properties-overview">
          <div class="title-section">
            <p class="inspector-property">
              <span>W: </span>${t.width}
            </p>
            <p class="inspector-property" style="margin-left: 16px;">
              <span>H: </span>${t.height}
            </p>
          </div>
          ${t.fontPostScriptName?S`<p class="inspector-property">
                <span>Font:</span>
                ${t.fontPostScriptName}
              </p>`:null}
        </div>
      </div>
      ${t.hasPadding?S`<div class="inspector-section">
            <h4>Layout</h4>
            ${t.horizontalPadding&&S`<p class="inspector-property">
              ${sr()} ${t.horizontalPadding}
            </p>`}
            ${t.verticalPadding&&S`<p class="inspector-property">
              ${ar()} ${t.verticalPadding}
            </p>`}
          </div>`:null}
      ${o.characters?S`<div class="inspector-section">
            <div class="title-section">
              <h4>Content</h4>
              ${At({onClick:()=>Tt(o.characters)})}
            </div>
            <p class="node-content code-section selectable-content">
              ${o.characters}
            </p>
          </div>`:null}
      ${Di(t)}
    </div>
  `},Di=o=>{let e=()=>Tt(o.getStyleSheet()),t=o.getStyles();return S`<div class="inspector-section">
    <div class="title-section style-section">
      <h4>CSS</h4>
      ${At({onClick:e})}
    </div>
    <div class="code-section selectable-content">
      ${t.map(Ui)}
    </div>
  </div>`},Ui=o=>{let{property:e,value:t,color:r}=o,i=null;switch(e){case"background":case"fill":case"border":case"box-shadow":case"color":i=S`<span
        class="color-preview"
        style="background-color: ${r}"
      ></span>`;break;case"background-image":i=S`<span
        class="color-preview"
        style="background-image: ${t}"
      ></span>`;break}return S`<div class="css-property" @click=${()=>Tt(Mt(o))}>
    <span>${e}:</span>${i}<span class="css-value">${t}</span>;</span>
  </div>`},pr=O`
  .inspector-view {
    height: 100%;
    width: 300px;
    position: absolute;
    right: 0;
    background: white;
    border-left: 1px solid #ccc;
    overflow-y: auto;
    z-index: calc(var(--z-index) + 2);
  }

  .inspector-view h4 {
    font-size: 16px;
    margin: 0;
  }

  .style-section {
    margin-bottom: 12px;
  }

  .title-section {
    display: flex;
    align-items: center;
  }

  .code-section {
    padding: 8px;
    background: #f3f3f3;
    font-family: monospace;
  }

  .title-section svg {
    cursor: pointer;
    margin-left: auto;
  }

  .inspector-section {
    padding: 16px;
    border-bottom: 1px solid #eee;
  }

  .properties-overview {
    font-family: monospace;
    color: #518785;
  }

  .properties-overview p span {
    color: #121212;
  }

  .inspector-property {
    display: flex;
    align-items: center;
    margin-bottom: 0;
  }

  .inspector-property span {
    color: #b3b3b3;
    margin-right: 4px;
  }

  .inspector-property svg {
    margin-right: 8px;
  }

  .css-property {
    margin: 8px;
    transition: background-color ease-in-out 100ms;
  }

  .css-property:hover {
    cursor: pointer;
    background-color: #e8e8e8;
  }

  .css-value {
    color: #518785;
    margin-left: 4px;
  }

  .color-preview {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 1px solid #ccc;
    margin-left: 4px;
    vertical-align: middle;
  }

  .selectable-content {
    cursor: text;
    user-select: text;
  }
`});var Ot,fr,mr,gr=w(()=>{u();p();h();D();Fe();we();Ot=({node:o,selected:e=!1,computedThickness:t,onClick:r})=>{let{x:i,y:n,width:s,height:d}=o.absoluteBoundingBox,a="cornerRadius"in o&&o.cornerRadius?{topLeft:o.cornerRadius,topRight:o.cornerRadius,bottomRight:o.cornerRadius,bottomLeft:o.cornerRadius}:"rectangleCornerRadii"in o&&o.rectangleCornerRadii?{topLeft:o.rectangleCornerRadii[0],topRight:o.rectangleCornerRadii[1],bottomRight:o.rectangleCornerRadii[2],bottomLeft:o.rectangleCornerRadii[3]}:{topLeft:0,topRight:0,bottomRight:0,bottomLeft:0},l=t/2,c=(b,$)=>`M${b},${$}`,f=(b,$)=>`L${b},${$}`,x=(b,$,E)=>`A${b},${b} 0 0 1 ${$},${E}`,_=[c(a.topLeft+l,l),f(s-a.topRight,l),x(a.topRight-l,s-l,a.topRight),f(s-l,d-a.bottomRight),x(a.bottomRight-l,s-a.bottomRight,d-l),f(a.bottomLeft,d-l),x(a.bottomLeft-l,l,d-a.bottomLeft),f(l,a.topLeft),x(a.topLeft-l,a.topLeft,l),"Z"].join(" ");return k`
    <path
      class="guide"
      d=${_}
      shape-rendering="geometricPrecision"
      fill="none"
      transform="translate(${i}, ${n})"
      ?data-selected=${e}
      @click=${r}
    />
  `},fr=({nodeSize:{x:o,y:e,width:t,height:r},offsetX:i,offsetY:n,reverseScale:s})=>{let d={top:`${n+e+r}px`,left:`${i+o+t/2}px`,transform:`translateX(-50%) scale(${s}) translateY(0.25em)`};return S`
    <div class="tooltip" style="${ne(d)}">
      ${_e(t)} x ${_e(r)}
    </div>
  `},mr=O`
  .guide {
    /*
     * SVGs cannot be pixel perfect, especially floating values.
     * Since many platform renders them visually incorrectly (probably they
     * are following the spec), it's safe to set overflow to visible.
     * Cropped borders are hard to visible and ugly.
     */
    overflow: visible;

    pointer-events: all;

    opacity: 0;
  }
  .guide:hover {
    opacity: 1;
  }
  .guide[data-selected] {
    opacity: 1;
    stroke: var(--guide-selected-color);
  }

  .tooltip {
    position: absolute;
    padding: 0.25em 0.5em;
    font-size: var(--guide-tooltip-font-size);

    color: var(--guide-selected-tooltip-fg);
    background-color: var(--guide-selected-tooltip-bg);
    border-radius: 2px;
    pointer-events: none;
    z-index: calc(var(--z-index) + 1);

    transform-origin: top center;
  }
`});var Yi,vr,yr,br=w(()=>{u();p();h();Yi=[{gte:31536e6,divisor:31536e6,unit:"year"},{gte:2592e6,divisor:2592e6,unit:"month"},{gte:6048e5,divisor:6048e5,unit:"week"},{gte:864e5,divisor:864e5,unit:"day"},{gte:36e5,divisor:36e5,unit:"hour"},{gte:6e4,divisor:6e4,unit:"minute"},{gte:3e4,divisor:1e3,unit:"seconds"},{gte:0,divisor:1,text:"just now"}],vr=o=>(typeof o=="object"?o:new Date(o)).getTime(),yr=(o,e=Date.now(),t=new Intl.RelativeTimeFormat(void 0,{numeric:"auto"}))=>{let i=vr(e)-vr(o),n=Math.abs(i);for(let s of Yi)if(n>=s.gte){let d=Math.round(Math.abs(i)/s.divisor),a=i<0,l=s.unit;return l?t.format(a?d:-d,l):s.text}}});var xr,_r,wr=w(()=>{u();p();h();D();Ct();br();xr=O`
  .figma-footer {
    flex: 0;
    z-index: calc(var(--z-index) + 1);
    border-top: 1px solid #ccc;
    min-height: 48px;
    padding: 0 16px;
    text-decoration: none;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    background-color: #fff;
    overflow-x: auto;
    cursor: pointer;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.8);
  }

  .figma-footer--icon {
    margin-right: 12px;
  }

  .figma-footer--title {
    font-weight: 600;
    margin-right: 4px;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .figma-footer--timestamp {
    white-space: nowrap;
    overflow: hidden;
  }
`,_r=o=>{if(!o||!o.link||o.link===void 0||o.link==="undefined")return null;let{link:e,timestamp:t,fileName:r}=o;return S`<a
    class="figma-footer"
    target="_blank"
    rel="noopener"
    title="Open in Figma"
    href="${e}"
  >
    <span class="figma-footer--icon"> ${lr()} </span>
    <span class="figma-footer--title"> ${r} </span>
    <span
      title="Last time edited: ${new Date(t).toUTCString()}"
      class="figma-footer--timestamp"
    >
      Edited ${yr(t)}
    </span>
  </a>`}});function Zi(o){let e=[],t=[],r=[],i=[];for(let d of o.children){if(d.type!=="FRAME"&&d.type!=="COMPONENT")continue;let{x:a,y:l,width:c,height:f}=d.absoluteBoundingBox;e.push(a),t.push(a+c),r.push(l),i.push(l+f)}let n=Math.min(...e),s=Math.min(...r);return{x:n,y:s,width:Math.abs(Math.max(...t)-n),height:Math.abs(Math.min(...i)-s)}}function Gi(o,e){let t=e.map(i=>{if(!("effects"in i))return{top:i.absoluteBoundingBox.y,right:i.absoluteBoundingBox.x+i.absoluteBoundingBox.width,bottom:i.absoluteBoundingBox.y+i.absoluteBoundingBox.height,left:i.absoluteBoundingBox.x};let n=i.effects.filter(a=>a.visible&&a.type==="LAYER_BLUR").map(a=>a.radius),s=i.effects.filter(a=>a.visible&&a.type==="DROP_SHADOW"&&!!a.offset).map(a=>({left:a.radius-a.offset.x,top:a.radius-a.offset.y,right:a.radius+a.offset.x,bottom:a.radius+a.offset.y})),d={top:Math.max(0,...n,...s.map(a=>a.top)),right:Math.max(0,...n,...s.map(a=>a.right)),bottom:Math.max(0,...n,...s.map(a=>a.bottom)),left:Math.max(0,...n,...s.map(a=>a.left))};return{top:i.absoluteBoundingBox.y-d.top,right:i.absoluteBoundingBox.x+i.absoluteBoundingBox.width+d.right,bottom:i.absoluteBoundingBox.y+i.absoluteBoundingBox.height+d.bottom,left:i.absoluteBoundingBox.x-d.left}}),r={top:Math.min(...t.map(i=>i.top)),right:Math.max(...t.map(i=>i.right)),bottom:Math.max(...t.map(i=>i.bottom)),left:Math.min(...t.map(i=>i.left))};return{top:o.absoluteBoundingBox.y-r.top,right:r.right-o.absoluteBoundingBox.x-o.absoluteBoundingBox.width,bottom:r.bottom-o.absoluteBoundingBox.y-o.absoluteBoundingBox.height,left:o.absoluteBoundingBox.x-r.left}}function Ve(o,e=0){return"absoluteBoundingBox"in o?!("children"in o)||o.children.length===0?[Object.assign(Object.assign({},o),{depth:e})]:[Object.assign(Object.assign({},o),{depth:e}),...o.children.map(t=>Ve(t,e+1)).flat()]:o.children.map(t=>Ve(t,e+1)).flat()}var $r,I,kt,Ye,Nt=w(()=>{u();p();h();D();de();Fe();we();Xo();er();ir();hr();He();gr();wr();$r=function(o,e,t,r){var i=arguments.length,n=i<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,t):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(o,e,t,r);else for(var d=o.length-1;d>=0;d--)(s=o[d])&&(n=(i<3?s(n):i>3?s(e,t,n):s(e,t))||n);return i>3&&n&&Object.defineProperty(e,t,n),n},I=function(o,e,t,r){if(t==="a"&&!r)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?o!==e||!r:!e.has(o))throw new TypeError("Cannot read private member from an object whose class did not declare it");return t==="m"?r:t==="a"?r.call(o):r?r.value:e.get(o)},kt=function(o,e,t,r,i){if(r==="m")throw new TypeError("Private method is not writable");if(r==="a"&&!i)throw new TypeError("Private accessor was defined without a setter");if(typeof e=="function"?o!==e||!i:!e.has(o))throw new TypeError("Cannot write private member to an object whose class did not declare it");return r==="a"?i.call(o,t):i?i.value=t:e.set(o,t),t},Ye=o=>{var e,t,r,i,n;class s extends Go(Qo(o)){constructor(...a){super(...a),this.zoomMargin=50,this.link="",e.set(this,void 0),t.set(this,void 0),r.set(this,void 0),i.set(this,l=>c=>{c.preventDefault(),c.stopPropagation(),this.selectedNode=l}),n.set(this,l=>{var c,f;return(f=(c=I(this,r,"f"))===null||c===void 0?void 0:c.find(x=>x.id===l))!==null&&f!==void 0?f:null})}static get styles(){let a=super.styles;return De(a,[O`
          :host {
            --default-error-bg: #fff;
            --default-error-fg: #333;

            --bg: var(--figspec-viewer-bg, #e5e5e5);
            --z-index: var(--figspec-viewer-z-index, 0);
            --error-bg: var(--figspec-viewer-error-bg, var(--default-error-bg));
            --error-fg: var(--figspec-viewer-error-fg, var(--default-error-fg));
            --error-color: var(--figspec-viewer-error-color, tomato);

            --guide-thickness: var(--figspec-viewer-guide-thickness, 1.5px);
            --guide-color: var(--figspec-viewer-guide-color, tomato);
            --guide-selected-color: var(
              --figspec-viewer-guide-selected-color,
              dodgerblue
            );
            --guide-tooltip-fg: var(--figspec-viewer-guide-tooltip-fg, white);
            --guide-selected-tooltip-fg: var(
              --figspec-viewer-guide-selected-tooltip-fg,
              white
            );
            --guide-tooltip-bg: var(
              --figspec-viewer-guide-tooltip-bg,
              var(--guide-color)
            );
            --guide-selected-tooltip-bg: var(
              --figspec-viewer-guide-selected-tooltip-bg,
              var(--guide-selected-color)
            );
            --guide-tooltip-font-size: var(
              --figspec-viewer-guide-tooltip-font-size,
              12px
            );

            position: relative;
            display: block;

            background-color: var(--bg);
            user-select: none;
            overflow: hidden;
            z-index: var(--z-index);
          }

          @media (prefers-color-scheme: dark) {
            :host {
              --default-error-bg: #222;
              --default-error-fg: #fff;
            }
          }

          .spec-canvas-wrapper {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column-reverse;
          }

          .canvas {
            position: absolute;
            top: 50%;
            left: 50%;
            flex: 1;
          }

          .rendered-image {
            position: absolute;
            top: 0;
            left: 0;
          }

          .guides {
            position: absolute;

            overflow: visible;
            stroke: var(--guide-color);
            fill: var(--guide-color);
            pointer-events: none;
            z-index: calc(var(--z-index) + 2);
          }
        `,mr,Io,rr,pr,xr])}get __images(){return{}}deselectNode(){this.selectedNode=null}get error(){return!I(this,e,"f")||!I(this,r,"f")?Y({title:"Error",children:"Please call `__updateTree/1` method with a valid parameter."}):null}render(){if(this.error)return this.error instanceof Error?Y({title:this.error.name||"Error",children:this.error.message}):typeof this.error=="string"?Y({title:"Error",children:this.error}):this.error;let a=I(this,e,"f"),l=1/this.scale,c=`calc(var(--guide-thickness) * ${l})`,f=parseFloat(getComputedStyle(this).getPropertyValue("--guide-thickness")),x=parseFloat(getComputedStyle(this).getPropertyValue("--guide-tooltip-font-size"));return S`
        <div class="spec-canvas-wrapper" @click=${this.deselectNode}>
          <div
            class="canvas"
            style="
          width: ${a.width}px;
          height: ${a.height}px;

          transform: translate(-50%, -50%) ${this.canvasTransform.join(" ")}
        "
          >
            ${Object.entries(this.__images).map(([_,b])=>{var $;let E=I(this,n,"f").call(this,_);if(!E||!("absoluteBoundingBox"in E)||!(!(($=I(this,t,"f"))===null||$===void 0)&&$[E.id]))return null;let A=I(this,t,"f")[E.id];return S`
                <img
                  class="rendered-image"
                  src="${b}"
                  style=${ne({top:`${E.absoluteBoundingBox.y-a.y}px`,left:`${E.absoluteBoundingBox.x-a.x}px`,marginTop:`${-A.top}px`,marginLeft:`${-A.left}px`,width:E.absoluteBoundingBox.width+A.left+A.right+"px",height:E.absoluteBoundingBox.height+A.top+A.bottom+"px"})}
                />
              `})}
            ${this.selectedNode&&fr({nodeSize:this.selectedNode.absoluteBoundingBox,offsetX:-a.x,offsetY:-a.y,reverseScale:l})}
            ${k`
            <svg
              class="guides"
              viewBox="0 0 ${a.width} ${a.height}"
              width=${a.width}
              height=${a.height}
              style=${ne({left:`${-a.x}px`,top:`${-a.y}px`,strokeWidth:c})}
            >
              ${this.selectedNode&&Ot({node:this.selectedNode,selected:!0,computedThickness:f*l})}

              ${I(this,r,"f").map(_=>{var b;return _.id===((b=this.selectedNode)===null||b===void 0?void 0:b.id)?null:k`
                  <g>
                    ${Ot({node:_,computedThickness:f*l,onClick:I(this,i,"f").call(this,_)})}
                    ${this.selectedNode&&or({node:_,distanceTo:this.selectedNode,reverseScale:l,fontSize:x})}
                  </g>
                `})}
            </svg>
          `}
          </div>
          ${ur({node:this.selectedNode,onClose:this.deselectNode})}
          ${_r(this.getMetadata())}
        </div>
      `}getMetadata(){}connectedCallback(){super.connectedCallback(),this.resetZoom()}updated(a){super.updated(a)}__updateTree(a){if(!(a.type==="CANVAS"||a.type==="FRAME"||a.type==="COMPONENT"||a.type==="COMPONENT_SET"))throw new Error("Cannot update node tree: Top level node MUST be one of CANVAS, FRAME, COMPONENT, or COMPONENT_SET");kt(this,e,a.type==="CANVAS"?Zi(a):a.absoluteBoundingBox,"f"),kt(this,r,Ve(a),"f"),this.requestUpdate()}__updateEffectMargins(){if(!this.__images)return;let a=Object.keys(this.__images).map(I(this,n,"f")).filter(l=>!!l);kt(this,t,a.reduce((l,c)=>"absoluteBoundingBox"in c?Object.assign(Object.assign({},l),{[c.id]:Gi(c,Ve(c))}):l,{}),"f"),this.requestUpdate()}resetZoom(){if(I(this,e,"f")){let{width:a,height:l}=I(this,e,"f"),{width:c,height:f}=this.getBoundingClientRect(),x=c/(a+this.zoomMargin*2),_=f/(l+this.zoomMargin*2);this.scale=Math.min(x,_,1)}}}return e=new WeakMap,t=new WeakMap,r=new WeakMap,i=new WeakMap,n=new WeakMap,$r([P({type:Number,attribute:"zoom-margin"})],s.prototype,"zoomMargin",void 0),$r([P({type:String,attribute:"link"})],s.prototype,"link",void 0),s}});var Sr,X,Er=w(()=>{u();p();h();D();de();He();Nt();Sr=function(o,e,t,r){var i=arguments.length,n=i<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,t):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(o,e,t,r);else for(var d=o.length-1;d>=0;d--)(s=o[d])&&(n=(i<3?s(n):i>3?s(e,t,n):s(e,t))||n);return i>3&&n&&Object.defineProperty(e,t,n),n},X=class extends Ye(F){constructor(){super(...arguments),this.nodes=null,this.renderedImage=null}get isMovable(){return!!(this.nodes&&this.renderedImage&&this.documentNode)}get documentNode(){if(!this.nodes)return null;let e=Object.values(this.nodes.nodes)[0];return!e||!("absoluteBoundingBox"in e.document)?null:e.document}get __images(){return!this.documentNode||!this.renderedImage?{}:{[this.documentNode.id]:this.renderedImage}}get error(){if(!this.nodes||!this.renderedImage)return Y({title:"Parameter error",children:S`<span>
          Both <code>nodes</code> and <code>rendered-image</code> are required.
        </span>`});if(!this.documentNode)return Y({title:"Parameter Error",children:S`
          <span> Document node is empty or does not have size. </span>
        `});if(super.error)return super.error}getMetadata(){return{fileName:this.nodes.name,timestamp:this.nodes.lastModified,link:this.link}}connectedCallback(){super.connectedCallback(),this.documentNode&&(this.__updateTree(this.documentNode),this.__updateEffectMargins(),this.resetZoom())}updated(e){if(super.updated(e),e.has("nodes")){if(!this.documentNode)return;this.__updateTree(this.documentNode),this.resetZoom()}e.has("renderedImage")&&this.__updateEffectMargins()}};Sr([P({type:Object})],X.prototype,"nodes",void 0);Sr([P({type:String,attribute:"rendered-image"})],X.prototype,"renderedImage",void 0)});var Ar,Rt,We,Bt,K,Cr=w(()=>{u();p();h();D();de();He();Nt();we();Ar=function(o,e,t,r){var i=arguments.length,n=i<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,t):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(o,e,t,r);else for(var d=o.length-1;d>=0;d--)(s=o[d])&&(n=(i<3?s(n):i>3?s(e,t,n):s(e,t))||n);return i>3&&n&&Object.defineProperty(e,t,n),n},Rt=function(o,e,t,r){if(t==="a"&&!r)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?o!==e||!r:!e.has(o))throw new TypeError("Cannot read private member from an object whose class did not declare it");return t==="m"?r:t==="a"?r.call(o):r?r.value:e.get(o)},K=class extends Ye(F){constructor(){super(...arguments),this.documentNode=null,this.renderedImages=null,this.selectedPage=null,We.set(this,()=>{var e;if(!this.documentNode){this.selectedPage=null;return}this.selectedPage=(e=this.documentNode.document.children.filter(t=>t.type==="CANVAS")[0])!==null&&e!==void 0?e:null}),Bt.set(this,e=>{var t,r;let i=e.currentTarget;this.selectedPage=(r=(t=this.documentNode)===null||t===void 0?void 0:t.document.children.find(n=>n.id===i.value))!==null&&r!==void 0?r:null,this.selectedPage&&(this.__updateTree(this.selectedPage),this.resetZoom(),this.__updateEffectMargins(),this.panX=0,this.panY=0)})}get isMovable(){return!!(this.renderedImages&&this.documentNode)}get __images(){return this.renderedImages||{}}get error(){if(!this.documentNode||!this.renderedImages)return Y({title:"Parameter error",children:S`<span>
          Both <code>document-node</code> and <code>rendered-images</code> are
          required.
        </span>`});if(super.error)return super.error}static get styles(){return De(super.styles,[O`
        :host {
          --figspec-control-bg-default: #fcfcfc;
          --figspec-control-fg-default: #333;

          --control-bg: var(
            --figspec-control-bg,
            var(--figspec-control-bg-default)
          );
          --control-fg: var(
            --figspec-control-bg,
            var(--figspec-control-fg-default)
          );
          --control-shadow: var(
            --figspec-control-shadow,
            0 2px 4px rgba(0, 0, 0, 0.3)
          );
          --padding: var(--figspec-control-padding, 8px 16px);

          display: flex;
          flex-direction: column;
        }

        @media (prefers-color-scheme: dark) {
          :host {
            --figspec-control-bg-default: #222;
            --figspec-control-fg-default: #fff;
          }
        }

        .controls {
          flex-shrink: 0;
          padding: var(--padding);

          background-color: var(--control-bg);
          box-shadow: var(--control-shadow);
          color: var(--control-fg);
          z-index: 1;
        }

        .view {
          position: relative;
          flex-grow: 1;
          flex-shrink: 1;
        }
      `])}render(){var e;return S`
      <div class="controls">
        <select @change=${Rt(this,Bt,"f")}>
          ${(e=this.documentNode)===null||e===void 0?void 0:e.document.children.map(t=>S`<option value=${t.id}>${t.name}</option>`)}
        </select>
      </div>

      <div class="view">${super.render()}</div>
    `}getMetadata(){return{fileName:this.documentNode.name,timestamp:this.documentNode.lastModified,link:this.link}}connectedCallback(){super.connectedCallback(),this.documentNode&&(Rt(this,We,"f").call(this),this.selectedPage&&(this.__updateTree(this.selectedPage),this.resetZoom()))}updated(e){super.updated(e),e.has("documentNode")&&(Rt(this,We,"f").call(this),this.selectedPage&&(this.__updateTree(this.selectedPage),this.resetZoom())),e.has("renderedImages")&&this.__updateEffectMargins()}};We=new WeakMap,Bt=new WeakMap;Ar([P({type:Object,attribute:"document-node"})],K.prototype,"documentNode",void 0);Ar([P({type:Object,attribute:"rendered-images"})],K.prototype,"renderedImages",void 0)});var Pr=w(()=>{u();p();h();Er();Cr();customElements.get("figspec-file-viewer")||customElements.define("figspec-file-viewer",K);customElements.get("figspec-frame-viewer")||customElements.define("figspec-frame-viewer",X)});function Ze(o=window.React,e,t,r,i){let n,s,d;if(e===void 0){let _=o;({tagName:s,elementClass:d,events:r,displayName:i}=_),n=_.react}else n=o,d=t,s=e;let a=n.Component,l=n.createElement,c=new Set(Object.keys(r??{}));class f extends a{constructor(){super(...arguments),this.o=null}t(b){if(this.o!==null)for(let $ in this.i)Ki(this.o,$,this.props[$],b?b[$]:void 0,r)}componentDidMount(){var b;this.t(),(b=this.o)===null||b===void 0||b.removeAttribute("defer-hydration")}componentDidUpdate(b){this.t(b)}render(){let{_$Gl:b,...$}=this.props;this.h!==b&&(this.u=A=>{b!==null&&qi(b,A),this.o=A,this.h=b}),this.i={};let E={ref:this.u};for(let[A,q]of Object.entries($))Xi.has(A)?E[A==="className"?"class":A]=q:c.has(A)||A in d.prototype?this.i[A]=q:E[A]=q;return E.suppressHydrationWarning=!0,l(s,E)}}f.displayName=i??d.name;let x=n.forwardRef((_,b)=>l(f,{..._,_$Gl:b},_?.children));return x.displayName=f.displayName,x}var Xi,Mr,Ki,qi,Tr=w(()=>{u();p();h();Xi=new Set(["children","localName","ref","style","className"]),Mr=new WeakMap,Ki=(o,e,t,r,i)=>{let n=i?.[e];n===void 0||t===r?t==null&&e in HTMLElement.prototype?o.removeAttribute(e):o[e]=t:((s,d,a)=>{let l=Mr.get(s);l===void 0&&Mr.set(s,l=new Map);let c=l.get(d);a!==void 0?c===void 0?(l.set(d,c={handleEvent:a}),s.addEventListener(d,c)):c.handleEvent=a:c!==void 0&&(l.delete(d),s.removeEventListener(d,c))})(o,n,t)},qi=(o,e)=>{typeof o=="function"?o(e):o.current=e}});var Or=w(()=>{u();p();h();Tr()});var kr,Nr,Rr=w(()=>{u();p();h();Pr();Or();H();kr=Ze(Pe,"figspec-frame-viewer",X,{onNodeSelect:"nodeselect",onPositionChange:"positionchange",onScaleChange:"scalechange"}),Nr=Ze(Pe,"figspec-file-viewer",K,{onNodeSelect:"nodeselect",onPositionChange:"positionchange",onScaleChange:"scalechange"})});var Ir={};It(Ir,{Figspec:()=>Lr,default:()=>on});function Ge(o){return o.status!==200?Promise.reject(o.statusText):o.json()}function tn(o){var e;if(o.accessToken)return o.accessToken;try{return(e=g.STORYBOOK_FIGMA_ACCESS_TOKEN)!==null&&e!==void 0?e:null}catch{return null}}function Hr(o){return"absoluteBoundingBox"in o?[o]:!o.children||o.children.length===0?[]:o.children.map(Hr).flat()}var Ji,Xe,Qi,en,Br,Lr,on,jr,Fr=w(()=>{u();p();h();H();Rr();Z();B();ot();Ji=function(o,e){return Object.defineProperty?Object.defineProperty(o,"raw",{value:e}):o.raw=e,o},Xe=function(){return Xe=Object.assign||function(o){for(var e,t=1,r=arguments.length;t<r;t++){e=arguments[t];for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(o[i]=e[i])}return o},Xe.apply(this,arguments)},Qi=function(o,e,t,r){function i(n){return n instanceof t?n:new t(function(s){s(n)})}return new(t||(t=Promise))(function(n,s){function d(c){try{l(r.next(c))}catch(f){s(f)}}function a(c){try{l(r.throw(c))}catch(f){s(f)}}function l(c){c.done?n(c.value):i(c.value).then(d,a)}l((r=r.apply(o,e||[])).next())})},en=function(o,e){var t={label:0,sent:function(){if(n[0]&1)throw n[1];return n[1]},trys:[],ops:[]},r,i,n,s;return s={next:d(0),throw:d(1),return:d(2)},typeof Symbol=="function"&&(s[Symbol.iterator]=function(){return this}),s;function d(l){return function(c){return a([l,c])}}function a(l){if(r)throw new TypeError("Generator is already executing.");for(;t;)try{if(r=1,i&&(n=l[0]&2?i.return:l[0]?i.throw||((n=i.return)&&n.call(i),0):i.next)&&!(n=n.call(i,l[1])).done)return n;switch(i=0,n&&(l=[l[0]&2,n.value]),l[0]){case 0:case 1:n=l;break;case 4:return t.label++,{value:l[1],done:!1};case 5:t.label++,i=l[1],l=[0];continue;case 7:l=t.ops.pop(),t.trys.pop();continue;default:if(n=t.trys,!(n=n.length>0&&n[n.length-1])&&(l[0]===6||l[0]===2)){t=0;continue}if(l[0]===3&&(!n||l[1]>n[0]&&l[1]<n[3])){t.label=l[1];break}if(l[0]===6&&t.label<n[1]){t.label=n[1],n=l;break}if(n&&t.label<n[2]){t.label=n[2],t.ops.push(l);break}n[2]&&t.ops.pop(),t.trys.pop();continue}l=e.call(o,t)}catch(c){l=[6,c],i=0}finally{r=n=0}if(l[0]&5)throw l[1];return{value:l[0]?l[1]:void 0,done:!0}}},Br=M(jr||(jr=Ji([`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`],[`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`])));Lr=function(o){var e=o.config,t=T({state:"loading"}),r=t[0],i=t[1],n=function(s){return Qi(void 0,void 0,void 0,function(){var d,a,l,c,f,x,_,b,$,E,A,q,Lt,Ht,J;return en(this,function(Q){switch(Q.label){case 0:i({state:"loading"}),Q.label=1;case 1:if(Q.trys.push([1,6,,7]),d=e.url.match(tt),!d)throw new Error(e.url+" is not a valid Figma URL.");if(a=d[3],l=new URL(e.url),c=l.searchParams.get("node-id"),f=tn(e),!f)throw new Error("Personal Access Token is required.");return x={"X-FIGMA-TOKEN":f},_=new URL("https://api.figma.com/v1/files/"+a),b=new URL("https://api.figma.com/v1/images/"+a),b.searchParams.set("format","svg"),c?[3,4]:[4,fetch(_.href,{headers:x,signal:s}).then(Ge)];case 2:return $=Q.sent(),E=Hr($.document),b.searchParams.set("ids",E.map(function(zr){return zr.id}).join(",")),[4,fetch(b.href,{headers:x,signal:s}).then(Ge)];case 3:return A=Q.sent(),i({state:"fetched",value:{type:"file",props:{documentNode:$,renderedImages:A.images,link:e.url}}}),[2];case 4:return _.pathname+="/nodes",_.searchParams.set("ids",c),b.searchParams.set("ids",c),[4,Promise.all([fetch(_.href,{headers:x,signal:s}).then(Ge),fetch(b.href,{headers:x,signal:s}).then(Ge)])];case 5:return q=Q.sent(),Lt=q[0],Ht=q[1],i({state:"fetched",value:{type:"frame",props:{nodes:Lt,renderedImage:Object.values(Ht.images)[0],link:e.url}}}),[3,7];case 6:return J=Q.sent(),J instanceof DOMException&&J.code===DOMException.ABORT_ERR?[2]:(console.error(J),i({state:"failed",error:J instanceof Error?J.message:String(J)}),[3,7]);case 7:return[2]}})})};switch(L(function(){var s=!1,d=function(){s=!0},a=new AbortController;return n(a.signal).then(d,d),function(){s||a.abort()}},[e.url]),r.state){case"loading":return m(W,null,m(N,null,"Loading Figma file..."));case"failed":return m(W,null,m(N,null,"Failed to load Figma file"),m(N,null,r.error));case"fetched":return r.value.type==="file"?m(Nr,Xe({css:Br},r.value.props)):m(kr,Xe({css:Br},r.value.props))}},on=Lr});u();p();h();u();p();h();u();p();h();u();p();h();var Ee=__STORYBOOKADDONS__,{addons:pn,types:Ft,mockChannel:hn}=__STORYBOOKADDONS__;u();p();h();var yn=__STORYBOOKAPI__,{ActiveTabs:bn,Consumer:xn,ManagerContext:_n,Provider:wn,addons:$n,combineParameters:Sn,controlOrMetaKey:En,controlOrMetaSymbol:An,eventMatchesShortcut:Cn,eventToShortcut:Pn,isMacLike:Mn,isShortcutTaken:Tn,keyToSymbol:On,merge:kn,mockChannel:Nn,optionOrAltSymbol:Rn,shortcutMatchesShortcut:Bn,shortcutToHumanString:jn,types:Ln,useAddonState:Hn,useArgTypes:In,useArgs:Fn,useChannel:Dn,useGlobalTypes:Un,useGlobals:zn,useParameter:Ae,useSharedState:Vn,useStoryPrepared:Yn,useStorybookApi:Wn,useStorybookState:Dt}=__STORYBOOKAPI__;B();u();p();h();var Ce="STORYBOOK_ADDON_DESIGNS",Ke=Ce+"/panel",Ss={UpdateConfig:Ce+"/update_config"},se="design";u();p();h();B();u();p();h();H();B();Z();ot();et();u();p();h();H();B();Z();u();p();h();H();B();u();p();h();H();var Xt=function(){for(var o=0,e=0,t=arguments.length;e<t;e++)o+=arguments[e].length;for(var r=Array(o),i=0,e=0;e<t;e++)for(var n=arguments[e],s=0,d=n.length;s<d;s++,i++)r[i]=n[s];return r},Kt=function(o,e){var t=T([0,0]),r=t[0],i=t[1],n=T(!1),s=n[0],d=n[1],a=j(function(b){b.button===0&&(i([b.screenX,b.screenY]),d(!0))},[d,i]),l=j(function(b){var $=b.touches[0];i([$.screenX,$.screenY]),d(!0)},[d,i]),c=j(function(b){s&&i(function($){return o([b[0]-$[0],b[1]-$[1]]),b})},Xt([i,s],e)),f=j(function(b){var $=b.screenX,E=b.screenY;c([$,E])},[c]),x=j(function(b){var $=b.touches[0],E=$.screenX,A=$.screenY;c([E,A])},Xt([i,s],e)),_=j(function(){i([0,0]),d(!1)},[d,i]);return{onMouseDown:a,onMouseMove:f,onMouseUp:_,onMouseLeave:_,onTouchStart:l,onTouchMove:x,onTouchCancel:_,onTouchEnd:_}};var Qt=function(o,e){return Object.defineProperty?Object.defineProperty(o,"raw",{value:e}):o.raw=e,o},rt=function(){return rt=Object.assign||function(o){for(var e,t=1,r=arguments.length;t<r;t++){e=arguments[t];for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(o[i]=e[i])}return o},rt.apply(this,arguments)},eo=function(o){var e=o.children,t=o.className,r=o.style,i=o.defaultValue,n=o.value,s=o.onChange,d=T([0,0]),a=d[0],l=d[1];L(function(){l(i||n||[0,0])},[i]);var c=Kt(function(x){s&&s(x),l(function(_){return[_[0]+x[0],_[1]+x[1]]})},[l,s]),f=ee(function(){var x=n||a;return{transform:"translate("+x[0]+"px, "+x[1]+"px)"}},[n,a]);return m("div",rt({css:yi,className:t,style:r},c),m("div",{css:bi,style:f},e))};var yi=M(qt||(qt=Qt([`
  position: relative;
  overflow: hidden;

  &:active {
    cursor: move;
  }
`],[`
  position: relative;
  overflow: hidden;

  &:active {
    cursor: move;
  }
`]))),bi=M(Jt||(Jt=Qt([`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`],[`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`]))),qt,Jt;u();p();h();H();B();Z();var to=function(o){var e=o.onZoomIn,t=o.onZoomOut,r=o.onReset;return m(N,null,m(Me,{onClick:e},m(Te,{icon:"zoom"})),m(Me,{onClick:t},m(Te,{icon:"zoomout"})),m(Me,{onClick:r},m(Te,{icon:"zoomreset"})))};u();p();h();H();var oo=function(o,e){var t=T(1),r=t[0],i=t[1];L(function(){i(o)},e);var n=j(function(){i(function(a){return a+.1})},[i]),s=j(function(){i(function(a){return Math.max(a-.1,.1)})},[i]),d=j(function(){i(1)},[i]);return{scale:r,zoomIn:n,zoomOut:s,resetZoom:d}};var it=function(o,e){return Object.defineProperty?Object.defineProperty(o,"raw",{value:e}):o.raw=e,o},so=function(o){var e=o.config,t=oo(e.scale||1,[e.scale]),r=ee(function(){return{transform:"scale("+t.scale+")"}},[t.scale]);return m("div",{css:xi},m(Ut,{border:!0},m(N,{key:"left"},m("p",null,m("b",null,"Image")),m(zt,null),m(to,{onReset:t.resetZoom,onZoomIn:t.zoomIn,onZoomOut:t.zoomOut}))),m(eo,{css:_i,defaultValue:e.offset},m("img",{css:wi,src:e.url,style:r})))};var xi=M(ro||(ro=it([`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`],[`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`]))),_i=M(io||(io=it([`
  flex-grow: 1;
`],[`
  flex-grow: 1;
`]))),wi=M(no||(no=it([`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;

  pointer-events: none;
  border-radius: 1px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.15);
`],[`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;

  pointer-events: none;
  border-radius: 1px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.15);
`]))),ro,io,no;u();p();h();B();Z();var $i=function(o,e){return Object.defineProperty?Object.defineProperty(o,"raw",{value:e}):o.raw=e,o},lo=function(o){var e,t,r,i=o.config;return m("div",{css:Si},m(pe,{cancel:!1,href:i.url,target:(e=i.target)!==null&&e!==void 0?e:"_blank",rel:(t=i.rel)!==null&&t!==void 0?t:"noopener",withArrow:(r=i.showArrow)!==null&&r!==void 0?r:!0},i.label||i.url))};var Si=M(ao||(ao=$i([`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`],[`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`]))),ao;u();p();h();H();B();Z();var co=function(o){var e=o.tabs,t=T(e[0].id),r=t[0],i=t[1];return L(function(){i(e[0].id)},[e]),m(Vt,{absolute:!0,selected:r,actions:{onSelect:i}},e.map(function(n){return m("div",{key:n.id,id:n.id,title:n.name},n.offscreen||r===n.id?n.content:null)}))};var R=function(){return R=Object.assign||function(o){for(var e,t=1,r=arguments.length;t<r;t++){e=arguments[t];for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(o[i]=e[i])}return o},R.apply(this,arguments)},rn=function(){for(var o=0,e=0,t=arguments.length;e<t;e++)o+=arguments[e].length;for(var r=Array(o),i=0,e=0;e<t;e++)for(var n=arguments[e],s=0,d=n.length;s<d;s++,i++)r[i]=n[s];return r},nn=Je(function(){return Promise.resolve().then(()=>(Fr(),Ir))}),Dr=function(o){var e=o.config;if(!e||"length"in e&&e.length===0)return m(W,null,m(N,null,"No designs found"),m(N,null,"Learn how to"," ",m(pe,{href:"https://github.com/pocka/storybook-addon-designs#usage",target:"_blank",rel:"noopener",withArrow:!0,cancel:!1},"display design preview for the story")));var t=rn(e instanceof Array?e:[e]).map(function(r,i){var n,s={id:JSON.stringify(r),name:r.name||r.type.toUpperCase(),offscreen:(n=r.offscreen)!==null&&n!==void 0?n:!0};switch(r.type){case"iframe":return R(R({},s),{content:m(Oe,{config:r})});case"figma":return R(R({},s),{content:m(Gt,{config:r}),offscreen:!1});case"figspec":case"experimental-figspec":return r.type==="experimental-figspec"&&console.warn("[storybook-addon-designs] `experimental-figspec` is deprecated. We will remove it in v7.0. Please replace it to `figspec` type."),R(R({},s),{content:m(qe,{fallback:"Preparing Figspec viewer..."},m(nn,{config:r})),offscreen:!1});case"image":return R(R({},s),{content:m(so,{config:r})});case"link":return R(R({},s),{content:m(lo,{config:r})})}return R(R({},s),{content:m(W,null,m(N,null,"Invalid config type"),m(N,null,"Config type you set is not supported. Please choose one from"," ",m(pe,{href:"https://github.com/pocka/storybook-addon-designs#available-types",target:"_blank",rel:"noopener",withArrow:!0,cancel:!1},"available config types")))})});return t.length===1?m("div",null,t[0].content):m(co,{tabs:t})};var Ur=function(o){var e=o.active;if(!e)return null;var t=Dt(),r=Ae(se);return m(Dr,{key:t.storyId,config:r})};var Se="Design";function jt(o){Ee.register(Ce,function(e){var t=function(){var i=Ae(se);return i?Array.isArray(i)?i.length>0?Se+" ("+i.length+")":Se:(i.name||Se)+" (1)":Se},r=function(i){var n=i.active,s=i.key;return m(Ur,{key:s,active:!!n})};o==="tab"?Ee.add(Ke,{title:Se,render:r,type:Ft.TAB,paramKey:se,route:function(i){var n=i.storyId;return"/design/"+n},match:function(i){var n=i.viewMode;return n==="design"}}):Ee.addPanel(Ke,{title:t,paramKey:se,render:r})})}jt("panel");
}catch(e){ console.error("[Storybook] One of your manager-entries failed: " + import.meta.url, e); }
