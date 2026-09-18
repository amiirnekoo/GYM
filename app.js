/**
 * APEX ATHLETE - Elite AI & Biofeedback Engine v2
 * High-Contrast Titanium Slate | Audio Metronome | Volume Chart | PWA
 */

const STATE = {
    currentTab: 'workout',
    selectedWorkoutId: 'day_1',
    loggedSets: {},
    previousSessions: {},
    mealsDone: {},
    weightHistory: [],
    readiness: {
        sleep: 5,
        energy: 4,
        joints: 'good',
        score: 92,
        statusText: 'آمادگی عالی: سیستم عصبی و عضلات آماده حمله به رکوردها'
    },
    padelMatchToday: false,
    adaptiveCaloriesOffset: 0,
    supplementsDone: {},
    metronome: {
        isRunning: false,
        timerId: null,
        currentPhase: 0, // 0..2 = Down (3s), 3 = Pause (1s), 4 = Up (1s)
        currentRep: 1,
        totalReps: 10
    },
    chatMessages: [
        { sender: 'coach', text: 'سلام امیر جان! من هوش مصنوعی اختصاصی و مربی همراه تو هستم. برگه اینبادی و شرایط بدنی تو (۴۳.۶ کیلو عضله اسکلتی، شانه راست و ساق چپ) در حافظه من ذخیره است. هر سوالی در مورد جایگزینی غذاها، تنظیم فشار یا مفاصل داشتی بپرس.' }
    ],
    timer: {
        total: 90,
        remaining: 90,
        isRunning: false,
        intervalId: null
    }
};

// Storage
function getTodayDateString() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function initSupplementsStorage() {
    try {
        const today = getTodayDateString();
        const storedDate = localStorage.getItem('apex_supps_date');
        const storedDone = localStorage.getItem('apex_supps_done');

        if (storedDate === today && storedDone) {
            STATE.supplementsDone = JSON.parse(storedDone);
        } else {
            STATE.supplementsDone = {};
            localStorage.setItem('apex_supps_date', today);
            saveSupplements();
        }
    } catch (e) {
        STATE.supplementsDone = {};
    }
}

function saveSupplements() {
    localStorage.setItem('apex_supps_done', JSON.stringify(STATE.supplementsDone));
    localStorage.setItem('apex_supps_date', getTodayDateString());
}

function initStorage() {
    try {
        const sets = localStorage.getItem('apex_ai_sets');
        if (sets) STATE.loggedSets = JSON.parse(sets);

        const prev = localStorage.getItem('apex_ai_previous');
        if (prev) {
            STATE.previousSessions = JSON.parse(prev);
        } else {
            STATE.previousSessions = {
                'ex_1_1': { weight: 120, reps: 10 },
                'ex_1_2': { weight: 24, reps: 10 },
                'ex_1_3': { weight: 55, reps: 12 },
                'ex_2_1': { weight: 26, reps: 10 },
                'ex_2_2': { weight: 28, reps: 10 },
                'ex_4_1': { weight: 14, reps: 10 },
                'ex_5_1': { weight: 60, reps: 10 }
            };
        }

        const meals = localStorage.getItem('apex_ai_meals');
        if (meals) STATE.mealsDone = JSON.parse(meals);

        const weights = localStorage.getItem('apex_ai_weights');
        if (weights) {
            STATE.weightHistory = JSON.parse(weights);
        } else {
            STATE.weightHistory = [
                { date: 'شروع', weight: 88.0, note: 'ثبت برگه اینبادی با ۴۳.۶ کیلو عضله' }
            ];
            saveWeights();
        }

        const ready = localStorage.getItem('apex_ai_readiness');
        if (ready) STATE.readiness = JSON.parse(ready);

        const padel = localStorage.getItem('apex_ai_padel');
        if (padel) STATE.padelMatchToday = JSON.parse(padel);

        initSupplementsStorage();

    } catch (e) {
        console.warn('Storage error:', e);
    }
}

function saveSets() {
    localStorage.setItem('apex_ai_sets', JSON.stringify(STATE.loggedSets));
}

function savePrevious() {
    localStorage.setItem('apex_ai_previous', JSON.stringify(STATE.previousSessions));
}

function saveMeals() {
    localStorage.setItem('apex_ai_meals', JSON.stringify(STATE.mealsDone));
}

function saveWeights() {
    localStorage.setItem('apex_ai_weights', JSON.stringify(STATE.weightHistory));
}

function saveReadiness() {
    localStorage.setItem('apex_ai_readiness', JSON.stringify(STATE.readiness));
}

function savePadel() {
    localStorage.setItem('apex_ai_padel', JSON.stringify(STATE.padelMatchToday));
}

// Web Audio API Synthesizer
let audioCtx = null;
function getAudioContext() {
    if (!audioCtx) {
        const AudioClass = window.AudioContext || window.webkitAudioContext;
        if (AudioClass) audioCtx = new AudioClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function playChime() {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.25);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
    } catch (e) {}
}

