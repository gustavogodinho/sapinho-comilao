const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const vm=require('node:vm');

// Run the actual game script with a minimal DOM. No test hooks ship in the game.
function game(saved={}){
  const html=readFileSync(join(__dirname,'../../sapinho-comilao.html'),'utf8');
  const noop=()=>{};
  const context=new Proxy({}, {get:(_,key)=>key==='createLinearGradient'?()=>({addColorStop:noop}):noop,set:()=>true});
  const elements=new Map();
  const element=()=>({hidden:false,firstElementChild:{focus:noop},style:{},dataset:{},value:'Teste',events:{},classList:{add:noop,remove:noop},getContext:()=>context,getBoundingClientRect:()=>({width:1000,height:650}),addEventListener(type,callback){this.events[type]=callback},setPointerCapture:noop,setAttribute:noop,append:noop,appendChild:noop,replaceChildren:noop,focus:noop});
  const buttons={};
  for(const key of ['character','slot'])buttons[`[data-${key}]`]=[...html.matchAll(new RegExp(`data-${key}="([^"]+)"`,'g'))].map(match=>{
    const button=element();button.dataset[key]=match[1];button.attributes={};button.setAttribute=(name,value)=>{button.attributes[name]=value};return button;
  });
  const document={hidden:false,getElementById:id=>{if(!elements.has(id))elements.set(id,element());return elements.get(id)},querySelectorAll:selector=>buttons[selector]||[],createElement:element,createTextNode:x=>x,addEventListener:noop};
  const sandbox=vm.createContext({document,window:{addEventListener:noop},localStorage:{getItem:key=>saved[key]??null,setItem:(key,value)=>{saved[key]=value}},devicePixelRatio:1,requestAnimationFrame:noop,console});
  let script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
  script=script.replace(/\}\)\(\);\s*$/,`globalThis.run=code=>eval(code);})();`);
  vm.runInContext(script,sandbox);
  sandbox.run('level=7;muted=true;restart()');
  return sandbox.run;
}

module.exports={game};
