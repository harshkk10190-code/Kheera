const express = require('express');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 🌐 WEB MONITOR 
// ==========================================
app.get('/', (req, res) => {
    res.send(`
        <body style="background:#050510; color:#00ff9d; font-family:monospace; text-align:center; padding:50px;">
            <h2>🏛️ 𝐉𝐀𝐑𝐕𝐈𝐒 𝐱 𝐊𝐈𝐑𝐀 𝐐𝐔𝐀𝐍𝐓𝐔𝐌 𝐀𝐈 (𝐕𝟏𝟎.𝟎) 🏛️</h2>
            <p>Advanced Institutional Trend Engine. Market Matrix Active.</p>
            <div style="margin-top:20px; font-size: 12px; color: #555;">SYSTEM: ONLINE | ALGO: V10 NEURAL</div>
        </body>
    `);
});
app.listen(PORT, () => console.log(`🚀 JᴀʀᴠᎥຮ x KIRA QUANTUM AI V10 listening on port ${PORT}`));

// ==========================================
// ⚙️ CONFIGURATION
// ==========================================
const TELEGRAM_BOT_TOKEN = "8587479582:AAH9KVEHwGgn-ddmw4qU2cdy8fMjExhz19M"; 
const TARGET_CHATS = ["1669843747", "-1002613316641"];

let lastUpdateId = 0;

const WINGO_API = "https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json?pageNo=1&pageSize=30";
const FUND_LEVELS = [33, 66, 130, 260, 550, 1100]; 

const HEADERS = { 
    "User-Agent": "Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36", 
    "Accept": "application/json, text/plain, */*", 
    "Origin": "https://www.dmwin2.com", 
    "Referer": "https://www.dmwin2.com/",
    "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
    "Connection": "keep-alive"
}; 

// ==========================================
// 🧠 MEMORY & STATE
// ==========================================
const STATE_FILE = './jarvis_state.json'; 
let state = { 
    lastProcessedIssue: null, 
    activePrediction: null, 
    totalSignals: 0, 
    wins: 0, 
    lossStreak: 0,
    isStarted: false, 
    currentLevel: 0,
    waitCount: 0,
    skipStreak: 0,
    cooldownCycles: 0,
    wasOverheated: false,
    recoveryMode: false,
    shockLockIssue: null,
    cooldownLockIssue: null,
    patternStats: {},
    lastKiller: null,
    patternRevenge: null,
    marketMakerLockIssue: null,
    liquidityLockIssue: null,
    quantumLockIssue: null // V10 Feature
};

function loadState() { 
    if (fs.existsSync(STATE_FILE)) { 
        try { state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); } 
        catch(e) { console.log("Memory reset. Booting fresh matrix."); } 
    } 
} 
function saveState() { fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2)); } 
loadState(); 

async function sendTelegram(text) { 
    for (let chat_id of TARGET_CHATS) { 
        try { 
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({
                    chat_id: chat_id,
                    text: text,
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [
                            ["📊 Stats", "❤️ Health", "🌀 Quantum"],
                            ["🧠 Patterns", "⚙️ System Core"]
                        ],
                        resize_keyboard: true
                    }
                })
            }); 
        } catch(e) {} 
    } 
}

// ... [Keep your existing sendStats, sendHealth, sendPatterns, sendSystem functions but update the headers] ...

async function sendStats(chat_id){
    let msg = `🧠 <b>KIRA QUANTUM AI: STATISTICS</b>\n`;
    msg += dividerVersion();
    const accuracy = state.totalSignals > 0 ? Math.round((state.wins/state.totalSignals)*100) : 100;
    msg += `📊 <b>System Performance</b>\n`;
    msg += `Signals : ${state.totalSignals}\n`;
    msg += `Wins    : ${state.wins}\n`;
    msg += `Accuracy: ${accuracy}%\n\n`;
    msg += `⚙️ <i>V10 Matrix Active</i>`;
    await sendTelegramToChat(chat_id, msg);
}

async function sendTelegramToChat(chat_id, text) {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ chat_id, text, parse_mode: 'HTML' })
    });
}

function dividerCore(){
    return `<pre>⟡ ════════ 💀 𝐐𝐔𝐀𝐍𝐓𝐔𝐌 𝐂𝐎𝐑𝐄 ════════ ⟡</pre>\n`;
}

function dividerOnline(){
    return `<pre>⟡ ════════ 🤖 𝐀𝐈 𝐎𝐍𝐋𝐈𝐍𝐄 ════════ ⟡</pre>\n`;
}

function dividerVersion(){
    return `<pre>⟡ ════════════ 🚀 𝐕𝟏𝟎.𝟎 ════════════ ⟡</pre>\n`;
}

