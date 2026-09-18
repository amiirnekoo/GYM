/**
 * APEX ATHLETE - Pro Maximum Growth & Hypertrophy Engine
 * InBody Calibrated: SMM 43.6kg, FFM 75.1kg
 * 24-28 Sets/Session | Drop Sets & Rest-Pause | Smart Pill & Supplement Tracker
 */

const APEX_DATA = {
    athlete: {
        name: "امیر",
        age: 28,
        height: 184,
        startWeight: 88.0,
        targetWeight: 83.0,
        targetBodyFat: 10.5,
        smm: 43.6, // Skeletal Muscle Mass from InBody
        bmr: 1992, // BMR from InBody
        baseCalories: 2380,
        currentCalories: 2380,
        macros: {
            protein: 195, // 2.2g per kg LBM
            carbs: 240,   // High-energy athletic glycogen for full muscle volume
            fats: 65,     // Essential hormonal balance & joint protection
            water: 3.8    // Liters per day
        },
        asymmetries: [
            {
                area: "ساق پای چپ (تأیید شده در InBody)",
                problem: "توده عضلانی پای چپ ۲۰۰ گرم کمتر از پای راست (۱۱.۸۴kg در مقابل ۱۲.۰۱kg) و تفکیک ضعیف‌تر.",
                solution: "شروع همیشه از پای چپ، به اضافه ۱ ست تکنیک Myo-Reps (۱۲ تکرار تا خستگی + ۵ تنفس + ۳ تکرار + ۵ تنفس + ۳ تکرار) فقط برای پای چپ."
            },
            {
                area: "شانه راست و جلوآمدگی قفسه سینه",
                problem: "گشتاور یک‌طرفه راکت پدل، عضله پکتورالیس مینور راست را سفت کرده و شانه راست را به جلو می‌کشد.",
                solution: "حذف هالتر صاف در حرکات سینه، استفاده ۱۰۰٪ از دمبل مستقل و فیس‌پول با روتیشن شانه راست."
            },
            {
                area: "گودی کمر (Anterior Pelvic Tilt)",
                problem: "ضعف زنجیره عمیق شکم و همسترینگ در اثر پشت‌میزنشینی.",
                solution: "پلانک در وضعیت هالوبادی، هیپ‌تراست سنگین و ددلیفت رومانیایی با تمرکز بر باسن."
            }
        ]
    },

    // Daily Supplement & Pill Checklist with Reminder Thresholds
    supplementsSchedule: [
        {
            id: "supp_d3",
            name: "ویتامین D3 (۵۰۰۰ واحد) + ویتامین K2 (۱۰۰ میکروگرم)",
            form: "قرص ژله‌ای / سافت‌ژل",
            timeLabel: "همراه با صبحانه (ساعت ۰۸:۰۰ الی ۰۹:۳۰)",
            startHour: 7,
            endHour: 10,
            reminderHour: 11, // Warn if unchecked after 11:00
            purpose: "تقویت سنتز تستوسترون آزاد، هدایت کلسیم به استخوان‌ها و تقویت سیستم ایمنی",
            withFood: "همراه با زرده تخم‌مرغ و چربی صبحانه جهت حداکثر جذب"
        },
        {
            id: "supp_omega",
            name: "امگا ۳ غلیظ استاندارد (۲۰۰۰ میلی‌گرم با حداقل ۱۰۰۰mg EPA)",
            form: "کپسول ژلاتینی",
            timeLabel: "همراه با ناهار (ساعت ۱۳:۰۰ الی ۱۴:۰۰)",
            startHour: 12,
            endHour: 14,
            reminderHour: 15, // Warn if unchecked after 15:00
            purpose: "مهار التهاب تاندون‌های شانه و زانو در پدل، سلامت غشای عضلانی و بهبود حساسیت به انسولین",
            withFood: "همراه با ناهار و روغن زیتون"
        },
        {
            id: "supp_creatine",
            name: "کراتین مونوهیدرات میکرونایز شده (۵ گرم)",
            form: "پودر خالص حل‌شده در آب",
            timeLabel: "در بطری آب حین تمرین یا میان‌وعده عصر (ساعت ۱۶:۳۰)",
            startHour: 16,
            endHour: 18,
            reminderHour: 19, // Warn if unchecked after 19:00
            purpose: "افزایش ذخایر فسفوکراتین سلولی، حفظ ۱۰۰٪ حجم هیدراته عضلات و افزایش توان انفجاری",
            withFood: "همراه با آب فراوان و کربوهیدرات ساده/عسل"
        },
        {
            id: "supp_whey",
            name: "پروتئین وی ایزوله (۱ اسکوپ / ۲۵ تا ۳۰ گرم پروتئین خالص)",
            form: "شیک پروتئین با آب خنک",
            timeLabel: "بلافاصله پس از اتمام تمرین (ساعت ۱۹:۰۰ الی ۱۹:۳۰)",
            startHour: 18,
            endHour: 20,
            reminderHour: 21, // Warn if unchecked after 21:00
            purpose: "تأمین فوری لئوسین جهت روشن کردن سوئیچ آنابولیک mTOR و توقف سریع کاتابولیسم",
            withFood: "با آب خنک (نه شیر) جهت جذب فوق‌سریع"
        },
        {
            id: "supp_zma",
            name: "منیزیم بایس‌گلیسینات (۳۰۰mg) + زینک مونو متیونین (۳۰mg)",
            form: "قرص / کپسول",
            timeLabel: "۳۰ دقیقه قبل از خواب شبانه (ساعت ۲۳:۰۰)",
            startHour: 22,
            endHour: 24,
            reminderHour: 23, // Warn if unchecked after 23:00
            purpose: "آرام‌سازی سیستم عصبی، جلوگیری از اسپاسم شبانه، بهبود فاز خواب عمیق و ترشح هورمون رشد",
            withFood: "با معده نسبتاً سبک و یک لیوان آب ولرم"
        }
    ],

    // Realistic Iranian Athletic Diet
    nutritionPlan: [
        {
            id: "meal_1",
            title: "صبحانه انرژی و ساخت عضلانی (ساعت ۸:۰۰)",
            calories: 520,
            protein: 38,
            carbs: 55,
            fats: 16,
            items: [
                { name: "تخم‌مرغ کامل + سفیده", amount: "۲ عدد کامل + ۳ عدد سفیده" },
                { name: "نان سنگک یا بربری سنتی (یا جو دوسر)", amount: "۲ کف دست نان سنگک (حدود ۷۰ گرم)" },
                { name: "گردوی ایرانی یا زیتون", amount: "۲ عدد گردو کامل (۱۰ گرم)" },
                { name: "چای یا قهوه تلخ", amount: "۱ لیوان" }
            ],
            coachNote: "صبحانه ساده، پرپروتئین و بدون پیچیدگی. کلسترول مفید زرده‌ها سوخت تولید تستوسترون روزانه شماست."
        },
        {
            id: "meal_2",
            title: "میان‌وعده صبح کاری (ساعت ۱۰:۳۰)",
            calories: 220,
            protein: 20,
            carbs: 25,
            fats: 4,
            items: [
                { name: "ماست ایسلندی کاله یا ماست یونانی کم‌چرب", amount: "۱۵۰ گرم" },
                { name: "سیب متوسط یا موز", amount: "۱ عدد" }
            ],
            coachNote: "پروتئین ملایم برای تثبیت قند خون تا ناهار بدون ایجاد خواب‌آلودگی در محل کار."
        },
        {
            id: "meal_3",
            title: "ناهار اصلی قهرمانی: سینه مرغ و برنج کته (ساعت ۱۳:۰۰ الی ۱۳:۳۰)",
            calories: 650,
            protein: 55,
            carbs: 75,
            fats: 14,
            items: [
                { name: "سینه مرغ گریل، تفت‌داده یا آب‌پز", amount: "۲۲۰ گرم خام (حدود ۱۷۰ گرم پخته)" },
                { name: "برنج کته ایرانی (با زعفران یا زیره)", amount: "۲۰۰ گرم پخته (حدود ۶ تا ۷ قاشق سرپُر)" },
                { name: "سالاد شیرازی یا کاهو و خیار + روغن زیتون", amount: "۱ کاسه + ۱ قاشق مرباخوری روغن زیتون" },
                { name: "لیمو ترش طبیعی", amount: "به مقدار دلخواه" }
            ],
            coachNote: "وعده طلایی روز شما! برنج کته هضم آسان دارد و سینه مرغ غنی‌ترین منبع اسیدهای آمینه شاخه‌دار (BCAA) است."
        },
        {
            id: "meal_intra",
            title: "فرمول طلایی نوشیدنی حین تمرین (Intra-Workout Drink)",
            calories: 80,
            protein: 0,
            carbs: 20,
            fats: 0,
            items: [
                { name: "عسل طبیعی یا مالتودکسترین", amount: "۱ قاشق غذاخوری (۱۵ الی ۲۰ گرم کربوهیدرات)" },
                { name: "نمک صورتی هیمالیا یا نمک دریا", amount: "۱/۲ قاشق چایخوری (سدیم و الکترولیت)" },
                { name: "کراتین مونوهیدرات خالص", amount: "۵ گرم" },
                { name: "آب خنک", amount: "۷۰۰ الی ۱۰۰۰ میلی‌لیتر" }
            ],
            coachNote: "مصرف این محلول در جلسات ۹۰ دقیقه‌ای کورتیزول را مهار کرده و پمپ عضلانی و توان هک‌اسکوات را تا ست آخر در اوج نگه می‌دارد."
        },
        {
            id: "meal_4",
            title: "سوخت قبل از تمرین: سیب‌زمینی و انرژی (ساعت ۱۶:۰۰ - ۱۶:۳۰)",
            calories: 380,
            protein: 25,
            carbs: 55,
            fats: 5,
            items: [
                { name: "سیب‌زمینی آب‌پز یا تنوری", amount: "۲۰۰ گرم (۱ عدد درشت یا ۲ عدد متوسط)" },
                { name: "سفیده تخم‌مرغ یا فیله مرغ (یا ۱ اسکوپ پروتئین وی)", amount: "۳ عدد سفیده یا ۸۰ گرم فیله مرغ" },
                { name: "قهوه یا اسپرسو تلخ + نوک قاشق چایخوری نمک", amount: "۱ فنجان + ۵۰۰ میلی‌لیتر آب" }
            ],
            coachNote: "سیب‌زمینی منبع فوق‌العاده پتاسیم و نشاسته زودجذب است. نمک و قهوه، پمپ خون عضلات شما را در تمرین ۲ برابر می‌کند."
        },
        {
            id: "meal_5",
            title: "شام ریکاوری و ترمیم بافت (ساعت ۲۰:۳۰ الی ۲۱:۰۰)",
            calories: 550,
            protein: 52,
            carbs: 35,
            fats: 20,
            items: [
                { name: "سینه مرغ، فیله بوقلمون یا راسته گوساله چرخ‌کرده کم‌چرب", amount: "۲۰۰ گرم پخته" },
                { name: "سیب‌زمینی تنوری یا ۱ کف دست نان سنگک یا برنج کته", amount: "۱۰۰ گرم پخته" },
                { name: "سبزیجات تازه، اسفناج یا سالاد با روغن زیتون", amount: "۱ بشقاب آزاد + ۱ قاشق روغن زیتون" }
            ],
            coachNote: "ترکیب گوشت و کمی کربوهیدرات شبانه باعث آزادسازی ترشح هورمون ملاتونین و خواب عمیق می‌شود."
        }
    ],

    // PRO HIGH-VOLUME WORKOUTS: 24-28 Sets per session (1.5 to 2 hours complete gym time!)
    workouts: [
        {
            id: "day_1",
            code: "PRO_LOWER_A",
            dayName: "روز ۱: پا سنگین و هایپرتروفی انفجاری (۲۵ ست پرفشار)",
            focus: "چهارسر ران، همسترینگ، دو قلوی ساق با تمرکز Myo-reps روی پای چپ",
            duration: "۱:۴۵ الی ۲ ساعت (با گرم کردن و کاردیو)",
            warmup: [
                "۵ دقیقه دوچرخه ثابت یا تردمیل شیب‌دار",
                "حرکت گابلت اسکوات کششی عمیق با وزن بدن - ۲ ست ۱۰ تکرار",
                "کشش فعال همسترینگ و چرخش مفاصل مچ پا"
            ],
            exercises: [
                {
                    id: "ex_1_1",
                    nameFa: "هک اسکوات یا پرس پا سنگین",
                    nameEn: "Hack Squat or Incline Leg Press",
                    target: "تراکم و ضخامت چهارسر ران (Quads)",
                    sets: 4,
                    reps: "8 - 10",
                    tempo: "3 - 1 - 1 - 0",
                    tempoDetails: "۳ ثانیه منفی عمیق | ۱ ثانیه توقف در زاویه ۹۰ | ۱ ثانیه پرتاب انفجاری به بالا",
                    rir: "1 RIR",
                    restSeconds: 120,
                    technique: "سنگین و مکانیکی",
                    formCues: [
                        "پاها به عرض شانه، فشار یکنواخت روی تمام کف پا.",
                        "تا زاویه ۹۰ درجه یا عمیق‌تر پایین بروید و در بالا زانو را قفل نکنید."
                    ],
                    startingWeight: "۱۲۰",
                    progressionStep: 5.0
                },
                {
                    id: "ex_1_2",
                    nameFa: "ددلیفت رومانیایی با دمبل سنگین (RDL)",
                    nameEn: "Dumbbell Romanian Deadlift",
                    target: "همسترینگ، باسن و اصلاح گودی کمر",
                    sets: 4,
                    reps: "10 - 12",
                    tempo: "3 - 1 - 1 - 0",
                    tempoDetails: "۳ ثانیه بردن باسن به عقب | ۱ ثانیه کشش در پشت ران | ۱ ثانیه انقباض باسن به جلو",
                    rir: "1 RIR",
                    restSeconds: 90,
                    technique: "کشش بیشینه زنجیره خلفی",
                    formCues: [
                        "زانوها اندکی خم و زاویه آن ثابت بماند. فقط باسن را به سمت دیوار پشت سر هل دهید.",
                        "کمر کاملاً صاف و خنثی باشد."
                    ],
                    startingWeight: "۲۴",
                    progressionStep: 2.0
                },
                {
                    id: "ex_1_3",
                    nameFa: "جلو ران با دستگاه (ست آخر Drop Set)",
                    nameEn: "Leg Extension Machine (Drop Set on Last Set)",
                    target: "تفکیک خطوط جلوی ران و تاندون کشکک زانو",
                    sets: 4,
                    reps: "12 - 15 (ست آخر ۳ مرحله کاهش وزنه)",
                    tempo: "2 - 1 - 1 - 2",
                    tempoDetails: "۲ ثانیه منفی | ۱ ثانیه بالا | ۲ ثانیه اوج انقباض و فشردن چهارسر",
                    rir: "0 RIR (ناتوانی مطلق در ست آخر)",
                    restSeconds: 75,
                    technique: "🔥 DROP SET در ست آخر",
                    formCues: [
                        "در بالای حرکت ۲ ثانیه توقف کامل داشته باشید تا عضله بسوزد.",
                        "ست چهارم: وزن کاری را تا ناتوانی بزنید، بلافاصله ۳۰٪ وزن را کم کنید و دوباره بزنید، و باز هم کم کنید."
                    ],
                    startingWeight: "۵۵",
                    progressionStep: 5.0
                },
                {
                    id: "ex_1_4",
                    nameFa: "پشت ران خوابیده با دستگاه (Leg Curl)",
                    nameEn: "Lying Leg Curl",
                    target: "عضله همسترینگ و استحکام زانوها برای پدل",
                    sets: 4,
                    reps: "10 - 12",
                    tempo: "3 - 1 - 1 - 1",
                    tempoDetails: "۳ ثانیه پایین آوردن با مقاومت | ۱ ثانیه انقباض کامل به سمت باسن",
                    rir: "1 RIR",
                    restSeconds: 75,
                    technique: "انقباض مداوم",
                    formCues: [
                        "باسن از روی نیمکت بلند نشود و پنجه‌ها را به سمت ساق بکشید."
                    ],
                    startingWeight: "۴۵",
                    progressionStep: 2.5
                },
                {
                    id: "ex_1_5",
                    nameFa: "لانژ راه‌رفتنی با دمبل (Walking Lunges)",
                    nameEn: "Dumbbell Walking Lunges",
                    target: "پمپ نهایی چهارسر، باسن و تعادل جهشی در پدل",
                    sets: 3,
                    reps: "12 قدم هر پا (جمعاً ۲۴ قدم)",
                    tempo: "ریتم پیوسته",
                    tempoDetails: "گام‌های بلند با کنترل فرود زانوی عقب",
                    rir: "1 RIR",
                    restSeconds: 90,
                    technique: "پمپ متابولیک شدید",
                    formCues: [
                        "تنه اندکی متمایل به جلو برای متمرکز شدن بار روی گلوتئوس و ران پای جلو."
                    ],
                    startingWeight: "دمبل‌های ۱۰ - ۱۲ کیلو"
                },
                {
                    id: "ex_1_6",
                    nameFa: "ساق پا تک‌پا با دمبل (تکنیک Myo-Reps پای چپ)",
                    nameEn: "Single-Leg Calf Raise (Left Leg Myo-Reps Focus)",
                    target: "رفع عدم تقارن ۲۰۰ گرمی ساق چپ طبق برگه InBody",
                    sets: 4,
                    reps: "12 - 15",
                    tempo: "3 - 2 - 1 - 1",
                    tempoDetails: "۳ ثانیه منفی | ۲ ثانیه توقف مطلق در کشش پایینی | ۱ ثانیه پرتاب روی پنجه",
                    rir: "0 RIR",
                    restSeconds: 60,
                    technique: "⚡ MYO-REPS در ست آخر پای چپ",
                    formCues: [
                        "قانون مربی: همیشه ست را اول با پای چپ شروع کنید.",
                        "تکنیک Myo-Reps ست آخر پای چپ: ۱۲ تکرار تا ناتوانی + ۵ تنفس عمیق + ۳ تکرار + ۵ تنفس + ۳ تکرار."
                    ],
                    startingWeight: "۱۲",
                    progressionStep: 2.0
                },
                {
                    id: "ex_1_7",
                    nameFa: "ساق پا نشسته دستگاه (Seated Calf Raise)",
                    nameEn: "Seated Calf Raise (Soleus Muscle Hypertrophy)",
                    target: "هایپرتروفی عضله نعلی (Soleus) و پهنای ساق پا",
                    sets: 3,
                    reps: "15 - 20",
                    tempo: "2 - 2 - 1 - 1",
                    tempoDetails: "۲ ثانیه کشش کف | ۲ ثانیه مکث در پایین | ۱ ثانیه بالا آمدن پرتوان",
                    rir: "0 RIR (سوزش عمیق)",
                    restSeconds: 60,
                    technique: "تکرار بالا و کشش عمیق",
                    formCues: [
                        "در حالت نشسته زانو خم است و بار مستقیم روی عضله نعلی متمرکز می‌شود."
                    ],
                    startingWeight: "۳۰ - ۴۰ کیلوگرم"
                },
                {
                    id: "ex_1_8",
                    nameFa: "کاردیو و چربی‌سوزی Zone 2 در انتهای جلسه",
                    nameEn: "Incline Treadmill Walk (Zone 2)",
                    target: "چربی‌سوزی عمیق بدون افت عضلانی + تقویت ظرفیت میتوکندری",
                    sets: 1,
                    reps: "۲۰ دقیقه پیوسته",
                    tempo: "ریتم پایدار",
                    tempoDetails: "شیب ۸ تا ۱۰ درصد | سرعت ۴.۸ الی ۵.۳ کیلومتر",
                    rir: "ضربان ۱۲۵ الی ۱۳۵",
                    restSeconds: 0,
                    technique: "هوازی کنترل‌شده",
                    formCues: [
                        "تنفس از بینی. این بازه چربی‌های شکم و پهلو را بدون خستگی مفرط می‌سوزاند."
                    ],
                    startingWeight: "۰",
                    progressionStep: 0
                }
            ]
        },
        {
            id: "day_2",
            code: "PRO_UPPER_A",
            dayName: "روز ۲: سینه پرحجم، سرشانه و پشت‌بازو (۲۶ ست سنگین)",
            focus: "بخش بالایی و میانی سینه، دلتوئید جانبی، پشت بازو - پمپ و تقارن کامل",
            duration: "۱:۴۰ دقیقه",
            warmup: [
                "حرکت باز کردن قفسه سینه و کشش فعال سینه راست - ۳ دقیقه",
                "چرخش دست با کش پیلاتس (Band Pull-Apart) - ۲ ست ۱۵ تکرار"
            ],
            exercises: [
                {
                    id: "ex_2_1",
                    nameFa: "پرس بالا سینه با دمبل (میز ۳۰ درجه)",
                    nameEn: "Incline Dumbbell Press (Chest Symmetry)",
                    target: "بخش بالایی سینه و رفع ناهماهنگی سمت راست و چپ",
                    sets: 4,
                    reps: "8 - 10",
                    tempo: "3 - 1 - 1 - 0",
                    tempoDetails: "۳ ثانیه منفی | ۱ ثانیه مکث کششی عمیق | ۱ ثانیه بالا بردن هماهنگ",
                    rir: "1 - 2 RIR",
                    restSeconds: 100,
                    technique: "سنگین و بدون تقلب",
                    formCues: [
                        "استفاده از دمبل باعث می‌شود سینه چپ و راست دقیقاً بار مساوی ببرند.",
                        "در پایین حرکت کشش عمیق سینه را حس کنید."
                    ],
                    startingWeight: "۲۶",
                    progressionStep: 2.0
                },
                {
                    id: "ex_2_2",
                    nameFa: "پرس سینه صاف با دمبل (Dumbbell Flat Press)",
                    nameEn: "Flat Dumbbell Bench Press",
                    target: "ضخامت کلی و تقارن بخش جناقی سینه (Sternal Pecs)",
                    sets: 4,
                    reps: "8 - 10",
                    tempo: "3 - 1 - 1 - 0",
                    tempoDetails: "۳ ثانیه پایین بردن آرام دمبل‌ها | ۱ ثانیه پرتاب پرقدرت با تمرکز سینه",
                    rir: "1 RIR",
                    restSeconds: 90,
                    technique: "هایپرتروفی مکانیکی",
                    formCues: [
                        "تیغه‌های شانه به عقب جمع و سینه جلو باشد تا شانه راست به جلو پرتاب نشود."
                    ],
                    startingWeight: "۲۸",
                    progressionStep: 2.0
                },
                {
                    id: "ex_2_3",
                    nameFa: "پک‌دک پروانه‌ای دستگاه (Pec Deck Flye)",
                    nameEn: "Pec Deck Machine Flye (Lengthened Partials)",
                    target: "ایزولاسیون عمیق سینه و پمپ خون انفجاری",
                    sets: 4,
                    reps: "12 - 15 (+ ۴ تکرار نیمه در کشش ست آخر)",
                    tempo: "2 - 1 - 1 - 2",
                    tempoDetails: "۲ ثانیه باز شدن | ۱ ثانیه جمع کردن | ۲ ثانیه فشردن انقباض سینه",
                    rir: "0 RIR",
                    restSeconds: 75,
                    technique: "⚡ LENGTHENED PARTIALS در ست آخر",
                    formCues: [
                        "در انتهای ست آخر وقتی نتوانستید دست‌ها را به هم برسانید، ۴ تکرار نیمه در بیشترین زاویه کشش بزنید."
                    ],
                    startingWeight: "۴۵ - ۵۵ کیلوگرم"
                },
                {
                    id: "ex_2_4",
                    nameFa: "کراس‌اوور سیم‌کش از پایین به بالا (Low-to-High)",
                    nameEn: "Low-to-High Cable Flye (Upper Pec Shelf)",
                    target: "تفکیک خط ترقوه و لبه بالایی سینه",
                    sets: 3,
                    reps: "12 - 15",
                    tempo: "2 - 1 - 1 - 2",
                    tempoDetails: "۲ ثانیه بازگشت | ۱ ثانیه جمع کردن | ۲ ثانیه اوج انقباض بالا",
                    rir: "0 - 1 RIR",
                    restSeconds: 60,
                    technique: "ایزومتریک ۲ ثانیه‌ای",
                    formCues: [
                        "در اوج انقباض ۲ ثانیه مکث کنید و روی سینه سمت راست تمرکز حسی داشته باشید."
                    ],
                    startingWeight: "۱۲.۵",
                    progressionStep: 2.5
                },
                {
                    id: "ex_2_5",
                    nameFa: "نشر جانب دمبل در صفحه اسکاپولا (Lateral Raise)",
                    nameEn: "Dumbbell Lateral Raise (Rest-Pause Technique)",
                    target: "عضله سرشانه میانی (گردی و پهنای سرشانه)",
                    sets: 4,
                    reps: "12 - 15 (+ ست آخر Rest-Pause)",
                    tempo: "2 - 0 - 1 - 1",
                    tempoDetails: "۲ ثانیه پایین آوردن آرام | ۱ ثانیه مکث در بالا",
                    rir: "0 RIR",
                    restSeconds: 60,
                    technique: "🔥 REST-PAUSE در ست آخر",
                    formCues: [
                        "دست‌ها را کمی متمایل به جلو بالا ببرید تا مفاصل شانه ایمن بماند.",
                        "ست آخر: ۱۵ تکرار + ۱۰ ثانیه استراحت + ۵ تکرار دیگر."
                    ],
                    startingWeight: "۱۰",
                    progressionStep: 1.0
                },
                {
                    id: "ex_2_6",
                    nameFa: "پشت‌بازو سیم‌کش با طناب (Triceps Rope Pushdown)",
                    nameEn: "Cable Triceps Rope Pushdown",
                    target: "سر جانبی و خارجی سه‌سر بازو",
                    sets: 4,
                    reps: "12 - 15",
                    tempo: "2 - 1 - 1 - 1",
                    tempoDetails: "۲ ثانیه بازگشت منفی | ۱ ثانیه قفل کامل طناب در پایین با باز کردن دست‌ها",
                    rir: "0 - 1 RIR",
                    restSeconds: 60,
                    technique: "قفل کامل با باز کردن طناب",
                    formCues: [
                        "آرنج‌ها چسبیده به پهلوها و ثابت."
                    ],
                    startingWeight: "۲۵",
                    progressionStep: 2.5
                },
                {
                    id: "ex_2_7",
                    nameFa: "دیپ پارالل با وزن بدن یا دستگاه کمکی",
                    nameEn: "Parallel Bar Dips (Chest & Triceps Finisher)",
                    target: "لبه پایینی سینه و حجم کلی پشت‌بازو",
                    sets: 3,
                    reps: "10 - 12",
                    tempo: "3 - 1 - 1 - 0",
                    tempoDetails: "۳ ثانیه پایین آمدن کنترل‌شده | ۱ ثانیه بالا آمدن قدرتی",
                    rir: "1 RIR",
                    restSeconds: 75,
                    technique: "پایان‌بخش پرقدرت جلسه",
                    formCues: [
                        "تنه کمی متمایل به جلو برای درگیری بیشتر سینه."
                    ],
                    startingWeight: "وزن بدن"
                }
            ]
        },
        {
            id: "day_3",
            code: "REST_MOBILITY",
            dayName: "روز ۳: ریکاوری فعال، پدل تفریحی و اصلاح شانه راست",
            focus: "آزاد کردن عضلات، تخلیه اسید لاکتیک و تمرینات اصلاحی پدل",
            duration: "۳۰ - ۴۵ دقیقه",
            warmup: [
                "فوم رولر و ماساژ پکتورالیس مینور شانه راست",
                "حرکت چرخش خارجی شانه با کش (External Rotation) - ۳ ست ۱۵ تکرار"
            ],
            exercises: [
                {
                    id: "ex_3_1",
                    nameFa: "پیاده‌روی آزاد یا تردمیل شیب‌دار + پدل تفریحی",
                    nameEn: "Light Recovery Cardio / Recreational Padel",
                    target: "ریکاوری مفاصل و افزایش خون‌رسانی",
                    sets: 1,
                    reps: "۳۰ الی ۴۰ دقیقه",
                    tempo: "پیوسته و ملایم",
                    tempoDetails: "شدت ملایم برای شارژ باتری سیستم عصبی",
                    rir: "بدون خستگی",
                    restSeconds: 0,
                    technique: "ریکاوری فعال",
                    formCues: [
                        "روز لذت بردن و استراحت عضلات بدون وزنه زدن سنگین."
                    ],
                    startingWeight: "۰",
                    progressionStep: 0
                }
            ]
        },
        {
            id: "day_4",
            code: "PRO_LOWER_B",
            dayName: "روز ۴: پا هیبرید، باسن، پرس پا و تنفس نروژی (۲۴ ست)",
            focus: "باسن، همسترینگ عمیق، تک‌پایی برای پدل، ساق پا و تنفس سنگین",
            duration: "۱:۴۵ دقیقه",
            warmup: [
                "دوچرخه ثابت - ۵ دقیقه",
                "لانژ دینامیک بدون وزنه - ۲ ست ۱۰ تکرار"
            ],
            exercises: [
                {
                    id: "ex_4_1",
                    nameFa: "لانژ بلغاری با دمبل (Bulgarian Split Squat)",
                    nameEn: "Bulgarian Split Squat (Left Leg First)",
                    target: "قدرت تک‌پایی، باسن و تعادل جهشی در پدل",
                    sets: 4,
                    reps: "10 - 12 هر پا",
                    tempo: "2 - 1 - 1 - 0",
                    tempoDetails: "۲ ثانیه پایین رفتن | ۱ ثانیه توقف عمیق | ۱ ثانیه بالا آمدن",
                    rir: "1 RIR",
                    restSeconds: 90,
                    technique: "شروع همیشه از پای چپ",
                    formCues: [
                        "ابتدا پای چپ را اجرا کنید. تنه اندکی به جلو متمایل باشد تا بار روی باسن بیفتد."
                    ],
                    startingWeight: "۱۴",
                    progressionStep: 2.0
                },
                {
                    id: "ex_4_2",
                    nameFa: "هیپ تراست با هالتر سنگین یا اسمیت",
                    nameEn: "Heavy Barbell Hip Thrust",
                    target: "عضله گلوتئوس ماکسیموس و رفع کامل گودی کمر",
                    sets: 4,
                    reps: "10 - 12 (با ۲ ثانیه مکث اوج انقباض)",
                    tempo: "2 - 2 - 1 - 0",
                    tempoDetails: "۲ ثانیه پایین | ۱ ثانیه لمس زمین | ۱ ثانیه بالا بردن | ۲ ثانیه فشردن حداکثری باسن",
                    rir: "1 RIR",
                    restSeconds: 90,
                    technique: "فشردن ماکسیمال گلوتئوس",
                    formCues: [
                        "در اوج حرکت چانه به سینه باشد و باسن را با تمام قدرت منقبض کنید."
                    ],
                    startingWeight: "۸۰",
                    progressionStep: 5.0
                },
                {
                    id: "ex_4_3",
                    nameFa: "پرس پا پنجه باز مایل (Wide Stance Leg Press)",
                    nameEn: "Wide-Stance Leg Press (Adductors & Glutes)",
                    target: "نزدیک‌کننده‌های ران (Adductors) و بخش داخلی و باسن",
                    sets: 4,
                    reps: "12 - 15",
                    tempo: "3 - 1 - 1 - 0",
                    tempoDetails: "۳ ثانیه پایین رفتن کنترل‌شده | ۱ ثانیه پرتاب سنگین به بالا",
                    rir: "1 RIR",
                    restSeconds: 90,
                    technique: "دامنه حرکتی عمیق",
                    formCues: [
                        "پاها در بالاترین قسمت صفحه و پنجه‌ها متمایل به بیرون."
                    ],
                    startingWeight: "۱۴۰ - ۱۸۰ کیلوگرم"
                },
                {
                    id: "ex_4_4",
                    nameFa: "پشت ران نشسته دستگاه (Seated Leg Curl)",
                    nameEn: "Seated Leg Curl",
                    target: "انقباض مستقیم و ایزوله همسترینگ در وضعیت کشش",
                    sets: 4,
                    reps: "12 - 15",
                    tempo: "3 - 1 - 1 - 1",
                    tempoDetails: "۳ ثانیه منفی آرام | ۱ ثانیه انقباض کامل",
                    rir: "1 RIR",
                    restSeconds: 60,
                    technique: "ایزولاسیون کامل",
                    formCues: [
                        "پای چپ را با تمرکز بالا منقبض کنید."
                    ],
                    startingWeight: "۳۵",
                    progressionStep: 2.5
                },
                {
                    id: "ex_4_5",
                    nameFa: "ساق پا ایستاده دستگاه اسمیت یا دستگاه ساق",
                    nameEn: "Standing Calf Raise",
                    target: "عضله دوقلوی ساق پا و تاندون آشیل",
                    sets: 4,
                    reps: "12 - 15",
                    tempo: "3 - 2 - 1 - 1",
                    tempoDetails: "۳ ثانیه کشش عمیق | ۲ ثانیه توقف در کف | ۱ ثانیه بالا آمدن روی پنجه",
                    rir: "0 RIR",
                    restSeconds: 60,
                    technique: "مکث ۲ ثانیه‌ای در عمق کشش",
                    formCues: [
                        "مکث ۲ ثانیه‌ای در پایین برای حذف جهش تاندونی و درگیر شدن فیبرهای عضله ضروری است."
                    ],
                    startingWeight: "۷۰",
                    progressionStep: 5.0
                },
                {
                    id: "ex_4_6",
                    nameFa: "شکم خلبانی آویزان یا کرانچ سیم‌کش زانو زده",
                    nameEn: "Hanging Knee Raise / Cable Crunch",
                    target: "راست شکمی، عضله عرضی شکم (TVA) و ثبات ستون فقرات",
                    sets: 4,
                    reps: "15 - 20",
                    tempo: "2 - 1 - 1 - 1",
                    tempoDetails: "جمع کردن لگن به سمت دنده‌ها با انقباض شکم",
                    rir: "0 RIR (سوزش شکم)",
                    restSeconds: 60,
                    technique: "انقباض عمیق شکم",
                    formCues: [
                        "پاها را تاب ندهید؛ با نیروی جمع کردن لگن زانوها را بالا بیاورید."
                    ],
                    startingWeight: "وزن بدن یا سیم‌کش ۴۰ کیلو"
                },
                {
                    id: "ex_4_7",
                    nameFa: "پروتکل قلبی-تنفسی نروژی ۴×۴ (Norwegian 4x4 Protocol)",
                    nameEn: "Norwegian 4x4 VO2 Max Protocol",
                    target: "افزایش حجم ضربه‌ای قلب و بی‌نهایت کردن نفس در پدل",
                    sets: 4,
                    reps: "۴ دقیقه ضربان بالا + ۳ دقیقه پیاده‌روی آرام (۴ راند)",
                    tempo: "۸۵ الی ۹۲ درصد ضربان قلب",
                    tempoDetails: "جمعاً ۲۸ دقیقه اینتروال علمی",
                    rir: "انرژی بالا",
                    restSeconds: 180,
                    technique: "استاندارد طلایی VO2 Max",
                    formCues: [
                        "روی تردمیل شیب‌دار یا دوچرخه: ۴ دقیقه با سرعتی که نتوانید صحبت کنید بدوید/رکاب بزنید و سپس ۳ دقیقه آرام راه بروید."
                    ],
                    startingWeight: "۰",
                    progressionStep: 0
                }
            ]
        },
        {
            id: "day_5",
            code: "PRO_UPPER_B",
            dayName: "روز ۵: زیربغل ضخیم، کول‌ها، جلو بازو و شانه راست (۲۸ ست)",
            focus: "عرض و ضخامت عضلات پشتی، کول‌ها، فیس‌پول شانه راست و پیک جلو بازو",
            duration: "۱:۴۵ دقیقه",
            warmup: [
                "کشش عضلات زیربغل با آویزان شدن از بارفیکس - ۲ ست ۳۰ ثانیه",
                "حرکت گربه-شتر (Cat-Cow) و تحرک ستون فقرات"
            ],
            exercises: [
                {
                    id: "ex_5_1",
                    nameFa: "زیربغل سیم‌کش دست باز (ست آخر Drop Set)",
                    nameEn: "Wide-Grip Lat Pulldown (Drop Set Last Set)",
                    target: "عرض زیربغل (Lats) و ساخت V-Taper پهن",
                    sets: 4,
                    reps: "8 - 10 (+ دراپ‌ست در ست آخر)",
                    tempo: "3 - 1 - 1 - 1",
                    tempoDetails: "۳ ثانیه منفی کنترل‌شده | ۱ ثانیه کشش بالا | ۱ ثانیه کشیدن تا لبه سینه",
                    rir: "1 RIR",
                    restSeconds: 90,
                    technique: "🔥 DROP SET در ست آخر",
                    formCues: [
                        "قفسه سینه بالا باشد و میله را با کشیدن آرنج‌ها به پایین هدایت کنید."
                    ],
                    startingWeight: "۶۰",
                    progressionStep: 2.5
                },
                {
                    id: "ex_5_2",
                    nameFa: "زیربغل دمبل تک‌خم با تکیه‌گاه سینه روی میز شیب‌دار",
                    nameEn: "Chest-Supported Dumbbell Row",
                    target: "ضخامت کمر، عضلات لوزی (Rhomboids) بدون فشار به کمر",
                    sets: 4,
                    reps: "10 - 12",
                    tempo: "2 - 1 - 1 - 1",
                    tempoDetails: "۲ ثانیه بازگشت | ۱ ثانیه کشش | ۱ ثانیه جمع کردن آرنج‌ها به عقب",
                    rir: "1 RIR",
                    restSeconds: 75,
                    technique: "ضخامت پشتی بدون فشار مهره‌ای",
                    formCues: [
                        "دراز کشیدن روی سینه فشار مهره‌های کمر را صفر می‌کند."
                    ],
                    startingWeight: "۲۲",
                    progressionStep: 2.0
                },
                {
                    id: "ex_5_3",
                    nameFa: "زیربغل قایقی سیم‌کش نشسته (Seated Cable Row)",
                    nameEn: "Seated Cable Row (Neutral Close Grip)",
                    target: "بخش میانی کمر و فیبرهای ضخیم عضلات پشتی",
                    sets: 4,
                    reps: "10 - 12",
                    tempo: "2 - 1 - 1 - 1",
                    tempoDetails: "۲ ثانیه بازگشت | ۱ ثانیه کشش کتف | ۱ ثانیه کشیدن سریع به ناف",
                    rir: "1 RIR",
                    restSeconds: 75,
                    technique: "فشردن تیغه‌ها در انتهای دامنه",
                    formCues: [
                        "ستون فقرات خنثی باشد؛ در انتهای حرکت تیغه‌ها را به هم بچسبانید."
                    ],
                    startingWeight: "۵۵ - ۶۵ کیلوگرم"
                },
                {
                    id: "ex_5_4",
                    nameFa: "فیس‌پول سیم‌کش با طناب (حرکت کلیدی اصلاح شانه راست)",
                    nameEn: "Cable Face Pull (Right Shoulder Correction)",
                    target: "دلتوئید خلفی، اینفرااسپیناتوس و عقب کشیدن شانه راست",
                    sets: 4,
                    reps: "15 - 18",
                    tempo: "2 - 1 - 1 - 2",
                    tempoDetails: "۲ ثانیه بازگشت | ۱ ثانیه کشیدن به پیشانی | ۲ ثانیه چرخش مچ به عقب و مکث",
                    rir: "0 - 1 RIR",
                    restSeconds: 60,
                    technique: "چرخش خارجی و ثبات شانه",
                    formCues: [
                        "این حرکت مستقیماً اثرات ضربات پدل را خنثی کرده و شانه راست را به عقب تراز می‌کند."
                    ],
                    startingWeight: "۲۰",
                    progressionStep: 2.5
                },
                {
                    id: "ex_5_5",
                    nameFa: "شراگز دمبل سنگین برای کول‌ها (Dumbbell Shrugs)",
                    nameEn: "Heavy Dumbbell Shrugs (Trapezius Density)",
                    target: "ضخامت و حجم عضلات کول و ذوزنقه بالایی (Traps)",
                    sets: 4,
                    reps: "12 - 15 (با ۲ ثانیه مکث در بالا)",
                    tempo: "2 - 2 - 1 - 0",
                    tempoDetails: "۲ ثانیه پایین آمدن | ۱ ثانیه بالا کشیدن پرتوان | ۲ ثانیه فشردن کول‌ها در اوج",
                    rir: "0 - 1 RIR",
                    restSeconds: 60,
                    technique: "مکث ۲ ثانیه‌ای در اوج انقباض",
                    formCues: [
                        "شانه را نچرخانید! فقط مستقیم به سمت گوش‌ها بالا بکشید و ۲ ثانیه قفل کنید."
                    ],
                    startingWeight: "دمبل‌های ۲۴ - ۳۰ کیلوگرم"
                },
                {
                    id: "ex_5_6",
                    nameFa: "جلو بازو دمبل روی میز شیب‌دار (Incline Dumbbell Curl)",
                    nameEn: "Incline Dumbbell Biceps Curl",
                    target: "کشش سر بلند جلوبازو و ساخت پیک بازو",
                    sets: 4,
                    reps: "10 - 12",
                    tempo: "3 - 1 - 1 - 0",
                    tempoDetails: "۳ ثانیه پایین بردن آرام دمبل | ۱ ثانیه کشش عمیق بازو | ۱ ثانیه جمع کردن با انقباض",
                    rir: "0 - 1 RIR",
                    restSeconds: 75,
                    technique: "کشش بیشینه سر بلند دوسر",
                    formCues: [
                        "روی میز شیب‌دار بنشینید؛ این وضعیت سر بلند دوسر بازویی را در کشش حداکثری هایپرتروفی قرار می‌دهد."
                    ],
                    startingWeight: "۱۲",
                    progressionStep: 1.0
                },
                {
                    id: "ex_5_7",
                    nameFa: "جلو بازو دمبل چکشی (Hammer Curl)",
                    nameEn: "Dumbbell Hammer Curl",
                    target: "براکیالیس، پهنای بازو و تقویت ساعد برای گرفتن راکت پدل",
                    sets: 4,
                    reps: "12 - 15",
                    tempo: "2 - 1 - 1 - 0",
                    tempoDetails: "۲ ثانیه پایین | ۱ ثانیه بالا",
                    rir: "0 - 1 RIR",
                    restSeconds: 60,
                    technique: "ضخامت بازو و ساعد",
                    formCues: [
                        "کف دست‌ها رو به هم (گریپ خنثی). بازو را ضخیم‌تر نشان می‌دهد."
                    ],
                    startingWeight: "۱۴",
                    progressionStep: 1.0
                }
            ]
        }
    ],

    // Weekly Training Volume History for Chart
    volumeHistory: [
        { week: 'هفته ۱', volume: 14200 },
        { week: 'هفته ۲', volume: 15100 },
        { week: 'هفته ۳', volume: 15850 },
        { week: 'هفته ۴', volume: 16700 },
        { week: 'هفته ۵ (جاری)', volume: 17400 }
    ],

    // In-App AI Knowledge Base & Quick Prompt Matrix
    aiKnowledgeBase: {
        foodSubstitutes: {
            chicken: [
                { name: "فیله ماهی قزل‌آلا یا سالمون", amount: "۲۲۰ گرم", notes: "امگا ۳ بالاتر، کمی چربی بیشتر (کاهش ۱ قاشق روغن زیتون)" },
                { name: "کنسرو تن ماهی در آب‌نمک", amount: "۱ قوطی کامل (۱۸۰ گرم)", notes: "شستشوی آب‌نمک برای کنترل سدیم" },
                { name: "راسته گوساله خالص بدون چربی", amount: "۲۰۰ گرم", notes: "غنی از کراتین و روی طبیعی برای تستوسترون" },
                { name: "سفیده تخم‌مرغ پخته", amount: "۷ الی ۸ عدد سفیده", notes: "پروتئین خالص آلبومین زودجذب" }
            ],
            rice: [
                { name: "سیب‌زمینی آب‌پز یا تنوری", amount: "۲۸۰ گرم", notes: "حجم غذایی بیشتر و سیری فوق‌العاده" },
                { name: "نان سنگک سنتی سبوس‌دار", amount: "۳ کف دست بزرگ (حدود ۱۰۰ گرم)", notes: "فیبر بالا و هضم پیوسته" },
                { name: "جو دوسر پرک پخته", amount: "۶۵ گرم خشک", notes: "بتاگلوکان برای سلامت عروق" }
            ],
            potato: [
                { name: "موز درشت + ۲ عدد خرما", amount: "۱ موز + ۲ خرما", notes: "سوخت انفجاری فوری قبل از بازی پدل" },
                { name: "برنج کته ساده", amount: "۱۵۰ گرم پخته", notes: "جایگزین تمیز و در دسترس" }
            ]
        },
        biometricsSummary: "ورزشکار نچرال ۲۸ ساله، قد ۱۸۴، وزن ۸۸، عضله اسکلتی ۴۳.۶ کیلوگرم (InBody)، درصد چربی فعلی حدود ۱۳.۵٪، هدف ۸۳ کیلوگرم (۱۰.۵٪ چربی) بدون افت حجم عضلات. ورزشکار پدل، با جلوآمدگی شانه راست و عقب‌افتادگی ۲۰۰ گرمی ساق چپ."
    },

    // Longevity protocols
    longevity: {
        sleepGuidance: [
            "فاز اول (۲۳:۴۵ تا ۴:۰۰): ۴ ساعت و ۱۵ دقیقه خواب عمیق ترمیم فیزیکی و ترشح هورمون رشد. دمای اتاق ۱۹ درجه و استفاده از چسب دهان ملایم (Mouth Tape) برای افزایش نیتریک اکسید.",
            "بازه مناجات (۴:۰۰ تا ۶:۰۰): نور اتاق فقط ملایم زرد باشد. نوشیدن آب ولرم. انجام ۱۰ دقیقه تنفس NSDR جهت گذار به خواب دوم.",
            "فاز دوم (۶:۰۰ تا ۷:۴۵): ۱ ساعت و ۴۵ دقیقه خواب REM جهت تمرکز شناختی و یادگیری حرکتی پدل. استفاده حتمی از چشم‌بند تاریک."
        ],
        supplements: [
            { name: "کراتین مونوهیدرات", dose: "۵ گرم در روز", timing: "در بطری آب حین تمرین یا همراه با ناهار" },
            { name: "پروتئین وی ایزوله", dose: "۱ اسکوپ (۲۵-۳۰ گرم)", timing: "بلافاصله بعد از تمرین یا در میان‌وعده سیب‌زمینی" },
            { name: "امگا ۳ غلیظ", dose: "۲۰۰۰ میلی‌گرم", timing: "همراه با ناهار (مهار التهاب مفاصل و تاندون‌ها در پدل)" },
            { name: "منیزیم بایس‌گلیسینات + زینک", dose: "۳۰۰ میلی‌گرم منیزیم + ۳۰ میلی‌گرم روی", timing: "۳۰ دقیقه قبل خواب اول (ساعت ۲۳:۰۰)" },
            { name: "ویتامین D3+K2", dose: "۲۰۰۰ واحد", timing: "همراه با صبحانه (حفظ تستوسترون آزاد و استخوان‌ها)" }
        ]
    }
};
