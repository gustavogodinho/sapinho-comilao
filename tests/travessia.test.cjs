const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const vm=require('node:vm');

// Run the actual game script with a minimal DOM. No test hooks ship in the game.
function game(){
  const noop=()=>{};
  const context=new Proxy({}, {get:(_,key)=>key==='createLinearGradient'?()=>({addColorStop:noop}):noop,set:()=>true});
  const elements=new Map();
  const element=()=>({hidden:false,style:{},dataset:{},value:'Teste',events:{},classList:{add:noop,remove:noop},getContext:()=>context,getBoundingClientRect:()=>({width:1000,height:650}),addEventListener(type,callback){this.events[type]=callback},setPointerCapture:noop,setAttribute:noop,append:noop,appendChild:noop,replaceChildren:noop,focus:noop});
  const document={hidden:false,getElementById:id=>{if(!elements.has(id))elements.set(id,element());return elements.get(id)},querySelectorAll:()=>[],createElement:element,createTextNode:x=>x,addEventListener:noop};
  const sandbox=vm.createContext({document,window:{addEventListener:noop},localStorage:{getItem:()=>null,setItem:noop},devicePixelRatio:1,requestAnimationFrame:noop,console});
  let script=readFileSync(join(__dirname,'../sapinho-comilao.html'),'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
  script=script.replace(/\}\)\(\);\s*$/,`globalThis.run=code=>eval(code);})();`);
  vm.runInContext(script,sandbox);
  sandbox.run('level=7;muted=true;restart()');
  return sandbox.run;
}

test('cair retorna à última folha sem perder pontos, alimentos ou vidas',()=>{
  const run=game();
  run('flies=[];pondCheckpoint=pondPlatforms[4];frog.x=1100;frog.y=-30;score=70;caught=3;update(1/60)');
  assert.ok(run('pondSplash>0'));
  run('for(let i=0;i<45;i++)update(1/60)');
  assert.equal(run('frog.x'),run('pondCheckpoint.x'));
  assert.equal(run('frog.y'),0);
  assert.equal(run('score'),70);
  assert.equal(run('caught'),3);
});

test('folhas móveis carregam o sapinho e continuam seguras após redimensionar',()=>{
  const run=game();
  run('pondSupport=pondCheckpoint=pondPlatforms.find(p=>p.kind==="moving");frog.x=pondSupport.x;frog.y=0;update(1/60);canvas.getBoundingClientRect=()=>({width:390,height:844});resize();update(1/60)');
  assert.equal(run('frog.x'),run('pondSupport.x'));
  assert.equal(run('frog.y'),0);
  assert.equal(run('pondSplash'),0);
});

test('superpoder protege na água e a proteção termina após sete segundos',()=>{
  const run=game();
  run('energy=100;activate();frog.x=310;frog.y=0;pondSupport=null;update(1/60)');
  assert.equal(run('pondSupport.kind'),'water');
  run('for(let i=0;i<420;i++)update(1/60)');
  assert.equal(run('specialTime'),0);
  run('for(let i=0;i<15;i++)update(1/60)');
  assert.ok(run('pondSplash>0'));
});

test('pulo tolera comando pouco antes de aterrissar e logo após sair da folha',()=>{
  const run=game();
  run('frog.x=420;frog.y=5;frog.vy=-200;pondSupport=null;pondCoyote=0;jump();for(let i=0;i<4;i++)update(1/60)');
  assert.ok(run('frog.vy>0'));
  run('frog.x=512;frog.y=0;frog.vy=0;pondSupport=pondPlatforms[1];keys.add("ArrowRight");update(1/60);jump();update(1/60)');
  assert.ok(run('frog.vy>0'));
});

test('o percurso inteiro é possível sem superpoder, inclusive folhas móveis e troncos',()=>{
  const run=game();
  // Walk near the edge of each support, then jump using the real input handler.
  const result=run(`(()=>{
    flies=[];let elapsed=0,falls=0;const visited=new Set();keys.add('ArrowRight');
    while(state==='playing'&&elapsed<100){
      if(pondSupport&&pondSupport.kind!=='water'){
        visited.add(pondSupport.kind);
        const edge=pondSupport.x+pondSupport.width/2;
        if(frog.x>=edge-48&&frog.x<POND_BANK)jump();
      }
      update(1/60);elapsed+=1/60;
      if(pondSplash){falls++;break}
    }
    return {state,elapsed,falls,kinds:[...visited],saved:runSaved};
  })()`);
  assert.equal(result.falls,0);
  assert.equal(result.state,'end');
  assert.ok(result.elapsed>45&&result.elapsed<80,JSON.stringify(result));
  assert.ok(result.kinds.includes('moving')&&result.kinds.includes('log'));
  assert.equal(result.saved,true);
});

test('reiniciar restaura percurso e alimentos, sem duplicar coleta após uma queda',()=>{
  const run=game();
  const count=run('flies.length');
  run('collect(flies.shift());pondCheckpoint=pondPlatforms[1];frog.x=310;frog.y=-30;update(1/60);for(let i=0;i<45;i++)update(1/60)');
  assert.equal(run('flies.length'),count-1);
  run('restart()');
  assert.equal(run('flies.length'),count);
  assert.equal(run('score'),0);
  assert.equal(run('frog.x'),160);
  assert.equal(run('pondSplash'),0);
});

test('sete fases originais preservam movimento, pulo e chegada em 30 segundos',()=>{
  const run=game();
  for(let level=0;level<7;level++){
    run(`level=${level};restart();jump();update(1/60)`);
    assert.ok(run('frog.y>0'));
    run('keys.add("ArrowRight");for(let i=0;i<1801&&state==="playing";i++)update(1/60)');
    assert.equal(run('state'),'end');
    assert.equal(run('frog.x'),6160);
  }
});

test('dois dedos permitem segurar direção e pular; cancelar o toque para o movimento',()=>{
  const run=game();
  run(`$('right').events.pointerdown({pointerId:1,preventDefault(){}});
    for(let i=0;i<17;i++)update(1/60);
    $('jump').events.pointerdown({pointerId:2,pointerType:'touch',preventDefault(){}});
    for(let i=0;i<56;i++)update(1/60);
    $('right').events.pointercancel({pointerId:1});
    for(let i=0;i<3;i++)update(1/60);`);
  assert.equal(run('pondSupport'),run('pondPlatforms[1]'));
  assert.equal(run('pondSplash'),0);
  const x=run('frog.x');
  run('for(let i=0;i<30;i++)update(1/60)');
  assert.equal(run('frog.x'),x);
});
