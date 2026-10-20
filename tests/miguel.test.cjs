const {test}=require('node:test');
const assert=require('node:assert/strict');
const {game}=require('./helpers/game.cjs');

const selectMiguel=`document.querySelectorAll('[data-character]').find(b=>b.dataset.character==='miguel').events.click()`;
const changeSlot=slot=>`document.querySelectorAll('[data-slot]').find(b=>b.dataset.slot==='${slot}').onclick()`;

test('Miguel aparece como criança de 10 anos e cantor no seletor',()=>{
  const run=game();
  run(selectMiguel);
  assert.equal(run('character'),'miguel');
  assert.equal(run('characters.miguel.age'),10);
  assert.equal(run('characters.miguel.role'),'cantor');
  assert.equal(run(`document.querySelectorAll('[data-character]').filter(b=>b.attributes['aria-pressed']==='true').length`),1);
});

test('Miguel começa com figurino de cantor e pode trocar peças',()=>{
  const run=game();
  run(selectMiguel);
  assert.deepEqual(JSON.parse(run('JSON.stringify(Object.fromEntries(Object.entries(outfits.miguel).map(([slot,n])=>[slot,choices[slot][n]])))')),{
    hat:'Sem chapéu',glasses:'Sem óculos',top:'Jaqueta de cantor',bottom:'Shorts azul',shoes:'Tênis azuis'
  });
  run(changeSlot('top'));
  assert.equal(run('outfits.miguel.top'),0);
  assert.ok(run('localStorage.getItem("sapinho-outfits-v2").includes("miguel")'));
});

test('Miguel é renderizado com microfone em todas as fases e mantém o ranking',()=>{
  const saved={};
  const run=game(saved);
  run(selectMiguel);
  for(let stage=0;stage<9;stage++){
    run(`character='miguel';level=${stage};restart();jump();update(.1);draw()`);
    assert.equal(run('state'),'playing');
    run('score=80;caught=4;finish()');
    assert.equal(run('character'),'miguel');
  }
  const reopened=game(saved);
  assert.equal(reopened('ranking.filter(r=>r.character==="miguel").length'),9);
  assert.doesNotThrow(()=>reopened(`character='miguel';refreshOutfits();draw()`));
});

test('Miguel conserva o guarda-roupa salvo sem afetar os demais personagens',()=>{
  const saved={'sapinho-outfits-v2':JSON.stringify({miguel:{top:8,shoes:2},angela:{hat:6,top:7,shoes:4}})};
  const run=game(saved);
  assert.equal(run('outfits.miguel.top'),8);
  assert.equal(run('outfits.miguel.shoes'),2);
  assert.equal(run('outfits.angela.hat'),6);
  assert.equal(run('outfits.angela.top'),7);
  assert.equal(run('outfits.angela.shoes'),4);
});