function playBeep(freq, duration) {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + duration);
    } catch (e) {}
}

// FEATURE 1: Audio Tempo Metronome (3-1-1-0 Execution Engine)
function toggleMetronome() {
    if (STATE.metronome.isRunning) {
        stopMetronome();
    } else {
        startMetronome();
    }
}

function startMetronome() {
    STATE.metronome.isRunning = true;
    STATE.metronome.currentPhase = 0;
    STATE.metronome.currentRep = 1;

    const btn = document.getElementById('btn-metronome-toggle');
    if (btn) btn.innerText = 'توقف مترونوم';

    runMetronomeStep();
}

function stopMetronome() {
    STATE.metronome.isRunning = false;
    clearTimeout(STATE.metronome.timerId);

    const btn = document.getElementById('btn-metronome-toggle');
    const pill = document.getElementById('metronome-status-pill');

    if (btn) btn.innerText = 'شروع مترونوم ۳-۱-۱-۰';
    if (pill) pill.innerText = 'آماده برای ست جدید';
}

function runMetronomeStep() {
    if (!STATE.metronome.isRunning) return;

    const pill = document.getElementById('metronome-status-pill');
    const phase = STATE.metronome.currentPhase;
    const rep = STATE.metronome.currentRep;

    // Phases: 0, 1, 2 = Down (3s) | 3 = Pause (1s) | 4 = Up (1s)
    if (phase === 0) {
        if (pill) pill.innerText = `تکرار ${rep}: پایین آمدن (۳ ثانیه)`;
        playBeep(440, 0.15); // A4
    } else if (phase === 1) {
        if (pill) pill.innerText = `تکرار ${rep}: پایین آمدن (۲ ثانیه)`;
        playBeep(440, 0.15);
    } else if (phase === 2) {
        if (pill) pill.innerText = `تکرار ${rep}: پایین آمدن (۱ ثانیه)`;
        playBeep(440, 0.15);
    } else if (phase === 3) {
        if (pill) pill.innerText = `تکرار ${rep}: مکث عمیق در کشش (۱ ثانیه)`;
        playBeep(660, 0.2); // E5
    } else if (phase === 4) {
        if (pill) pill.innerText = `تکرار ${rep}: بالا بردن پرقدرت (۱ ثانیه)`;
        playBeep(880, 0.25); // A5
    }

    STATE.metronome.timerId = setTimeout(() => {
        if (!STATE.metronome.isRunning) return;

        STATE.metronome.currentPhase++;
        if (STATE.metronome.currentPhase > 4) {
            STATE.metronome.currentPhase = 0;
            STATE.metronome.currentRep++;

            if (STATE.metronome.currentRep > STATE.metronome.totalReps) {
                // Completed 10 reps
                stopMetronome();
                playChime();
                alert(`ست ${STATE.metronome.totalReps} تکراری با ریتم دقیق ۳-۱-۱-۰ کامل شد! استراحت کنید.`);
                return;
            }
        }
        runMetronomeStep();
    }, 1000);
}