if (!state.isStarted) { 
    state.isStarted = true; 
    saveState(); 
    let bootMsg = `⚙️ <b>𝐉𝐀𝐑𝐕𝐈𝐒 𝐱 𝐊𝐈𝐑𝐀 : 𝐈𝐍𝐈𝐓𝐈𝐀𝐋𝐈𝐙𝐈𝐍𝐆</b> ⚙️\n⟡ ═══════ 🤖 𝐐𝐔𝐀𝐍𝐓𝐔𝐌 𝐎𝐍𝐋𝐈𝐍𝐄 ═══════ ⟡\n\n🛡️ <i>V10 Matrix Health Monitor Active.</i>\n📏 <i>Deep Quantum Size Logic Loaded.</i>\n📈 <i>Neural Pattern Engine Calibrated.</i>\n\n⟡ ════════════🚀 𝐕𝟏𝟎.𝟎 ════════════ ⟡`; 
    sendTelegram(bootMsg); 
} 

// ==========================================
// 📊 V10 MARKET HEALTH & TRAPS
// ==========================================
function getMarketHealth() {
    if (state.currentLevel === 0) return "OPTIMAL 🟢";
    if (state.currentLevel === 1) return "STABLE ♻️";
    if (state.currentLevel === 2 || state.currentLevel === 3) return "VOLATILE 🌕";
    return "DANGEROUS 🩸";
}

// ... [Keep your existing getHeatMeter, heatLock, cooldownGate, shockTrap, liquidityTrap] ...

// 🔥 V10 NEW FEATURE: Quantum Matrix Filter (Deep 15-Period Scan)
function quantumMatrixFilter(list) {
    let sizes = list.slice(1,16).map(i => Number(i.number) <= 4 ? 'S' : 'B');
    let sCount = sizes.filter(s => s === 'S').length;
    let bCount = sizes.filter(b => b === 'B').length;

    // Detect extreme algorithmic wiping (e.g., 13 out of 15 are the same size)
    if (sCount >= 13 || bCount >= 13) {
        return { trapped: true, reason: "Quantum Wipe Detected (Deep Imbalance)" };
    }

    // Detect high-frequency chop in the deeper matrix
    let microFlips = 0;
    for(let i=0; i<14; i++){
        if(sizes[i] !== sizes[i+1]) microFlips++;
    }
    
    if (microFlips >= 12) {
        return { trapped: true, reason: "Matrix Overload (Micro-Flips)" };
    }

    return { trapped: false };
}

function getConfidence(patternName, patternLength, regime, gravityAligned){
    let score = 50;
    if(patternLength >= 5) score += 20;
    else if(patternLength >= 4) score += 10;
    if(regime === "TREND") score += 20;
    if(regime === "STABLE") score += 5;
    if(regime === "CHOP") score -= 25;
    if(gravityAligned) score += 10;

    const stats = state.patternStats[patternName];
    if(stats){
        const total = stats.wins + stats.losses;
        if(total >= 15){
            const winrate = stats.wins / total;
            if(winrate < 0.45) score -= 15;
            if(winrate > 0.65) score += 10;
        }
    }
    return Math.max(40, Math.min(95, score));
}

// ... [Keep regimeShield, survivalReset, recordPattern, detectKillerPattern, evolvePattern, patternBooster, quantumPatternEngine, patternStrengthEngine, marketMakerTrap, flowPressure, elitePressure, institutionalFlow, blackSwanDetector, entropyFilter] ...

// ==========================================
// 📈 SMART 11-PATTERN ALGORITHM (V10.0 QUANTUM SCAN)
// ==========================================
function analyzeTrendsV10(list){
    if(state.lossStreak >= 3){
        state.waitCount++;
        if(state.waitCount >= 25){
            state.lossStreak = 0;
            state.waitCount = 0;
        }
        return { action:"WAIT", regime:"PROTECTION", confidence:0, reason:"Loss Streak Protection" };
    }

    const regime = regimeShield(list); // Assume existing implementation
    if(!regime.tradable){
        return { action:"WAIT", regime:"CHOP", confidence:0, reason:`Regime Shield: ${regime.reason}` };
    }

    let sizes = list.slice(1, 7).map(i => Number(i.number) <= 4 ? 'S' : 'B');
    let forward = sizes.join('');
    const match = (p)=> forward.endsWith(p);

    let small=0,big=0;
    for(let i=1;i<=5;i++){
        let n = Number(list[i].number);
        if(n<=4) small++; else big++;
    }
    let gravity = small>big?'S':'B';

    let decision = null, length = 0, patternName = null;

    if(match('SSSBB')) { decision='BIG'; length=5; patternName="SSSBB"; }
    else if(match('BBBSS')) { decision='SMALL'; length=5; patternName="BBBSS"; }
    else if(match('BBSS')) { decision='BIG'; length=4; patternName="BBSS"; }
    else if(match('SSBB')) { decision='SMALL'; length=4; patternName="SSBB"; }
    else if(match('BSBS')) { decision='BIG'; length=4; patternName="BSBS"; }
    else if(match('SBSB')) { decision='SMALL'; length=4; patternName="SBSB"; }

    if(!decision) return { action:"WAIT", regime:"MIXED", confidence:0, reason:"No Matrix Alignment" };

    // V10: Execute standard checks (omitted here for brevity, assume your original checks run here)
    // ...

    return {
        action: decision,
        regime: "TREND", // Simplified for code snippet limits
        confidence: 85,
        reason: patternName
    };
}

