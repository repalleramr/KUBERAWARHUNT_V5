const STORAGE_KEY = 'kubera-warhunt-v5pro-final-locked';
const defaultSettings = {
  bankroll: 30000,
  targetDollar: 500,
  targetPercent: 1.67,
  stopLoss: 50000,
  min: 100,
  max: 3000,
  coin: 100,
  targetNum: 500,
  doubleLadder: 'on',
  keypadMode: 'combined',
  maxSteps: 30,
  reserve: 20000,
  capRule: 'on',
  stopLossPerNumber: -100,
  attackMode: 'classic',
  theme: 'warhunt'
};
const titles = { sangram:'⚔ SANGRAM', vyuha:'🛡 VYUHA', granth:'📜 GRANTH', drishti:'👁 DRISHTI', sopana:'🪜 SOPANA', yantra:'⚙ YANTRA', medha:'🧠 MEDHA' };
const themePalette = {
  warhunt: { name:'Warhunt Gold', themeColor:'#120a05' },
  temple: { name:'Temple Ember', themeColor:'#2a1408' },
  vault: { name:'Treasure Vault', themeColor:'#0f1a12' },
  oracle: { name:'Midnight Oracle', themeColor:'#0b1024' },
  crimson: { name:'Crimson Empire', themeColor:'#2a0a0d' },
  onyx: { name:'Onyx Sanctum', themeColor:'#0b0b0d' },
  sapphire: { name:'Sapphire Shrine', themeColor:'#07182d' },
  emerald: { name:'Emerald Relic', themeColor:'#071f17' },
  moon: { name:'Moon Ashram', themeColor:'#161526' },
  thunder: { name:'Thunder Relic', themeColor:'#10131f' }
};
function applyTheme(themeName){
  const theme = themePalette[themeName] ? themeName : 'warhunt';
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if(meta) meta.setAttribute('content', themePalette[theme].themeColor);
}
let deferredPrompt = null;
let historyStack = [];
let redoStack = [];
let pending = { Y: null, K: null };
let keypadBusy = false;

const q = id => document.getElementById(id);
let modalResolver = null;
let modalConfig = { title:'', text:'', okLabel:'OK', cancelLabel:'Cancel', okClass:'warn' };
const fmtMoney = n => '₹ ' + Number(n || 0).toLocaleString('en-IN');
const clone = obj => JSON.parse(JSON.stringify(obj));
const parseSignedInt = (value, fallback=0) => { const cleaned = String(value ?? '').replace(/[^0-9-]/g,'').replace(/(?!^)-/g,''); const n = Number(cleaned); return Number.isFinite(n) ? n : fallback; };

function getAttackMode(){ return state?.settings?.attackMode || 'classic'; }
function attackThresholdForMode(mode){ return mode==='thirdstrike' ? 2 : mode==='fourthstrike' ? 3 : 1; }
function waitingCodeForInfo(info){
  const mode = getAttackMode();
  if(mode==='thirdstrike') return 'W2';
  if(mode==='fourthstrike') return 'W3';
  return 'W';
}
function activateTrackedNumber(info){
  info.status='A';
  info
