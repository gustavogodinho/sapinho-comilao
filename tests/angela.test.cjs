const {test}=require('node:test');
const assert=require('node:assert/strict');
const {game}=require('./helpers/game.cjs');

const selectAngela=`document.querySelectorAll('[data-character]').find(b=>b.dataset.character==='angela').events.click()`;
const changeSlot=slot=>`document.querySelectorAll('[data-slot]').find(b=>b.dataset.slot==='${slot}').onclick()`;

test('Angela pode ser selecionada no menu e começa com o traje de peão completo',()=>{
  const run=game();
  run(selectAngela);
  assert.equal(run('character'),'angela');
  assert.equal(run(`document.querySelectorAll('[data-character]').filter(b=>b.attributes['aria-pressed']==='true').length`),1);
  assert.deepEqual(JSON.parse(run('JSON.stringify(Object.fromEntries(Object.entries(outfits.angela).map(([slot,n])=>[slot,choices[slot][n]])))')),{
    hat:'Chapéu de peão',glasses:'Sem óculos',top:'Camisa xadrez vermelha',bottom:'Calça jeans',shoes:'Botinhas marrons'
  });
});

test('trocar roupas da Angela salva e restaura escolhas sem alterar os outros sapinhos',()=>{
  const saved={'sapinho-outfits-v2':JSON.stringify({rafa:{hat:3,top:6},helena:{hat:5,top:5}})};
  const run=game(saved);
  run(selectAngela);
  for(const slot of ['hat','top','shoes'])run(changeSlot(slot));
  const reopened=game(saved);
  assert.equal(reopened('outfits.angela.hat'),0);
  assert.equal(reopened('outfits.angela.top'),0);
  assert.equal(reopened('outfits.angela.shoes'),0);
  assert.equal(reopened('outfits.rafa.hat'),3);
  assert.equal(reopened('outfits.rafa.top'),6);
  assert.equal(reopened('outfits.helena.hat'),5);
  assert.equal(reopened('outfits.helena.top'),5);
  reopened(selectAngela);
  for(const slot of ['hat','top','shoes']){
    const last=reopened(`choices.${slot}.length-1`);
    for(let i=0;i<last;i++)reopened(changeSlot(slot));
  }
  const restored=game(saved);
  assert.equal(restored('choices.hat[outfits.angela.hat]'),'Chapéu de peão');
  assert.equal(restored('choices.top[outfits.angela.top]'),'Camisa xadrez vermelha');
  assert.equal(restored('choices.shoes[outfits.angela.shoes]'),'Botinhas marrons');
});

test('Angela funciona nas nove fases com movimento, superpoder, reinício e ranking persistente',()=>{
  const saved={};
  const run=game(saved);
  run(selectAngela);
  for(let stage=0;stage<9;stage++){
    run(`level=${stage};restart();jump();update(.1);draw()`);
    assert.equal(run('state'),'playing');
    assert.ok(run(stage===8?'road.move && road.y>0':'frog.y>0'));
    run('energy=100;activate();update(.1);draw()');
    assert.ok(run('specialTime>0'));
    run('score=100;caught=6;finish();restart()');
    assert.equal(run('score'),0);
    assert.equal(run('character'),'angela');
  }
  const reopened=game(saved);
  assert.equal(reopened('ranking.filter(r=>r.character==="angela").length'),9);
  assert.doesNotThrow(()=>reopened('renderRank()'));
});

test('novas peças podem ser usadas por todos os sapinhos, inclusive durante o pulo',()=>{
  const run=game();
  assert.doesNotThrow(()=>run(`for(const who of characterIds){character=who;outfits[who].hat=6;outfits[who].top=7;outfits[who].shoes=4;restart();jump();update(.1);draw();refreshOutfits()}`));
});