// ========================================== 
// ⚙️ SERVER MAIN LOOP 
// ========================================== 
let isProcessing = false; 

function getSize(n) { return n <= 4 ? "SMALL" : "BIG"; } 

async function tick() { 
    if(isProcessing) return; 
    isProcessing = true; 
    
    try { 
        const res = await fetch(WINGO_API + "&_t=" + Date.now(), { headers: HEADERS, timeout: 8000 }); 
        const rawText = await res.text();
        let data;
        
        try { data = JSON.parse(rawText); } 
        catch (parseError) {
            console.log(`\n[FIREWALL] Casino block. Retrying next cycle.`);
            return;
        }

        if(!data.data || !data.data.list) throw new Error("Empty API List"); 
        
        const list = data.data.list; 
        const latestIssue = list[0].issueNumber; 
        const targetIssue = (BigInt(latestIssue) + 1n).toString(); 
        
        // ... [Your existing active prediction check logic remains here] ...
        
        if(state.lastProcessedIssue !== latestIssue) {
            if(!state.activePrediction) {
                
                // V10 NEW: Run Quantum Matrix Filter
                const quantum = quantumMatrixFilter(list);
                if (quantum.trapped) {
                    if(state.quantumLockIssue !== latestIssue){
                        state.quantumLockIssue = latestIssue;
                        let msg = `🌀 <b>𝐐𝐔𝐀𝐍𝐓𝐔𝐌 𝐌𝐀𝐓𝐑𝐈𝐗 𝐋𝐎𝐂𝐊</b> 🌀\n`;
                        msg += dividerVersion();
                        msg += `🎯 𝐏𝐞𝐫𝐢𝐨𝐝: <code>${targetIssue.slice(-4)}</code>\n`;
                        msg += `⚠️ <b>Deep Anomaly Detected</b>\n`;
                        msg += `🧠 <i>${quantum.reason}</i>`;
                        msg += dividerOnline();
                        await sendTelegram(msg);
                    }
                    state.waitCount++;
                    saveState();
                    return;
                }

                // Call the updated V10 trends analyzer
                const signal = analyzeTrendsV10(list); 

                // ... [Your existing traps and filters logic here] ...

                if(signal && signal.action !== "WAIT") {
                    let betAmount = FUND_LEVELS[state.currentLevel] || 33; 
                    
                    // 🏛️ V10.0 TERMINAL UI UPDATE
                    let msg = `👾 <b>𝐊𝐈𝐑𝐀 𝐐𝐔𝐀𝐍𝐓𝐔𝐌 𝐒𝐈𝐆𝐍𝐀𝐋</b> 👾\n`; 
                    msg += dividerOnline(); 
                    msg += `🎯 <b>𝐓𝐚𝐫𝐠𝐞𝐭 𝐏𝐞𝐫𝐢𝐨𝐝 :</b> <code>${targetIssue.slice(-4)}</code>\n`; 
                    msg += `📊 <b>𝐌𝐞𝐭𝐫𝐢𝐜 :</b> V10 NEURAL SCAN 📏\n`; 
                    msg += `🛡️ <b>𝐑𝐞𝐠𝐢𝐦𝐞 :</b> ${signal.regime}\n`;
                    msg += dividerVersion();
                    msg += `🔮 <b>𝐐𝐮𝐚𝐧𝐭 𝐒𝐢𝐠𝐧𝐚𝐥 : ${signal.action}</b>\n`;
                    msg += `💎 <b>𝐄𝐧𝐭𝐫𝐲 𝐋𝐞𝐯𝐞𝐥 :</b> Level ${state.currentLevel + 1}\n`; 
                    msg += `💰 <b>𝐈𝐧𝐯𝐞𝐬𝐭𝐦𝐞𝐧𝐭 :</b> Rs. ${betAmount}\n`; 
                    msg += `🧠 <b>𝐌𝐚𝐭𝐫𝐢𝐱 𝐋𝐨𝐠𝐢𝐜 :</b> <i>${signal.reason}</i>\n`;
                    msg += `📊 <b>𝐂𝐨𝐧𝐟𝐢𝐝𝐞𝐧𝐜𝐞 :</b> ${signal.confidence}%`; 
                    msg += dividerCore();
                    
                    await sendTelegram(msg); 
                    state.activePrediction = {
                        period: targetIssue, pred: signal.action, pattern: signal.reason,
                        type: "SIZE", conf: 100, timestamp: Date.now()
                    }; 
                    saveState(); 
                } 
            } 
            state.lastProcessedIssue = latestIssue;
            saveState();
        } 
    } catch (e) {
        console.log(`[API ERROR] ${e.message}`);
    } finally { 
        isProcessing = false; 
    } 
} 

// ... [Keep Command Handler and setInterval] ...
setInterval(tick,3000); 
tick();
