import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../desktop/plugin.js',import.meta.url),'utf8');
const plugin=(await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'))).default;
function register(){let t;plugin.register({i18n:{registerAppLocale(id,opts){assert.equal(id,'ko');t=opts.translations;}}});return t;}
const t=register();
test('older SDK remains usable without a desktop locale API',()=>{assert.doesNotThrow(()=>plugin.register({}));assert.doesNotThrow(()=>plugin.register({i18n:{}}));});
test('stock/custom introduction arrays and names remain literal',()=>{
 assert.equal(Object.keys(t.intro.stock).length,15);
 for(const values of Object.values(t.intro.stock)){assert.equal(values.length,5);for(const s of values)assert.match(s,/[가-힣]/);}
 assert.equal(t.intro.custom('My $& Voice').length,5);assert(t.intro.custom('My $& Voice')[4].includes('My $& Voice'));
 assert(t.intro.custom('')[4].includes('사용자 지정'));
});
test('composer returns arrays and branch copy retains its object shape',()=>{
 for(const key of ['newSessionPlaceholders','followUpPlaceholders']){assert(Array.isArray(t.composer[key]));assert.equal(t.composer[key].length,7);for(const s of t.composer[key])assert.match(s,/[가-힣]/);}
 assert.deepEqual(t.sidebar.projects.branchOff(),{before:'',after:'에서 분기'});
});
test('conditions distinguish enabled, disabled, zero, null and absent values',()=>{
 assert.equal(t.desktop.yoloSystem(true),'이 세션의 YOLO 켜짐');assert.equal(t.desktop.yoloSystem(false),'이 세션의 YOLO 꺼짐');
 assert.equal(t.settings.model.moaReferenceToggle(true,2),'참조 2 사용 안 함');assert.equal(t.settings.model.moaReferenceToggle(false,2),'참조 2 사용');
 assert.equal(t.statusStack.control.gateLastExit(null),'대기 중');assert.equal(t.statusStack.control.gateLastExit(0),'종료 코드: 0');
 assert.equal(t.messaging.waitingSince(0),'방금');assert.equal(t.messaging.waitingSince(3),'3분 전');
 assert.equal(t.settings.gateway.connectedTo('host',null),'host에 연결됨');assert.equal(t.settings.gateway.connectedTo('host','1.0'),'host에 연결됨 · Hermes 1.0');
 assert.equal(t.shell.modelMenu.usageLeft(20,null),'20% 남음');assert.equal(t.shell.modelMenu.usageLeft(20,'1h'),'20% 남음 · 초기화: 1h');
 assert.equal(t.settings.billing.charge.added(null),'크레딧을 추가했습니다.');assert.equal(t.settings.billing.charge.added('5'),'$5을(를) 추가했습니다.');
});
test('companion leaves every existing YAML translation authoritative',()=>{
 const keys=new Set(readFileSync(new URL('../locales/ko.desktop.yaml',import.meta.url),'utf8').split('\n').filter(l=>l.startsWith('"')).map(l=>JSON.parse(l.slice(0,l.indexOf('\": ')+1))));
 function visit(v,p=''){if(v&&typeof v==='object'&&!Array.isArray(v))for(const[k,x]of Object.entries(v))visit(x,p?p+'.'+k:k);else assert(!keys.has(p),p);}
 visit(t);
});
