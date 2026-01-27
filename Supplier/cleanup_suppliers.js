const fs = require('fs');
const path = require('path');

const SUPPLIERS_PATH = 'c:\\Users\\Didar\\Desktop\\repos\\SayaraApp\\Supplier\\suppliers.json';

const brands = {
    'toyota': ['تۆیۆتا', 'تویوتا', 'toyota', 'corolla', 'camry', 'yaris', 'hilux', 'land cruiser', 'کرۆلا', 'کۆمری', 'يارس', 'بیکاشۆ', 'لاندکرۆز', 'وەنەوشە', 'کامری', 'افالون', 'کرۆلا', 'پرادۆ', 'پڕادۆ', 'avalon', 'fortuner', 'prado', 'highlander'],
    'nissan': ['نیسان', 'nissan', 'altima', 'sentra', 'rogue', 'patrol', 'sunny', 'tiida', 'ئالتیما', 'سنترا', 'رۆگ', 'پاترۆل', 'پیکاب', 'سەنی', 'صەنی', 'sunny', 'نافارا', 'تیرا', 'کیکس', 'تیدا', 'ماکسیما', 'maxima', 'pathfinder', 'x-trail', 'xtrail'],
    'kia': ['کیا', 'kia', 'sorento', 'sportage', 'optima', 'cerato', 'cadenza', 'soul', 'سورينتو', 'سبورتاج', 'اوبتيما', 'سيراتو', 'کادینزا', 'ئۆپتیما', 'سۆرێنتۆ', 'سپۆرتێج', 'سول', 'موهافی', 'پیکانتۆ', 'picanto', 'rio', 'ریۆ', 'k5'],
    'hyundai': ['هایوندای', 'هیۆندای', 'hyundai', 'elantra', 'sonata', 'tucson', 'santa fe', 'azira', 'النترا', 'سوناتا', 'توسان', 'سانتافی', 'ئەزیرا', 'توسکانی', 'ئەکسێنت', 'ئێلانترا', 'هندای', 'ئەزيرا', 'genesis', 'جەنسس', 'accent', 'ioniq', 'kona'],
    'ford': ['فۆرد', 'فورد', 'ford', 'f150', 'fusion', 'explorer', 'edge', 'taurus', 'focus', 'فیوژن', 'اکسبلورر', 'ايدج', 'تۆروس', 'فوکس', 'ڤیگو', 'اکسبریشن', 'mustang', 'مۆستانگ', 'expedition', 'ranger'],
    'chevrolet': ['شۆفرلێت', 'شیفروليه', 'chevrolet', 'malibu', 'tahoe', 'traverse', 'equinox', 'spark', 'cruze', 'aveo', 'ماليبو', 'تاهو', 'تراکس', 'ئەڤیۆ', 'ئۆبترا', 'اپیکا', 'کروز', 'سپارک', 'ئیکۆنێکس', 'silverado', 'سیلڤارادۆ', 'کاپڵس'],
    'bmw': ['bmw', 'بی ئێم', 'x5', 'x6'],
    'mercedes': ['مرسیدس', 'mercedes', 'ئەکترۆس', 'بنز', 'actros', 's-class', 'e-class', 'c-class', 'g-class'],
    'mitsubishi': ['mitsubishi', 'میتسوبیشی', 'lancer', 'pajero', 'outlander', 'asx', 'nativa', 'eclipse', 'لانسر', 'باجیرو', 'بومە', 'میتسوبيشي', 'ميتسوبيشي', 'ناتفیا', 'اوت لندر', 'اندي فور', 'قرش', 'کلبت'],
    'mazda': ['مازدا', 'mazda', 'mazda3', 'mazda6', 'cx5', 'cx9'],
    'jeep': ['جيب', 'jeep', 'grand cherokee', 'wrangler', 'cherokee', 'compass', 'شیرۆکی', 'جێب', 'وەنەوشە'],
    'dodge': ['دۆج', 'dodge', 'charger', 'challenger', 'durango', 'journey', 'چارجەر', 'دۆرج'],
    'chrysler': ['کرایسلەر', 'chrysler', '300c', 'voyager', 'pacifica', 'گرايسلر'],
    'opel': ['ئۆپڵ', 'opel', 'vectra', 'astra', 'فیکترا', 'ئۆسترە', 'اوبل'],
    'gmc': ['gmc', 'جی ئێم سی', 'yukon', 'sierra', 'acadia', 'terrain', 'یوکان', 'جمس'],
    'isuzu': ['isuzu', 'ایسوزو', 'd-max', 'دیماکس'],
    'suzuki': ['سازۆکی', 'suzuki', 'سوزوكي', 'vitara', 'swift'],
    'daihatsu': ['دایهاسو', 'daihatsu', 'دايهاتسو', 'terios'],
    'volkswagen': ['ڤۆڵکسواگن', 'volkswagen', 'passat', 'golf', 'jetta', 'tiguan', 'touareg', 'پاسات', 'گۆڵف', 'جیتا', 'فۆڵکس'],
    'proton': ['برۆتۆن', 'proton', 'بروتون'],
    'audi': ['ئاودی', 'audi', 'اودي', 'a4', 'a6', 'a8', 'q5', 'q7'],
    'skoda': ['سکۆدا', 'skoda', 'octavia', 'superb', 'سكودا'],
    'honda': ['هۆندا', 'هوندا', 'honda', 'civic', 'accord', 'crv'],
    'land_rover': ['land rover', 'لاند ڕۆڤەر', 'لاندروفر', 'defender', 'discovery'],
    'range_rover': ['range rover', 'رێنج ڕۆڤەر', 'رنجروفر', 'evoque', 'velar'],
    'mini': ['mini', 'مینی', 'cooper'],
    'byd': ['byd', 'بي واي دي'],
    'lifan': ['lifan', 'لیفان'],
    'geely': ['geely', 'جیلی', 'جيلي'],
    'chery': ['chery', 'شيري', 'tiggo', 'تیکۆ', 'تیگۆ', 'شێری'],
    'great_wall': ['great wall', 'گریت وۆڵ', 'کریت وول'],
    'faw': ['faw', 'فاو'],
    'mg': ['mg', 'ئێم جی'],
    'changan': ['changan', 'شانگان', 'شانجان'],
    'scania': ['scania', 'سکانیا', 'سکانيا'],
    'man': ['man', 'مان'],
    'hino': ['hino', 'هینۆ'],
    'mopar': ['mopar', 'مۆپار', 'موبار'],
    'japanese': ['یابانی', 'ياباني', 'japanese', 'japan', 'یابانى', 'پابانى'],
    'korean': ['کۆری', 'كوري', 'korean', 'korea', 'کۆرى', 'کورى'],
    'american': ['ئەمەریکی', 'ئەمەریکى', 'ئەمەریکای', 'امريكي', 'american', 'america', 'ئەمریکی', 'ئەمریکى', 'ئەمریکای'],
    'chinese': ['چینی', 'صيني', 'chinese', 'china', 'چینى', 'صينى'],
    'european': ['ئەوروپی', 'اوروبي', 'european', 'europe', 'ئەوروپى', 'اوروپى'],
    'all': ['هەموو جۆرە', 'هەموو جۆرێك', 'هەموو جۆرەکان', 'جميع الانواع', 'all types', 'all cars', 'هەموو جۆرە ئۆتۆمبێلێك', 'هەموو جۆرە ئۆتۆمبیلێك'],
    'parts': ['پارچەی یەدەگی', 'پارچەی یەدەگ', 'ئەشیای', 'کەل و پەلی', 'سپێر', 'یەدەگ', 'spare parts', 'spare', 'ئەگزۆز', 'فیتپەمپ', 'گێڕ', 'مەکینە', 'جام', 'تایە', 'ویڵ', 'فلتەر', 'لایت', 'جامچی', 'ڕۆن', 'فلتر', 'فولدر', 'فیتپومب'],
    'repair': ['چاککردنەوە', 'وەستا', 'فیتەر', 'کارەبای', 'گۆڕینی', 'repair', 'service', 'چاککردن', 'چاکردن'],
    'garage': ['گەراج', 'garage'],
    'scrap': ['سکراب', 'سکرابچی', 'سکرابی', 'scrap']
};