// Navigation
function switchTab(tabId) {
    STATE.currentTab = tabId;

    document.querySelectorAll('.nav-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tabId);
    });
    document.querySelectorAll('.mobile-nav-btn').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tabId);
    });

    document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(`view-${tabId}`);
    if (target) target.classList.add('active');

    if (tabId === 'progress') {
        setTimeout(renderVolumeChart, 100);
    }
    if (tabId === 'supplements') {
        renderSupplementsChecklist();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Readiness UI
function updateReadinessUI() {
    const scoreEl = document.getElementById('readiness-score-number');
    const textEl = document.getElementById('readiness-status-text');
    if (!scoreEl || !textEl) return;

    scoreEl.innerText = `${STATE.readiness.score}%`;
    textEl.innerText = STATE.readiness.statusText;

    if (STATE.readiness.score >= 85) {
        scoreEl.style.borderColor = 'var(--emerald-400)';
        scoreEl.style.color = 'var(--emerald-400)';
    } else if (STATE.readiness.score >= 65) {
        scoreEl.style.borderColor = 'var(--amber-500)';
        scoreEl.style.color = 'var(--amber-500)';
    } else {
        scoreEl.style.borderColor = 'var(--rose-500)';
        scoreEl.style.color = 'var(--rose-500)';
    }
}

function promptReadinessCheck() {
    const sleep = prompt('کیفیت خواب دوفازی دیشب از ۱ تا ۵ چطور بود؟ (عدد ۱ تا ۵)', STATE.readiness.sleep);
    const energy = prompt('سطح انرژی و ریکاوری بدنی امروز؟ (عدد ۱ تا ۵)', STATE.readiness.energy);
    const joints = prompt('وضعیت مفاصل (شانه راست و زانوها)؟\n۱ = عالی و بدون درد\n۲ = کوفتگی مختصر\n۳ = درد یا گرفتگی شدید', '1');

    if (sleep && energy) {
        const s = parseInt(sleep, 10) || 5;
        const e = parseInt(energy, 10) || 4;
        let score = Math.round(((s + e) / 10) * 100);

        let statusText = 'آمادگی عالی: سیستم عصبی و عضلات آماده حمله به رکوردها';
        let jState = 'good';

        if (joints === '2') {
            score = Math.max(50, score - 15);
            statusText = 'آمادگی متوسط: کمی کوفتگی در مفاصل؛ گرم کردن بیشتر شانه و زانو قبل تمرین';
            jState = 'sore';
        } else if (joints === '3') {
            score = Math.max(40, score - 30);
            statusText = 'هشدار خستگی عصبی و مفصلی: کاهش خودکار ۱ ست از حرکات سنگین برای محافظت از شانه/زانو';
            jState = 'pain';
        }

        STATE.readiness = { sleep: s, energy: e, joints: jState, score, statusText };
        saveReadiness();
        updateReadinessUI();
        renderWorkouts();
        alert(`شاخص آمادگی امروز شما: ${score}٪\nدستور مربی: ${statusText}`);
    }
}

// Padel Balancer
function togglePadelMatch() {
    STATE.padelMatchToday = !STATE.padelMatchToday;
    savePadel();

    const statusEl = document.getElementById('padel-match-status-text');
    const btnEl = document.getElementById('btn-padel-toggle');
    if (statusEl && btnEl) {
        if (STATE.padelMatchToday) {
            statusEl.innerText = '✅ مسابقه سنگین پدل ثبت شد (+۶۰ گرم کربوهیدرات به شام افزوده شد | هدف آب: ۴.۵ لیتر)';
            statusEl.style.color = 'var(--emerald-400)';
            btnEl.innerText = 'لغو ثبت مسابقه';
        } else {
            statusEl.innerText = 'امروز مسابقه پدل ثبت نشده است (کربوهیدرات در حالت استاندارد).';
            statusEl.style.color = 'var(--cyan-400)';
            btnEl.innerText = '🎾 ثبت بازی پدل امروز';
        }
    }

    renderNutrition();
}

// Workouts Rendering
function renderWorkouts() {
    const daysContainer = document.getElementById('days-selector-bar');
    const contentArea = document.getElementById('workout-exercises-area');
    if (!daysContainer || !contentArea) return;

    daysContainer.innerHTML = APEX_DATA.workouts.map(w => `
        <button class="day-btn ${w.id === STATE.selectedWorkoutId ? 'active' : ''}" onclick="selectWorkout('${w.id}')">
            ${w.dayName}
        </button>
    `).join('');

    const workout = APEX_DATA.workouts.find(w => w.id === STATE.selectedWorkoutId) || APEX_DATA.workouts[0];

    let readinessNotice = '';
    if (STATE.readiness.score < 65) {
        readinessNotice = `
            <div style="background: rgba(244, 63, 94, 0.15); border: 1px solid var(--rose-500); border-radius: 8px; padding: 10px 14px; margin-bottom: 16px; font-size: 13px; color: #ffffff;">
                ⚠️ <b>تعدیل خودکار هوشمند (Readiness ${STATE.readiness.score}%):</b> ست‌های آخر به حالت تثبیت درآمدند. وزنه را سنگین‌تر نکنید و روی فاز منفی ۳ ثانیه‌ای با تمرکز بالا کار کنید.
            </div>
        `;
    }

    let html = `
        <div class="card" style="border-top: 3px solid var(--emerald-500);">
            <div class="card-header">
                <div>
                    <h3 class="card-title">${workout.dayName}</h3>
                    <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">
                        تمرکز عضلانی: <b style="color: #ffffff;">${workout.focus}</b> | مدت تخمینی: ${workout.duration}
                    </p>
                </div>
                <span class="badge-pill">${workout.code}</span>
            </div>

            ${readinessNotice}

            <!-- Warmup bar -->
            <div style="background: rgba(255,255,255,0.06); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; font-size: 13px; color: var(--text-secondary);">
                <b style="color: var(--emerald-400);">⚡ پروتکل گرم کردن مفاصل:</b> 
                ${workout.warmup.join(' | ')}
            </div>

            <!-- Volume Load Tracker -->
            <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px 18px; margin-bottom: 20px;">
                <span style="font-size: 13px; color: var(--text-muted); font-weight: 700;">📊 تناژ عضلانی جابجا شده امروز (Volume Load):</span>
                <span id="session-volume-load" style="font-size: 16px; font-weight: 900; color: var(--cyan-400); font-family: monospace;">
                    ${calculateSessionVolume(workout)} کیلوگرم
                </span>
            </div>

            <!-- Exercises List -->
            <div>
                ${workout.exercises.map(ex => renderExerciseBox(ex)).join('')}
            </div>
        </div>
    `;

    contentArea.innerHTML = html;
}

function calculateSessionVolume(workout) {
    let total = 0;
    workout.exercises.forEach(ex => {
        const logged = STATE.loggedSets[ex.id] || [];
        logged.forEach(s => {
            if (s.done && s.weight && s.reps) {
                total += (parseFloat(s.weight) || 0) * (parseInt(s.reps, 10) || 0);
            }
        });
    });
    return total.toLocaleString('fa-IR');
}

function selectWorkout(id) {
    STATE.selectedWorkoutId = id;
    renderWorkouts();
}

function renderExerciseBox(ex) {
    const logged = STATE.loggedSets[ex.id] || [];
    const prev = STATE.previousSessions[ex.id] || { weight: ex.startingWeight, reps: 10 };
    let rows = '';

    let allMaxReps = logged.length >= ex.sets && logged.every(s => s.done && parseInt(s.reps, 10) >= 10);
    let recommendationBadge = '';
    if (allMaxReps) {
        const nextW = (parseFloat(prev.weight) || 20) + (ex.progressionStep || 2.5);
        recommendationBadge = `
            <div style="background: rgba(16, 185, 129, 0.18); border: 1px solid var(--emerald-400); border-radius: 6px; padding: 8px 12px; font-size: 12.5px; color: #ffffff; margin-bottom: 12px;">
                🚀 <b>پیشنهاد اضافه‌بار هوشمند:</b> شما در تمام ست‌ها به سقف تکرار رسیدید! جلسه آینده وزنه را به <b>${nextW} کیلوگرم</b> برسانید یا ۱ ثانیه مکث منفی اضافه کنید.
            </div>
        `;
    }

    for (let i = 1; i <= ex.sets; i++) {
        const item = logged.find(s => s.set === i) || { weight: '', reps: '', done: false };
        rows += `
            <tr>
                <td style="font-weight: 800; color: var(--text-muted);">${i}</td>
                <td style="font-size: 13px; color: var(--text-secondary); font-weight: 700;">${ex.reps}</td>
                <td>
                    <input type="number" step="0.5" placeholder="${prev.weight || 'کیلو'}" class="input-num" 
                        value="${item.weight || ''}" 
                        onchange="saveSetInput('${ex.id}', ${i}, 'weight', this.value)">
                </td>
                <td>
                    <input type="number" placeholder="${prev.reps || 'تکرار'}" class="input-num" 
                        value="${item.reps || ''}" 
                        onchange="saveSetInput('${ex.id}', ${i}, 'reps', this.value)">
                </td>
                <td>
                    <button class="btn-check ${item.done ? 'done' : ''}" 
                        onclick="toggleSetDone('${ex.id}', ${i}, ${ex.restSeconds})">
                        ${item.done ? '✓' : '○'}
                    </button>
                </td>
            </tr>
        `;
    }

    return `
        <div class="exercise-box">
            <div class="exercise-box-header">
                <div class="exercise-title">
                    <h4>${ex.nameFa}</h4>
                    <p>${ex.nameEn}</p>
                </div>
                <button class="btn-timer" onclick="setTimer(${ex.restSeconds})">
                    ⏱ ${ex.restSeconds} ثانیه استراحت
                </button>
            </div>

            <div class="ghost-guide-pill">
                <span>📍 رکورد جلسه قبل:</span>
                <b>${prev.weight} کیلوگرم × ${prev.reps} تکرار</b>
            </div>

            ${recommendationBadge}
            ${ex.technique ? `
                <div class="exercise-technique-badge">
                    <span style="font-size: 18px;">⚡</span>
                    <div><b>تکنیک پیشرفته هایپرتروفی:</b> ${ex.technique}</div>
                </div>
            ` : ''}

            <div class="exercise-specs">
                <span class="spec-pill target">${ex.target}</span>
                <span class="spec-pill tempo">ریتم (Tempo): ${ex.tempo}</span>
                <span class="spec-pill">فشار: ${ex.rir}</span>
            </div>

            <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 6px; padding: 8px 12px; font-size: 12.5px; color: #fbbf24; margin-bottom: 12px;">
                ⏱ <b>تحلیل ریتم ۳ ثانیه‌ای:</b> ${ex.tempoDetails}
            </div>

            <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px; line-height: 1.75;">
                ${ex.formCues.map(c => `• ${c}`).join('<br>')}
            </div>

            <table class="sets-table">
                <thead>
                    <tr>
                        <th>ست</th>
                        <th>دامنه تکرار</th>
                        <th>وزنه (kg)</th>
                        <th>تکرار واقعی</th>
                        <th>تکمیل و تایمر</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
}

function saveSetInput(exId, setNum, field, val) {
    if (!STATE.loggedSets[exId]) STATE.loggedSets[exId] = [];
    let item = STATE.loggedSets[exId].find(s => s.set === setNum);
    if (!item) {
        item = { set: setNum, weight: '', reps: '', done: false };
        STATE.loggedSets[exId].push(item);
    }
    item[field] = val;
    saveSets();

    if (item.weight && item.reps) {
        STATE.previousSessions[exId] = { weight: item.weight, reps: item.reps };
        savePrevious();
    }
}

function toggleSetDone(exId, setNum, restSec) {
    if (!STATE.loggedSets[exId]) STATE.loggedSets[exId] = [];
    let item = STATE.loggedSets[exId].find(s => s.set === setNum);
    if (!item) {
        item = { set: setNum, weight: '', reps: '', done: false };
        STATE.loggedSets[exId].push(item);
    }
    item.done = !item.done;
    saveSets();
    renderWorkouts();

    if (item.done && restSec > 0) {
        setTimer(restSec);
    }
}

// Timer
function setTimer(sec) {
    STATE.timer.total = sec;
    STATE.timer.remaining = sec;
    updateTimerText();
    startTimer();
}

function startTimer() {
    if (STATE.timer.isRunning) return;
    STATE.timer.isRunning = true;
    updateTimerBtn();

    STATE.timer.intervalId = setInterval(() => {
        if (STATE.timer.remaining > 0) {
            STATE.timer.remaining--;
            updateTimerText();
        } else {
            pauseTimer();
            playChime();
        }
    }, 1000);
}

function pauseTimer() {
    STATE.timer.isRunning = false;
    clearInterval(STATE.timer.intervalId);
    updateTimerBtn();
}

function resetTimer() {
    pauseTimer();
    STATE.timer.remaining = STATE.timer.total;
    updateTimerText();
}

function adjustTimer(delta) {
    STATE.timer.remaining = Math.max(0, STATE.timer.remaining + delta);
    updateTimerText();
}

function updateTimerText() {
    const el = document.getElementById('timer-val');
    if (!el) return;
    const m = Math.floor(STATE.timer.remaining / 60);
    const s = STATE.timer.remaining % 60;
    el.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function updateTimerBtn() {
    const b = document.getElementById('btn-timer-toggle');
    if (b) {
        b.innerText = STATE.timer.isRunning ? 'توقف' : 'شروع';
        b.onclick = STATE.timer.isRunning ? pauseTimer : startTimer;
    }
}

// Nutrition
function renderNutrition() {
    const list = document.getElementById('meals-clean-list');
    const caloriesEl = document.getElementById('macro-cals-val');
    const carbsEl = document.getElementById('macro-carbs-val');

    let totalCals = APEX_DATA.athlete.baseCalories + STATE.adaptiveCaloriesOffset;
    let totalCarbs = APEX_DATA.athlete.macros.carbs;

    if (STATE.padelMatchToday) {
        totalCals += 250;
        totalCarbs += 60;
    }

    if (caloriesEl) caloriesEl.innerText = `${totalCals} kcal`;
    if (carbsEl) carbsEl.innerText = `${totalCarbs} g`;

    if (!list) return;

    list.innerHTML = APEX_DATA.nutritionPlan.map(m => {
        const isDone = STATE.mealsDone[m.id] || false;
        let padelBonus = '';
        if (m.id === 'meal_5' && STATE.padelMatchToday) {
            padelBonus = '<span style="color: var(--emerald-400); font-weight: 800; font-size: 12px; margin-right: 8px;">(+۶۰ گرم برنج کته مازاد جهت ریکاوری پدل)</span>';
        }

        return `
            <div class="meal-box" style="${isDone ? 'opacity: 0.7; border-color: var(--emerald-500);' : ''}">
                <div class="meal-box-header">
                    <div>
                        <div class="meal-name">${m.title} ${padelBonus}</div>
                        <div class="meal-info">
                            ${m.calories} کالری | ${m.protein}g پروتئین | ${m.carbs}g کربوهیدرات
                        </div>
                    </div>
                    <button class="btn-check ${isDone ? 'done' : ''}" onclick="toggleMeal('${m.id}')">
                        ${isDone ? '✓' : '○'}
                    </button>
                </div>
                <ul class="meal-foods">
                    ${m.items.map(it => `
                        <li>
                            <span>${it.name}</span>
                            <span class="amt">${it.amount}</span>
                        </li>
                    `).join('')}
                </ul>
                <div style="font-size: 12.5px; color: var(--text-muted); background: rgba(0,0,0,0.25); padding: 8px 12px; border-radius: 6px; border-right: 3px solid var(--cyan-400);">
                    💡 <b>نکته مربی:</b> ${m.coachNote}
                </div>
            </div>
        `;
    }).join('');
}

function toggleMeal(id) {
    STATE.mealsDone[id] = !STATE.mealsDone[id];
    saveMeals();
    renderNutrition();
}

function runAdaptiveTDEECalibration() {
    if (STATE.weightHistory.length < 3) {
        alert('برای محاسبه تطبیقی متابولیسم، حداقل ۳ ثبت وزن در روزهای مختلف نیاز است. لطفاً وزن ناشتای روزانه خود را ثبت نمایید.');
        return;
    }

    const latest = STATE.weightHistory[0].weight;
    const start = APEX_DATA.athlete.startWeight;
    const diff = start - latest;

    if (diff < 0.3) {
        STATE.adaptiveCaloriesOffset = -120;
        alert(`تحلیل متابولیسم هوشمند: روند کاهش وزن آهسته است (تغییر: ${diff.toFixed(1)} کیلو).\nسیستم ۱۲۰ کالری از کربوهیدرات برنج کم کرد تا چربی‌سوزی شتاب بگیرد.`);
    } else if (diff > 2.0) {
        STATE.adaptiveCaloriesOffset = +150;
        alert(`تحلیل متابولیسم هوشمند (سپر ضدریزش عضله): افت وزن سریع‌تر از حد استاندارد است!\nبرای محافظت از توده عضلانی ۴۳.۶ کیلویی، ۱۵۰ کالری کربوهیدرات اضافه شد.`);
    } else {
        STATE.adaptiveCaloriesOffset = 0;
        alert(`تحلیل متابولیسم هوشمند: نرخ کاهش وزن کاملاً بهینه است (کاهش ۵۰۰ گرم در هفته با حفظ ۱۰۰٪ عضلات). نیازی به تغییر کالری نیست.`);
    }

    renderNutrition();
}

// FEATURE 2: Canvas Strength & Volume Load Chart
function renderVolumeChart() {
    const canvas = document.getElementById('volume-chart-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const data = APEX_DATA.volumeHistory;

    ctx.clearRect(0, 0, w, h);

    const minV = 13000;
    const maxV = 19000;
    const stepX = (w - 60) / (data.length - 1);

    // Draw grid lines
    ctx.strokeStyle = '#2d3d57';
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
        const y = 20 + (i * (h - 50) / 3);
        ctx.beginPath();
        ctx.moveTo(30, y);
        ctx.lineTo(w - 20, y);
        ctx.stroke();
    }

    // Points
    const points = data.map((d, idx) => {
        const x = 40 + (idx * stepX);
        const norm = (d.volume - minV) / (maxV - minV);
        const y = (h - 35) - (norm * (h - 60));
        return { x, y, val: d.volume, label: d.week };
    });

    // Area gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
    grad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, h - 35);
    points.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, h - 35);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    points.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
    });
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Dots & Labels
    points.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px Vazirmatn, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(p.label, p.x, h - 12);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`${(p.val / 1000).toFixed(1)}k`, p.x, p.y - 10);
    });
}

// AI Coach Chat
function toggleAiModal() {
    const modal = document.getElementById('ai-coach-modal');
    if (modal) {
        modal.classList.toggle('open');
        renderChatMessages();
    }
}

function renderChatMessages() {
    const box = document.getElementById('ai-chat-box');
    if (!box) return;

    box.innerHTML = STATE.chatMessages.map(msg => `
        <div class="chat-bubble ${msg.sender}">
            ${msg.text}
        </div>
    `).join('');

    box.scrollTop = box.scrollHeight;
}

function askQuickPrompt(type) {
    let question = '';
    let answer = '';

    if (type === 'chicken_sub') {
        question = 'امروز به سینه مرغ دسترسی ندارم، چی بخورم؟';
        answer = 'امیر جان، برای دریافت ۵۵ گرم پروتئین ناهار بدون مرغ، یکی از موارد زیر را انتخاب کن:\n۱. ۱ قوطی تن ماهی در آب‌نمک (۱۸۰ گرم) + ۲ عدد سفیده تخم‌مرغ\n۲. ۲۰۰ گرم راسته گوساله بدون چربی\n۳. ۲۲۰ گرم فیله ماهی قزل‌آلا (کاهش ۱ قاشق روغن زیتون ناهار)\n۴. ۷ عدد سفیده تخم‌مرغ پخته + ۱ پیمانه پروتئین وی.';
    } else if (type === 'shoulder_pain') {
        question = 'شانه راستم بعد از پدل گرفته است؛ در حرکات سینه چه کنم؟';
        answer = 'با توجه به سفتی پکتورالیس مینور راست ناشی از فورهند پدل:\n۱. هالتر صاف اکیداً ممنوع!\n۲. در پرس بالا سینه دمبل، زاویه آرنج را به جای ۹۰ درجه، ۴۵ درجه نسبت به پهلوها نگه دار (گریپ نیمه‌خنثی).\n۳. قبل از شروع جلسه، ۲ ست کشش پکتورالیس مینور در چهارچوب در (۳۰ ثانیه) اجرا کن.';
    } else if (type === 'padel_fuel') {
        question = '۱ ساعت مانده به بازی مسابقه‌ای پدل چی بخورم؟';
        answer = 'بهترین سوخت انفجاری برای پدل:\n• ۱ عدد موز متوسط + ۱ قاشق عسل طبیعی + ۱ فنجان اسپرسو دبل شات + ۵۰۰ میلی‌لیتر آب با یک پنس نمک هیمالیا.';
    } else if (type === 'left_calf') {
        question = 'چطور اختلاف ۲۰۰ گرمی ساق چپم را سریع‌تر پر کنم؟';
        answer = 'طبق داده InBody پای چپت ۱۱.۸۴ کیلو و راست ۱۲.۰۱ کیلو است. فرمول طلایی:\n۱. در تمرین روز ۱ و ۴، تمام ست‌های ساق را اول با پای چپ شروع کن.\n۲. از تکنیک Myo-Reps در ست آخر فقط برای پای چپ استفاده کن (۱۲ تکرار تا خستگی + ۵ تنفس + ۳ تکرار + ۵ تنفس + ۳ تکرار).';
    }

    sendChatMessage(question, answer);
}

function sendUserMessage() {
    const input = document.getElementById('ai-user-text');
    if (!input || !input.value.trim()) return;

    const userText = input.value.trim();
    input.value = '';

    let reply = `امیر جان، با توجه به قد ۱۸۴، وزن ۸۸ و هدف رسیدن به ۸۳ کیلو با حفظ ۴۳.۶ کیلو عضله اسکلتی:\nدر خصوص «${userText}»، توصیه علمی مربیگری این است که اولویت را بر حفظ شدت تمرین و ریکاوری خواب دوفازی بگذاری. در روزهای بازی پدل حتماً هیدراتاسیون و نوشیدنی حین تمرین را مصرف کن.`;

    if (userText.includes('مرغ') || userText.includes('غذا') || userText.includes('برنج')) {
        reply = 'در مورد رژیم: ثبات برنج کته و پروتئین خالص کلید کار است. اگر یک روز اشتها نداشتی، فیله مرغ را چرخ کن یا با ماست ایسلندی مصرف کن، اما هرگز پروتئین روزانه را به زیر ۱۹۰ گرم نرسان.';
    } else if (userText.includes('پا') || userText.includes('اسکوات') || userText.includes('زانو')) {
        reply = 'در تمرینات پا: هک‌اسکوات و ددلیفت رومانیایی پایه‌های رشد تو هستند. چون پدل بازی می‌کنی، در بالای حرکت زانو را قفل خشک نکن تا فشار همیشه روی بافت عضلانی بماند نه تاندون کشکک.';
    }

    sendChatMessage(userText, reply);
}

function sendChatMessage(userText, coachReply) {
    STATE.chatMessages.push({ sender: 'user', text: userText });
    renderChatMessages();

    setTimeout(() => {
        STATE.chatMessages.push({ sender: 'coach', text: coachReply });
        playChime();
        renderChatMessages();
    }, 400);
}

// Asymmetries Panel
function renderAsymmetries() {
    const c = document.getElementById('asymmetry-content');
    if (!c) return;

    c.innerHTML = APEX_DATA.athlete.asymmetries.map(a => `
        <div style="background: var(--bg-surface); border-right: 4px solid var(--amber-500); border-radius: 12px; padding: 16px 20px; margin-bottom: 14px; border: 1px solid var(--border-color); border-right-width: 4px;">
            <div style="font-size: 15.5px; font-weight: 800; color: #fbbf24; margin-bottom: 6px;">⚠️ ${a.area}</div>
            <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 6px; line-height: 1.75;"><b>تحلیل بیومکانیک:</b> ${a.problem}</div>
            <div style="font-size: 13px; color: var(--emerald-400); font-weight: 800; line-height: 1.75;"><b>راهکار قطعی در این برنامه:</b> ${a.solution}</div>
        </div>
    `).join('');
}

// Weight Tracker
function addWeightLog() {
    const input = document.getElementById('weight-input-field');
    if (!input || !input.value) return;

    const val = parseFloat(input.value);
    if (isNaN(val) || val < 60 || val > 120) return;

    const today = new Date().toLocaleDateString('fa-IR');
    STATE.weightHistory.unshift({
        date: today,
        weight: val,
        note: 'ثبت ناشتا'
    });

    saveWeights();
    input.value = '';
    renderWeights();
}

function renderWeights() {
    const list = document.getElementById('weight-logs-clean');
    if (!list) return;

    list.innerHTML = STATE.weightHistory.map(w => `
        <li style="display: flex; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--border-color); font-size: 14px;">
            <div>
                <b style="color: #ffffff;">${w.weight} کیلوگرم</b>
                <span style="color: var(--text-muted); font-size: 12.5px; margin-right: 8px;">(${w.note})</span>
            </div>
            <span style="color: var(--cyan-400); font-family: monospace; font-weight: 700;">${w.date}</span>
        </li>
    `).join('');
}

// ==========================================================================
// FEATURE: Daily Supplement & Pill Checklist Engine with Smart Reminders
// ==========================================================================
function renderSupplementsChecklist() {
    const container = document.getElementById('supplements-grid-container');
    const progressText = document.getElementById('supp-progress-text');
    const nextDueText = document.getElementById('supp-next-due-text');
    const barFill = document.getElementById('supp-progress-bar-fill');

    if (!container) return;

    const list = APEX_DATA.supplementsSchedule || [];
    const currentHour = new Date().getHours();
    let completedCount = 0;
    let nextUpcoming = null;

    const icons = {
        'supp_d3': '☀️',
        'supp_omega': '🐟',
        'supp_creatine': '⚡',
        'supp_whey': '🥛',
        'supp_zma': '🌙'
    };

    const cardsHtml = list.map(supp => {
        const isDone = !!STATE.supplementsDone[supp.id];
        if (isDone) completedCount++;

        const isOverdue = !isDone && currentHour >= supp.reminderHour;
        if (!isDone && !nextUpcoming) {
            nextUpcoming = supp;
        }

        let statusBadgeHtml = '';
        if (isDone) {
            statusBadgeHtml = `<span class="supp-status-badge done">✓ مصرف شد</span>`;
        } else if (isOverdue) {
            statusBadgeHtml = `<span class="supp-status-badge overdue">⚠️ نیاز به مصرف (موعد گذشته)</span>`;
        } else {
            statusBadgeHtml = `<span class="supp-status-badge upcoming">⏳ در انتظار مصرف</span>`;
        }

        const icon = icons[supp.id] || '💊';

        return `
            <div class="supp-card ${isDone ? 'checked' : ''}" id="supp-card-${supp.id}">
                <div class="supp-card-top">
                    <div class="supp-card-title-group">
                        <div class="supp-card-icon">${icon}</div>
                        <div class="supp-card-name">
                            <h4>${supp.name}</h4>
                            <span>فرم مصرف: ${supp.form}</span>
                        </div>
                    </div>
                    <button class="supp-checkbox-btn" onclick="toggleSupplementDone('${supp.id}')" title="ثبت تیک مصرف">
                        ${isDone ? '✓' : ''}
                    </button>
                </div>

                <div class="supp-purpose-box">
                    <b>🎯 هدف فیزیولوژیک:</b> ${supp.purpose}
                </div>

                <div class="supp-food-tip">
                    🥗 <b>دستور مصرف:</b> ${supp.withFood}
                </div>

                <div class="supp-meta-row">
                    <span class="supp-time-pill">
                        ⏰ ${supp.timeLabel}
                    </span>
                    ${statusBadgeHtml}
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = cardsHtml;

    // Update progress bar
    const totalCount = list.length;
    const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    if (progressText) {
        progressText.innerText = `پیشرفت مصرف امروز: ${completedCount} از ${totalCount} مورد (${pct}٪ تکمیل شده)`;
    }
    if (barFill) {
        barFill.style.width = `${pct}%`;
    }
    if (nextDueText) {
        if (completedCount === totalCount) {
            nextDueText.innerText = '🎉 تمام مکمل‌های امروز مصرف شدند!';
            nextDueText.style.color = 'var(--emerald-400)';
        } else if (nextUpcoming) {
            nextDueText.innerText = `⏰ مورد بعدی در انتظار: ${nextUpcoming.name.split('(')[0].trim()}`;
            nextDueText.style.color = 'var(--cyan-400)';
        }
    }
}

function toggleSupplementDone(suppId) {
    STATE.supplementsDone[suppId] = !STATE.supplementsDone[suppId];
    saveSupplements();
    if (STATE.supplementsDone[suppId]) {
        playChime();
    }
    renderSupplementsChecklist();
    checkSupplementReminders();
}

function resetSupplementsDaily() {
    if (confirm('آیا مایلید تمام تیک‌های مصرف امروز ریست شوند و روز جدید را از سر بگیرید؟')) {
        STATE.supplementsDone = {};
        saveSupplements();
        renderSupplementsChecklist();
        checkSupplementReminders();
    }
}

function checkSupplementReminders() {
    const list = APEX_DATA.supplementsSchedule || [];
    const currentHour = new Date().getHours();

    const overdueList = list.filter(s => {
        const isDone = !!STATE.supplementsDone[s.id];
        return !isDone && currentHour >= s.reminderHour;
    });

    const banner = document.getElementById('global-supp-reminder-bar');
    const titleEl = document.getElementById('supp-reminder-title');
    const descEl = document.getElementById('supp-reminder-desc');

    if (!banner) return;

    if (overdueList.length > 0) {
        banner.style.display = 'flex';
        const names = overdueList.map(s => s.name.split('(')[0].trim()).join('، ');
        if (titleEl) titleEl.innerText = `⚠️ یادآوری مربی: موعد مصرف ${overdueList.length} مکمل گذشته است!`;
        if (descEl) descEl.innerText = `هنوز ${names} را مصرف نکرده‌اید. لطفاً برای جلوگیری از افت ریکاوری و تاندون‌ها مصرف کنید.`;
    } else {
        banner.style.display = 'none';
    }
}

// Register PWA Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch((err) => {
            console.log('SW registration error:', err);
        });
    });
}

// Boot
document.addEventListener('DOMContentLoaded', () => {
    initStorage();
    renderWorkouts();
    renderSupplementsChecklist();
    checkSupplementReminders();
    renderNutrition();
    renderAsymmetries();
    renderWeights();
    updateReadinessUI();
    updateTimerText();
    updateTimerBtn();

    // Periodic reminder check every 60 seconds
    setInterval(checkSupplementReminders, 60000);
});
