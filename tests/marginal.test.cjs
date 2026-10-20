const {test}=require('node:test');
const assert=require('node:assert/strict');
const {game}=require('./helpers/game.cjs');
function marginal(){const run=game();run('level=8;restart()');return run}

test('teclado e botões dão pulos nas quatro direções, sem repetição ao segurar',()=>{
  const run=marginal();run('road.cars=[]');
  run("$('road-left').events.pointerdown({pointerType:'touch',preventDefault(){}});for(let i=0;i<20;i++)update(1/60)");
  assert.equal(run('road.col'),3);
  run("roadKey({code:'ArrowRight',repeat:false,preventDefault(){}});for(let i=0;i<20;i++)update(1/60)");
  assert.equal(run('road.col'),4);
  run("roadKey({code:'KeyW',repeat:false,preventDefault(){}});for(let i=0;i<20;i++)update(1/60);roadKey({code:'KeyW',repeat:true,preventDefault(){}});for(let i=0;i<30;i++)update(1/60)");
  assert.equal(run('road.row'),1);
  run("$('road-down').events.click({detail:0});for(let i=0;i<20;i++)update(1/60)");
  assert.equal(run('road.row'),0);
  run('for(let n=0;n<12;n++){roadHop(-1,0);for(let i=0;i<20;i++)update(1/60)}');
  assert.equal(run('road.col'),0);
});

test('colisão durante um pulo retorna ao canteiro e preserva pontos e alimentos',()=>{
  const run=marginal();
  run('road.row=3;road.y=3*ROAD_ROW;road.checkpoint={row:3,col:4};road.foods[0].taken=true;score=70;caught=3;road.cars=[{row:4,x:300,width:112,speed:0,dir:1,period:900}];roadHop(0,1);for(let i=0;i<20;i++)update(1/60)');
  assert.ok(run('road.recovery>0'));
  assert.equal(run('road.move'),null);
  run('for(let i=0;i<60;i++)update(1/60)');
  assert.equal(run('road.row'),3);
  assert.equal(run('road.x'),300);
  assert.equal(run('score'),70);
  assert.equal(run('caught'),3);
  assert.equal(run('road.foods[0].taken'),true);
});

test('canteiros são seguros e o trânsito lento não dá invulnerabilidade',()=>{
  const run=marginal();
  run('road.cars=[{row:1,x:300,width:112,speed:0,dir:1,period:900}];specialTime=7;for(let i=0;i<20;i++)update(1/60)');
  assert.equal(run('road.recovery'),0);
  run('roadHop(0,1);for(let i=0;i<20;i++)update(1/60)');
  assert.ok(run('road.recovery>0'));
});

test('quatro alimentos ativam sete segundos de trânsito lento e não podem ser coletados duas vezes',()=>{
  const run=marginal();run('road.cars=[]');
  run('for(const food of road.foods.slice(0,4)){road.row=food.row;road.col=food.col;road.x=60+food.col*60;road.y=food.row*72;update(1/60)}');
  assert.equal(run('caught'),4);
  assert.equal(run('score'),120);
  assert.equal(run('specialTime'),7);
  run('update(1/60)');assert.equal(run('caught'),4);
  run('road.cars=[{row:1,x:0,width:68,speed:100,dir:1,period:900}];for(let i=0;i<60;i++)update(1/60)');
  assert.ok(Math.abs(run('road.cars[0].x')-32)<.001);
  run('for(let i=0;i<361;i++)update(1/60)');assert.equal(run('specialTime'),0);
  run('road.cars[0].x=0;for(let i=0;i<60;i++)update(1/60)');
  assert.ok(Math.abs(run('road.cars[0].x')-100)<.001);
});

test('toda a travessia pode ser concluída sem poderes, aguardando brechas nos canteiros',()=>{
  for(const initialWait of [0,2,6]){
    const run=marginal();
    const result=run(`(()=>{
      road.foods=[];for(let i=0;i<${initialWait}*60;i++)update(1/60);
      let elapsed=0,falls=0,stops=0;
      while(state==='playing'&&elapsed<150){
        let target=road.row+1;while(!road.rows[target].safe)target++;
        const hops=target-road.row;
        // Predict complete crossings conservatively, without changing the game state.
        const clear=()=>{
          for(let hop=0;hop<hops;hop++)for(let frame=1;frame<=20;frame++){
            const t=(hop*20+frame)/60,y=(road.row+hop+Math.min(1,frame/60/.32))*72;
            for(const car of road.cars){
              const raw=car.x+car.dir*car.speed*t;
              const x=((raw+170)%car.period+car.period)%car.period-170;
              if(Math.abs(y-car.row*72)<36&&Math.abs(road.x-x)<car.width/2+22)return false;
            }
          }
          return true;
        };
        if(!clear()){update(1/60);elapsed+=1/60;continue}
        stops++;
        for(let hop=0;hop<hops;hop++){
          roadHop(0,1);for(let frame=0;frame<20&&state==='playing';frame++){update(1/60);elapsed+=1/60;if(road.recovery){falls++;break}}
          if(falls)break;
        }
        if(falls)break;
      }
      return {state,elapsed,falls,stops,saved:runSaved};
    })()`);
    assert.equal(result.falls,0,JSON.stringify(result));
    assert.equal(result.state,'end',JSON.stringify(result));
    assert.equal(result.stops,6);
    assert.equal(result.saved,true);
  }
});

test('redimensionar, sair e reiniciar não alteram posições nem deixam controles indevidos',()=>{
  const run=marginal();
  run('road.cars=[];roadHop(0,1);update(.1);canvas.getBoundingClientRect=()=>({width:390,height:844});resize()');
  const y=run('road.y');run('draw()');assert.equal(run('road.y'),y);
  assert.equal(run("$('road-controls').hidden"),false);
  assert.equal(run("$('controls').hidden"),true);
  run('chooseLevel()');assert.equal(run("$('road-controls').hidden"),true);
  run('level=0;restart()');assert.equal(run("$('road-controls').hidden"),true);assert.equal(run("$('controls').hidden"),false);
  run('level=8;restart()');assert.equal(run('road.row'),0);assert.equal(run('road.recovery'),0);assert.equal(run('road.move'),null);
  assert.equal(run('road.foods.every(f=>!f.taken)'),true);
});