function formatVal(val) {
    if (val === null || (typeof val === 'string' && (val.trim() === "" || val.trim() === ","))) {
        return " ";
    }
    return val;
}

function cleanup() {
    const suppliers = JSON.parse(fs.readFileSync(SUPPLIERS_PATH, 'utf-8'));

    suppliers.forEach(s => {
        let detectedBrands = new Set();
        let searchContent = (s.title + " " + s.description).toLowerCase();
        
        for (const [brand, keywords] of Object.entries(brands)) {
            if (keywords.some(k => {
                let lowerK = k.toLowerCase();
                // Avoid false positives for very short keywords like 'man', 'mg', 'kia'
                if (lowerK.length <= 3) {
                    const regex = new RegExp(`(^|[^a-z0-9\u0600-\u06FF])${lowerK}([^a-z0-9\u0600-\u06FF]|$)`, 'iu');
                    return regex.test(searchContent);
                }
                return searchContent.includes(lowerK);
            })) {
                detectedBrands.add(brand);
            }
        }

        // Standardize vehicleTypes: Recalculate completely to avoid sticky false positives
        if (detectedBrands.size > 0) {
            s.vehicleTypes = Array.from(detectedBrands).join(', ');
        } else {
            s.vehicleTypes = " ";
        }
        
        // Clean WhatsApp (remove 964 prefix and standardize)
        if (s.whatsapp && typeof s.whatsapp === 'string' && s.whatsapp.trim() !== "" && s.whatsapp.trim() !== ",") {
            s.whatsapp = s.whatsapp.replace(/\s+/g, '').replace(/-/g, '');
            if (s.whatsapp.startsWith('964')) {
                s.whatsapp = s.whatsapp.substring(3);
            }
            if (s.whatsapp.startsWith('0')) {
                s.whatsapp = s.whatsapp.substring(1);
            }
        } else {
            s.whatsapp = " ";
        }

        // Clean Phones (remove leading 0)
        if (s.phones && Array.isArray(s.phones) && s.phones.length > 0) {
            s.phones = s.phones.map(p => {
                if (p === null) return "";
                let cleaned = String(p).replace(/\s+/g, '').replace(/-/g, '');
                if (cleaned.startsWith('0')) {
                    cleaned = cleaned.substring(1);
                }
                return cleaned;
            }).filter(p => p !== "");
        } else {
            s.phones = [];
        }
        
        // Update image based on detection
        if (detectedBrands.size === 1) {
            const brand = Array.from(detectedBrands)[0];
            const brandImg = brand === 'mitsubishi' ? 'mitsubishy.png' : brand + '.png';
            if (fs.existsSync(path.join(path.dirname(SUPPLIERS_PATH), 'img', brandImg))) {
                s.image = "img/" + brandImg;
            } else {
                s.image = "img/car-parts.png";
            }
        } else if (detectedBrands.size > 1) {
            let brandsArr = Array.from(detectedBrands);
            if (brandsArr.includes('nissan') && brandsArr.includes('toyota') && brandsArr.includes('kia')) {
                s.image = "img/nissan-toyota-kia.png";
            } else if (brandsArr.includes('nissan') && brandsArr.includes('toyota')) {
                s.image = "img/nissan-toyota.png";
            } else if (brandsArr.includes('toyota') && brandsArr.includes('kia')) {
                s.image = "img/toyota-kia.png";
            } else if (brandsArr.includes('nissan') && brandsArr.includes('kia')) {
                s.image = "img/nissan-kia.png";
            } else {
                s.image = "img/nissan-toyota-kia.png";
            }
        } else if (searchContent.includes('چاکردنەوە') || searchContent.includes('کارەبای') || searchContent.includes('گەراج') || searchContent.includes('وەستا')) {
            s.image = "img/car-repairs.png";
        } else {
            s.image = "img/car-parts.png";
        }
    });

    fs.writeFileSync(SUPPLIERS_PATH, JSON.stringify(suppliers, null, 2), 'utf-8');
    console.log("Cleanup complete.");
}

cleanup();
