const fs = require('fs');
const path = require('path');

const SUPPLIERS_PATH = 'c:\\Users\\Didar\\Desktop\\repos\\SayaraApp\\Supplier\\suppliers.json';
const NEW_INFO_PATH = 'c:\\Users\\Didar\\Desktop\\repos\\SayaraApp\\Supplier\\new-info.json';
const STATE_PATH = 'c:\\Users\\Didar\\.gemini\\antigravity\\brain\\22a4d0c6-8c40-47d1-9886-5001da2ab1c6\\migration_state.json';

function cleanPhone(phone) {
    if (!phone) return "";
    phone = phone.trim().replace(/\s/g, "").replace(/-/g, "");
    if (phone.startsWith("0")) {
        phone = phone.substring(1);
    }
    return phone;
}

function formatVal(val) {
    if (val === null || (typeof val === 'string' && val.trim() === "")) {
        return " ";
    }
    return val;
}

function processBatch(batchSize = 10) {
    if (!fs.existsSync(SUPPLIERS_PATH)) {
        console.error("Suppliers file not found.");
        return;
    }

    const suppliers = JSON.parse(fs.readFileSync(SUPPLIERS_PATH, 'utf-8'));
    const newInfo = JSON.parse(fs.readFileSync(NEW_INFO_PATH, 'utf-8'));

    let processedCount = 0;
    if (fs.existsSync(STATE_PATH)) {
        const state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf-8'));
        processedCount = state.processed_count || 0;
    }

    const currentPhones = new Set();
    suppliers.forEach(s => {
        (s.phones || []).forEach(p => currentPhones.add(cleanPhone(p)));
    });

    let nextId = suppliers.length > 0 ? Math.max(...suppliers.map(s => s.id)) + 1 : 1;
    let addedCount = 0;
    let newProcessedIndex = processedCount;

    const batchAdded = [];

    for (let i = processedCount; i < newInfo.length; i++) {
        if (addedCount >= batchSize) break;

        const entry = newInfo[i];
        newProcessedIndex = i + 1;

        const rawPhones = entry.Phones || "";
        const entryPhones = rawPhones.split(',').map(cleanPhone).filter(p => p !== "");

        let isDuplicate = false;
        for (const p of entryPhones) {
            if (currentPhones.has(p)) {
                isDuplicate = true;
                break;
            }
        }

        if (isDuplicate) {
            console.log(`Skipping duplicate: ${entry.Title}`);
            continue;
        }

        let whatsapp = cleanPhone(entry.WhatsApp || "");
        whatsapp = whatsapp ? whatsapp : " ";

        const brands = {
            'toyota': ['تۆیۆتا', 'تویوتا', 'toyota', 'کرۆلا', 'کۆمری', 'يارس', 'بیکاشۆ', 'لاندکرۆز', 'وەنەوشە'],
            'nissan': ['نیسان', 'nissan', 'ئالتیما', 'سنترا', 'رۆگ', 'پاترۆل', 'پیکاب'],
            'kia': ['کیا', 'kia', 'سورينتو', 'سبورتاج', 'اوبتيما', 'سيراتو'],
            'hyundai': ['هایوندای', 'هیۆندای', 'hyundai', 'النترا', 'سوناتا', 'توسان', 'سانتافی', 'ئەزیرا'],
            'ford': ['فۆرد', 'فورد', 'ford', 'f150', 'فیوژن', 'اکسبلورر', 'ايدج'],
            'chevrolet': ['شۆفرلێت', 'شیفروليه', 'chevrolet', 'ماليبو', 'تاهو'],
            'bmw': ['bmw', 'بی ئێم'],
            'mercedes': ['مرسیدس', 'mercedes', 'ئەکترۆس', 'بنز'],
            'mitsubishi': ['mitsubishi', 'میتسوبیشی', 'لانسر', 'باجیرو'],
            'mazda': ['مازدا', 'mazda'],
            'jeep': ['جيب', 'jeep', 'شیرۆکی'],
            'dodge': ['دۆج', 'dodge', 'چارجەر'],
            'chrysler': ['کرایسلەر', 'chrysler']
        };

        let detectedBrands = [];
        const content = (entry.Title + " " + entry.Description + " " + (entry["Target Type"] || "")).toLowerCase();
        
        for (const [brand, keywords] of Object.entries(brands)) {
            if (keywords.some(k => content.includes(k.toLowerCase()))) {
                detectedBrands.push(brand);
            }
        }

        let vehicleTypes = entry["Target Type"] ? formatVal(entry["Target Type"]) : (detectedBrands.length > 0 ? detectedBrands.join(', ') : " ");
        
        let image = "img/car-parts.png";
        if (detectedBrands.length === 1) {
            const brandImg = detectedBrands[0] === 'mitsubishi' ? 'mitsubishy.png' : detectedBrands[0] + '.png';
            if (fs.existsSync(path.join(path.dirname(SUPPLIERS_PATH), 'img', brandImg))) {
                image = "img/" + brandImg;
            }
        } else if (detectedBrands.length > 1) {
            if (detectedBrands.includes('nissan') && detectedBrands.includes('toyota') && detectedBrands.includes('kia')) {
                image = "img/nissan-toyota-kia.png";
            } else if (detectedBrands.includes('nissan') && detectedBrands.includes('toyota')) {
                image = "img/nissan-toyota.png";
            } else if (detectedBrands.includes('toyota') && detectedBrands.includes('kia')) {
                image = "img/toyota-kia.png";
            } else if (detectedBrands.includes('nissan') && detectedBrands.includes('kia')) {
                image = "img/nissan-kia.png";
            } else {
                image = "img/nissan-toyota-kia.png";
            }
        } else if (content.includes('چاکردنەوە') || content.includes('کارەبای') || content.includes('گەراج') || content.includes('وەستا')) {
            image = "img/car-repairs.png";
        }

        const newSupplier = {
            id: nextId,
            title: formatVal(entry.Title),
            preview: formatVal(entry.Preview),
            description: formatVal(entry.Description),
            location: formatVal(entry.Location),
            phones: entryPhones,
            workHours: formatVal(entry["Work Hours"]),
            image: image,
            whatsapp: whatsapp,
            vehicleTypes: vehicleTypes
        };

        suppliers.push(newSupplier);
        batchAdded.push(newSupplier.title);

        entryPhones.forEach(p => currentPhones.add(p));
        nextId++;
        addedCount++;
    }

    fs.writeFileSync(SUPPLIERS_PATH, JSON.stringify(suppliers, null, 2), 'utf-8');
    fs.writeFileSync(STATE_PATH, JSON.stringify({ processed_count: newProcessedIndex }), 'utf-8');

    console.log(`\nSuccessfully added ${addedCount} suppliers.`);
    if (batchAdded.length > 0) {
        console.log("Added: " + batchAdded.join(", "));
    }
    console.log(`Next processed index: ${newProcessedIndex}`);
}

processBatch();
