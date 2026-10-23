import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "hi";

const KEY = "r2r.lang";
const EVT = "r2r-lang";

const en: Record<string, string> = {
  // Nav / chrome
  "nav.calculator": "Calculator",
  "nav.plan": "Plan",
  "nav.impact": "Impact",
  "nav.safety": "Learn & Safety",
  "nav.langLabel": "Language",
  "footer.tagline": "Rain2Resource — Catch the Rain. Use It Again.",
  "footer.disclaimer":
    "Estimates are planning guidance only. Harvested rainwater is not safe to drink without treatment and testing.",
  "footer.privacy": "Your data stays in this browser.",
  "note.default": "Safety note",

  // Home
  "home.badge": "Urban rainwater planning & recovery",
  "home.h1a": "Catch the Rain.",
  "home.h1b": "Use It Again.",
  "home.sub":
    "Most city rain runs off rooftops straight into drains. Find out how much your site could capture, how to store it, and where it can be safely reused.",
  "home.cta1": "Calculate My Rainwater",
  "home.cta2": "How it works",
  "home.exampleLabel": "Worked example",
  "home.exampleNote": "≈ 175 L/day on average. Illustrative only — not a guarantee of actual collection.",
  "home.summary": "Your summary",
  "home.noSitePre": "No site saved yet.",
  "home.noSiteLink": "Run the calculator",
  "home.noSitePost": "to create your first site profile.",
  "home.potential": "Estimated potential · {name}",
  "home.collected": "Recorded collection (all sites)",
  "home.reused": "Recorded reuse (all sites)",
  "home.how": "How it works",
  "home.step1t": "Describe your site",
  "home.step1d": "Rainfall, roof area and surface type — values you enter and confirm.",
  "home.step2t": "See a transparent estimate",
  "home.step2d": "Annual harvest, daily average and a preliminary storage figure, with the formula shown.",
  "home.step3t": "Plan safe reuse",
  "home.step3d": "Collection checklist, non-drinking uses, overflow and maintenance guidance.",
  "home.step4t": "Track real impact",
  "home.step4d": "Record litres actually collected and reused — kept separate from estimates.",
  "home.maintLink": "Maintenance checklist",
  "home.impactLink": "Impact tracker",
  "home.limitsTitle": "Limitations",
  "home.limitsText":
    "Rain2Resource gives planning estimates, not engineering designs. Harvested rainwater is not automatically safe to drink, and we don't promise flood prevention or groundwater improvement. Get a professional site assessment before building.",

  // Calculator
  "calc.step": "Step 1",
  "calc.title": "Rainwater potential calculator",
  "calc.sub": "Enter your site details. You supply the annual rainfall — check your local meteorological department for an average.",
  "calc.legendProfile": "Site profile",
  "calc.legendRain": "Rain & catchment",
  "calc.legendUse": "Use & storage",
  "calc.name": "Site name",
  "calc.location": "City or location",
  "calc.siteType": "Building / site type",
  "calc.storageSpace": "Space available for storage (optional)",
  "calc.existingSystem": "Existing rainwater system (optional)",
  "calc.rainfall": "Annual rainfall (mm)",
  "calc.area": "Roof / catchment area (m²)",
  "calc.surface": "Surface type",
  "calc.runoff": "Runoff coefficient (0–1, editable)",
  "calc.use": "Intended use",
  "calc.days": "Days of storage desired",
  "calc.phName": "e.g. Green Valley School",
  "calc.phLocation": "e.g. Pune",
  "calc.phStorage": "e.g. 2 m × 1.5 m beside garage",
  "calc.phExisting": "e.g. none / 500 L barrel on one downpipe",
  "calc.phRainfall": "e.g. 800",
  "calc.phArea": "e.g. 100",
  "calc.savedSites": "Saved sites:",
  "calc.newSite": "+ New site",
  "calc.calculate": "Calculate estimate",
  "calc.save": "Save site profile",
  "calc.emptyPre": "Fill in the form and press ",
  "calc.emptyStrong": "Calculate estimate",
  "calc.emptyPost": " to see results.",
  "calc.annual": "Estimated annual harvest",
  "calc.m3hint": "≈ {m3} m³ per year",
  "calc.daily": "Average daily harvest",
  "calc.dailyHint": "Annual ÷ 365",
  "calc.prelim": "Preliminary storage",
  "calc.prelimHint": "Planning estimate for {days} day(s)",
  "calc.formulaTitle": "Formula & assumptions",
  "calc.planningTitle": "Planning estimate only",
  "calc.planningText":
    "Real tank sizing depends on rainfall distribution, demand, space, overflow, tank turnover and engineering requirements.",
  "calc.viewRecs": "View recommendations",
  "toast.saveOk": "Site profile saved in this browser",
  "toast.saveErr": "Couldn't save — browser storage is unavailable. You can keep using the calculator.",

  // Recommendations
  "rec.step": "Step 2",
  "rec.title": "Your collection & reuse plan",
  "rec.sub": "General guidance — it does not replace a professional site assessment.",
  "rec.planFor": "Plan for {name} · {location}",
  "rec.planLine": "{annual}/yr potential · {tank} preliminary storage · {use}",
  "rec.noSitePre": "No site saved yet — guidance below is general.",
  "rec.noSiteLink": "Calculate and save a site",
  "rec.noSitePost": "to personalise it.",
  "rec.collectionTitle": "Collection system checklist",
  "rec.col1t": "Suitable roof and gutters",
  "rec.col1d": "Clean, non-toxic roofing; gutters sloped toward downpipes.",
  "rec.col2t": "Downpipe",
  "rec.col2d": "Carries water from gutters to the filter and tank.",
  "rec.col3t": "First-flush diversion",
  "rec.col3d": "Discards the first, dirtiest rain that washes dust and droppings off the roof.",
  "rec.col4t": "Appropriate filtration",
  "rec.col4d": "Leaf screens and mesh / sand filters before the tank.",
  "rec.col5t": "Covered storage tank",
  "rec.col5d": "Opaque, tightly-lidded tank to block light, algae and debris.",
  "rec.col6t": "Mosquito-proof screens",
  "rec.col6d": "Fine mesh on every inlet, vent and overflow.",
  "rec.col7t": "Overflow pipe",
  "rec.col7d": "Sized to carry heavy rain to a safe outlet.",
  "rec.col8t": "Safe cleaning access",
  "rec.col8d": "A manhole or lid that allows safe inspection and cleaning.",
  "rec.storageTitle": "Storage & mosquito prevention",
  "rec.storageText":
    "Keep tanks sealed and screened, check for standing water around the tank, and use water regularly so it turns over.",
  "rec.reuseTitle": "Safe reuse planner",
  "rec.reuseOtherTitle": "Other non-drinking uses",
  "rec.reuseGardeningD": "Lowest-risk use. Water at soil level; avoid spraying edible leaves just before harvest.",
  "rec.reuseCleaningD": "Washing paths, vehicles and outdoor surfaces. Basic filtration is usually enough.",
  "rec.reuseFlushingD":
    "Only where plumbing and local rules permit. Needs a separate, clearly labelled pipe network with no cross-connection to drinking water.",
  "rec.reuseOtherD": "Possible after appropriate treatment for the specific use.",
  "rec.yourUse": "Your use",
  "rec.notDrinkPre": "Harvested rainwater is ",
  "rec.notDrinkStrong": "not automatically safe to drink",
  "rec.notDrinkPost": ". Drinking use requires appropriate treatment and water-quality testing.",
  "rec.overflowTitle": "Overflow & recharge",
  "rec.ov1": "Give the tank a suitable overflow route for heavy rain.",
  "rec.ov2": "Don't direct water onto neighbouring property or unsafe areas.",
  "rec.ov3": "Never block public stormwater drains.",
  "rec.ov4": "Consider infiltration or groundwater recharge only after a site assessment.",
  "rec.rechargeTitle": "Recharge needs assessment",
  "rec.rechargeText":
    "Check soil, groundwater quality, contamination risk, local permissions and site suitability before any recharge pit or well.",
  "rec.maintTitle": "Maintenance checklist",
  "rec.doneCount": "{done}/{total} done",
  "rec.srDone": " (completed)",
  "rec.srNotDone": " (not completed)",
  "rec.doneAt": "Done {date}",
  "rec.maintNote": "This checklist is saved in your browser. It does not send reminders.",
  "rec.reset": "Reset checklist",
  "rec.startTracking": "Start tracking impact →",

  // Impact
  "imp.step": "Step 3",
  "imp.title": "Impact tracker",
  "imp.sub": "Record what you actually measure. Estimates and real records are always shown separately.",
  "imp.noSite": "Save a site profile first so records can be linked to it.",
  "imp.create": "Create a site profile",
  "imp.siteLabel": "Site:",
  "imp.m1": "Estimated annual potential",
  "imp.m1hint": "From calculator (estimate)",
  "imp.m2": "Recorded collection",
  "imp.m2hint": "{n} real record(s)",
  "imp.m3": "Recorded reuse",
  "imp.m3ok": "{pct}% of collected",
  "imp.m3none": "No records yet",
  "imp.m4": "{year} so far vs estimate",
  "imp.m4hint": "Recorded {ytd} vs ≈{pror} prorated estimate (rain is seasonal)",
  "imp.m4wait": "Shown once this year has real records",
  "imp.formTitle": "Add a record",
  "imp.date": "Date or month",
  "imp.collected": "Litres collected",
  "imp.reused": "Litres reused",
  "imp.notes": "Notes (optional)",
  "imp.notesPh": "Rainfall, maintenance, meter readings…",
  "imp.reuseHigher":
    "Reuse is higher than collection for this entry — that's allowed when you're using water stored from an earlier period.",
  "imp.saveRecord": "Save record",
  "imp.saved": "Record saved",
  "imp.saveErr": "Couldn't save — browser storage is unavailable.",
  "imp.trend": "Monthly trend",
  "imp.removeDemo": "Remove demo data",
  "imp.loadDemo": "Load demo data",
  "imp.demoBanner": "Includes DEMO data — not real measured impact. Demo values are excluded from totals.",
  "imp.emptyChart1": "No records yet.",
  "imp.emptyChart2": "Add your first record using the form.",
  "imp.legendCollected": "Collected (L)",
  "imp.legendReused": "Reused (L)",
  "imp.thDate": "Date",
  "imp.thCollected": "Collected",
  "imp.thReused": "Reused",
  "imp.thNotes": "Notes",
  "imp.thType": "Type",
  "imp.thActions": "Actions",
  "imp.badgeRecorded": "Recorded",
  "imp.deleteAria": "Delete record {date}",

  // Safety
  "safe.eyebrow": "Learn",
  "safe.title": "Rainwater basics & safety",
  "safe.sub": "Simple answers to the questions that matter before you build.",
  "safe.q1": "What is rainwater harvesting?",
  "safe.a1": "Collecting rain that falls on a roof or other hard surface, filtering it, and storing it for later use — instead of letting it run into drains.",
  "safe.q2": "Why does catchment area matter?",
  "safe.a2": "Every square metre of roof catches about 1 litre for every millimetre of rain. A bigger catchment means more potential water.",
  "safe.q3": "What is a runoff coefficient?",
  "safe.a3": "The share of rain that actually reaches your tank (0 to 1). Some water splashes, evaporates or soaks into the surface. Smooth metal roofs lose less (≈0.9); rough or porous surfaces lose more.",
  "safe.q4": "Why use first-flush diversion?",
  "safe.a4": "The first rain washes dust, leaves and bird droppings off the roof. A first-flush diverter throws away that dirtiest water so it doesn't enter the tank.",
  "safe.q5": "Which uses need treatment?",
  "safe.a5": "Gardening and outdoor cleaning usually need only basic filtration. Toilet flushing needs separate plumbing and local approval. Drinking or cooking needs proper treatment and regular water-quality testing.",
  "safe.q6": "Why do overflow and maintenance matter?",
  "safe.a6": "In heavy rain a full tank must overflow safely. Without cleaning, screens and gutters clog, water quality drops, and open tanks can breed mosquitoes.",
  "safe.estTitle": "What we estimate",
  "safe.est1": "Approximate annual harvestable volume",
  "safe.est2": "Average daily volume",
  "safe.est3": "A preliminary storage planning volume",
  "safe.est4": "General collection, reuse and maintenance guidance",
  "safe.noTitle": "What we don't guarantee",
  "safe.no1": "Actual collection — rainfall varies year to year",
  "safe.no2": "Safe drinking water",
  "safe.no3": "Flood prevention or groundwater improvement",
  "safe.no4": "An engineering-grade tank or recharge design",
  "safe.waterTitle": "Water quality",
  "safe.waterText":
    "Harvested rainwater is not automatically safe to drink. Drinking use requires appropriate treatment and water-quality testing.",
  "safe.assessTitle": "Site assessment",
  "safe.assessText":
    "Storage sizing and groundwater recharge need a site-specific assessment covering soil, contamination risk, structure and local permissions.",
  "safe.privacyTitle": "Privacy",
  "safe.privacyText":
    "Your site profiles, records and checklist stay in this browser's local storage. Nothing is sent to a server. Clearing browser data removes them.",
  "safe.cta": "Calculate My Rainwater",
};

const hi: Record<string, string> = {
  "nav.calculator": "कैलकुलेटर",
  "nav.plan": "योजना",
  "nav.impact": "प्रभाव",
  "nav.safety": "जानकारी व सुरक्षा",
  "nav.langLabel": "भाषा",
  "footer.tagline": "Rain2Resource — बारिश को पकड़ें। दोबारा इस्तेमाल करें।",
  "footer.disclaimer":
    "ये अनुमान केवल योजना बनाने के लिए मार्गदर्शन हैं। इलाज और जाँच के बिना संचित वर्षाजल पीने योग्य सुरक्षित नहीं है।",
  "footer.privacy": "आपका डेटा इसी ब्राउज़र में रहता है।",
  "note.default": "सुरक्षा टिप्पणी",

  "home.badge": "शहरी वर्षाजल योजना व पुनःप्राप्ति",
  "home.h1a": "बारिश को पकड़ें।",
  "home.h1b": "दोबारा इस्तेमाल करें।",
  "home.sub":
    "ज़्यादातर शहरों की बारिश छतों से सीधे नालों में बह जाती है। जानें कि आपकी साइट कितना पानी रोक सकती है, उसे कैसे संग्रहित करें, और उसे सुरक्षित रूप से कहाँ इस्तेमाल किया जा सकता है।",
  "home.cta1": "मेरे वर्षाजल का हिसाब लगाएँ",
  "home.cta2": "यह कैसे काम करता है",
  "home.exampleLabel": "उदाहरण",
  "home.exampleNote": "≈ औसतन 175 ली/दिन। केवल उदाहरण — वास्तविक संग्रह की गारंटी नहीं।",
  "home.summary": "आपका सारांश",
  "home.noSitePre": "अभी कोई साइट सेव नहीं है।",
  "home.noSiteLink": "कैलकुलेटर चलाएँ",
  "home.noSitePost": "और अपनी पहली साइट प्रोफ़ाइल बनाएँ।",
  "home.potential": "अनुमानित क्षमता · {name}",
  "home.collected": "दर्ज संग्रह (सभी साइटें)",
  "home.reused": "दर्ज पुनःउपयोग (सभी साइटें)",
  "home.how": "यह कैसे काम करता है",
  "home.step1t": "अपनी साइट बताएँ",
  "home.step1d": "वर्षा, छत का क्षेत्रफल और सतह का प्रकार — वे मान जो आप भरते और पुष्टि करते हैं।",
  "home.step2t": "पारदर्शी अनुमान देखें",
  "home.step2d": "सालाना संग्रह, औसत दैनिक और प्रारंभिक संग्रहण आँकड़ा, सूत्र के साथ।",
  "home.step3t": "सुरक्षित पुनःउपयोग की योजना",
  "home.step3d": "संग्रह चेकलिस्ट, पीने-योग्य-नहीं उपयोग, ओवरफ़्लो और रखरखाव मार्गदर्शन।",
  "home.step4t": "वास्तविक प्रभाव ट्रैक करें",
  "home.step4d": "वास्तव में संग्रहित और पुनःउपयोग किए गए लीटर दर्ज करें — अनुमानों से अलग रखा जाता है।",
  "home.maintLink": "रखरखाव चेकलिस्ट",
  "home.impactLink": "प्रभाव ट्रैकर",
  "home.limitsTitle": "सीमाएँ",
  "home.limitsText":
    "Rain2Resource योजना के अनुमान देता है, इंजीनियरिंग डिज़ाइन नहीं। संचित वर्षाजल अपने-आप पीने योग्य सुरक्षित नहीं होता, और हम बाढ़ रोकथाम या भूजल सुधार का वादा नहीं करते। निर्माण से पहले किसी पेशेवर से साइट मूल्यांकन कराएँ।",

  "calc.step": "चरण 1",
  "calc.title": "वर्षाजल क्षमता कैलकुलेटर",
  "calc.sub": "अपनी साइट की जानकारी भरें। सालाना वर्षा आपको देनी होती है — अपने स्थानीय मौसम विभाग से औसत जाँच लें।",
  "calc.legendProfile": "साइट प्रोफ़ाइल",
  "calc.legendRain": "वर्षा व कैचमेंट",
  "calc.legendUse": "उपयोग व संग्रहण",
  "calc.name": "साइट का नाम",
  "calc.location": "शहर या स्थान",
  "calc.siteType": "भवन / साइट का प्रकार",
  "calc.storageSpace": "संग्रहण के लिए उपलब्ध जगह (वैकल्पिक)",
  "calc.existingSystem": "मौजूदा वर्षाजल सिस्टम (वैकल्पिक)",
  "calc.rainfall": "सालाना वर्षा (मिमी)",
  "calc.area": "छत / कैचमेंट क्षेत्र (वर्ग मी)",
  "calc.surface": "सतह का प्रकार",
  "calc.runoff": "रनऑफ़ गुणांक (0–1, बदल सकते हैं)",
  "calc.use": "इच्छित उपयोग",
  "calc.days": "संग्रहण के चाहे गए दिन",
  "calc.phName": "जैसे: ग्रीन वैली स्कूल",
  "calc.phLocation": "जैसे: पुणे",
  "calc.phStorage": "जैसे: गैरेज के पास 2 मी × 1.5 मी",
  "calc.phExisting": "जैसे: कोई नहीं / एक डाउनपाइप पर 500 ली का ड्रम",
  "calc.phRainfall": "जैसे: 800",
  "calc.phArea": "जैसे: 100",
  "calc.savedSites": "सेव की गई साइटें:",
  "calc.newSite": "+ नई साइट",
  "calc.calculate": "अनुमान लगाएँ",
  "calc.save": "साइट प्रोफ़ाइल सेव करें",
  "calc.emptyPre": "फ़ॉर्म भरें और ",
  "calc.emptyStrong": "अनुमान लगाएँ",
  "calc.emptyPost": " दबाएँ — परिणाम यहीं दिखेंगे।",
  "calc.annual": "अनुमानित सालाना संग्रह",
  "calc.m3hint": "≈ प्रति वर्ष {m3} घन मीटर",
  "calc.daily": "औसत दैनिक संग्रह",
  "calc.dailyHint": "सालाना ÷ 365",
  "calc.prelim": "प्रारंभिक संग्रहण",
  "calc.prelimHint": "{days} दिनों के लिए योजना अनुमान",
  "calc.formulaTitle": "सूत्र व मान्यताएँ",
  "calc.planningTitle": "केवल योजना का अनुमान",
  "calc.planningText":
    "असली टैंक आकार वर्षा के बँटवारे, माँग, जगह, ओवरफ़्लो, टैंक टर्नओवर और इंजीनियरिंग ज़रूरतों पर निर्भर करता है।",
  "calc.viewRecs": "सुझाव देखें",
  "toast.saveOk": "साइट प्रोफ़ाइल इसी ब्राउज़र में सेव हुई",
  "toast.saveErr": "सेव नहीं हुआ — ब्राउज़र स्टोरेज उपलब्ध नहीं है। आप कैलकुलेटर फिर भी इस्तेमाल कर सकते हैं।",

  "rec.step": "चरण 2",
  "rec.title": "आपकी संग्रह व पुनःउपयोग योजना",
  "rec.sub": "सामान्य मार्गदर्शन — यह पेशेवर साइट मूल्यांकन की जगह नहीं लेता।",
  "rec.planFor": "योजना: {name} · {location}",
  "rec.planLine": "{annual}/वर्ष क्षमता · {tank} प्रारंभिक संग्रहण · {use}",
  "rec.noSitePre": "अभी कोई साइट सेव नहीं है — नीचे का मार्गदर्शन सामान्य है।",
  "rec.noSiteLink": "कैलकुलेट से साइट सेव करें",
  "rec.noSitePost": "इसे अपने हिसाब से बनाने के लिए।",
  "rec.collectionTitle": "संग्रह सिस्टम चेकलिस्ट",
  "rec.col1t": "उपयुक्त छत और अटरियाँ",
  "rec.col1d": "साफ़, गैर-ज़हरीली छत सामग्री; अटरियाँ डाउनपाइप की ओर ढलान के साथ।",
  "rec.col2t": "डाउनपाइप",
  "rec.col2d": "अटरियों से फ़िल्टर और टैंक तक पानी ले जाता है।",
  "rec.col3t": "फ़र्स्ट-फ्लश डाइवर्ज़न",
  "rec.col3d": "पहली, सबसे गंदी बारिश बहा देता है जो छत की धूल और मैल धोती है।",
  "rec.col4t": "उपयुक्त फ़िल्टरेशन",
  "rec.col4d": "टैंक से पहले पत्ती-जाली और मेश / रेत फ़िल्टर।",
  "rec.col5t": "ढका हुआ संग्रहण टैंक",
  "rec.col5d": "अपारदर्शी, कसकर ढका टैंक — रोशनी, शैवाल और मैल से बचाव।",
  "rec.col6t": "मच्छर-रोधी जालियाँ",
  "rec.col6d": "हर इनलेट, वेंट और ओवरफ़्लो पर महीन मेश।",
  "rec.col7t": "ओवरफ़्लो पाइप",
  "rec.col7d": "भारी बारिश को सुरक्षित निकास तक ले जाने लायक आकार।",
  "rec.col8t": "सुरक्षित सफ़ाई पहुँच",
  "rec.col8d": "सुरक्षित निरीक्षण और सफ़ाई के लिए मैनहोल या ढक्कन।",
  "rec.storageTitle": "संग्रहण व मच्छर रोकथाम",
  "rec.storageText": "टैंक सील व जालीदार रखें, टैंक के आसपास भरा पानी जाँचें, और पानी का नियमित उपयोग करें ताकि वह घुलता-मिलता रहे।",
  "rec.reuseTitle": "सुरक्षित पुनःउपयोग प्लानर",
  "rec.reuseOtherTitle": "अन्य पीने-योग्य-नहीं उपयोग",
  "rec.reuseGardeningD": "सबसे कम जोखिम वाला उपयोग। मिट्टी के स्तर पर पानी दें; कटाई से ठीक पहले खाद्य पत्तियों पर छिड़काव न करें।",
  "rec.reuseCleaningD": "रास्तों, वाहनों और बाहरी सतहों की धुलाई। आमतौर पर बुनियादी फ़िल्टरेशन काफ़ी है।",
  "rec.reuseFlushingD":
    "केवल जहाँ नल-नेटवर्क और स्थानीय नियम अनुमति देते हैं। पीने के पानी से कोई क्रॉस-कनेक्शन न हो — ऐसा अलग, साफ़ लेबल वाला पाइप नेटवर्क चाहिए।",
  "rec.reuseOtherD": "उस विशेष उपयोग के लिए उपयुक्त इलाज के बाद संभव।",
  "rec.yourUse": "आपका उपयोग",
  "rec.notDrinkPre": "संचित वर्षाजल ",
  "rec.notDrinkStrong": "अपने-आप पीने योग्य सुरक्षित नहीं",
  "rec.notDrinkPost": " है। पीने के उपयोग के लिए उपयुक्त इलाज और जल-गुणवत्ता जाँच ज़रूरी है।",
  "rec.overflowTitle": "ओवरफ़्लो व रिचार्ज",
  "rec.ov1": "टैंक को भारी बारिश के लिए उपयुक्त ओवरफ़्लो रास्ता दें।",
  "rec.ov2": "पानी को पड़ोसी की संपत्ति या असुरक्षित जगहों की ओर न मोड़ें।",
  "rec.ov3": "सार्वजनिक स्टॉर्मवाटर नालियाँ कभी न रोकें।",
  "rec.ov4": "किसी भी रिचार्ज पिट या कुएँ पर विचार सिर्फ़ साइट मूल्यांकन के बाद करें।",
  "rec.rechargeTitle": "रिचार्ज के लिए मूल्यांकन ज़रूरी",
  "rec.rechargeText":
    "किसी भी रिचार्ज पिट या कुएँ से पहले मिट्टी, भूजल गुणवत्ता, संदूषण जोखिम, स्थानीय अनुमतियाँ और साइट की उपयुक्तता जाँचें।",
  "rec.maintTitle": "रखरखाव चेकलिस्ट",
  "rec.doneCount": "{done}/{total} हो गए",
  "rec.srDone": " (पूरा हुआ)",
  "rec.srNotDone": " (बाकी)",
  "rec.doneAt": "पूरा {date}",
  "rec.maintNote": "यह चेकलिस्ट आपके ब्राउज़र में सेव रहती है। यह रिमाइंडर नहीं भेजती।",
  "rec.reset": "चेकलिस्ट रीसेट करें",
  "rec.startTracking": "प्रभाव ट्रैक करना शुरू करें →",

  "imp.step": "चरण 3",
  "imp.title": "प्रभाव ट्रैकर",
  "imp.sub": "जो वास्तव में मापते हैं वही दर्ज करें। अनुमान और असली रिकॉर्ड हमेशा अलग दिखाए जाते हैं।",
  "imp.noSite": "पहले साइट प्रोफ़ाइल सेव करें ताकि रिकॉर्ड उससे जुड़ सकें।",
  "imp.create": "साइट प्रोफ़ाइल बनाएँ",
  "imp.siteLabel": "साइट:",
  "imp.m1": "अनुमानित सालाना क्षमता",
  "imp.m1hint": "कैलकुलेटर से (अनुमान)",
  "imp.m2": "दर्ज संग्रह",
  "imp.m2hint": "{n} असली रिकॉर्ड",
  "imp.m3": "दर्ज पुनःउपयोग",
  "imp.m3ok": "संग्रह का {pct}%",
  "imp.m3none": "अभी कोई रिकॉर्ड नहीं",
  "imp.m4": "{year} अब तक बनाम अनुमान",
  "imp.m4hint": "दर्ज {ytd} बनाम ≈{pror} आनुपातिक अनुमान (वर्षा मौसमी है)",
  "imp.m4wait": "इस साल के असली रिकॉर्ड आने पर दिखेगा",
  "imp.formTitle": "रिकॉर्ड जोड़ें",
  "imp.date": "तारीख या महीना",
  "imp.collected": "संग्रहित लीटर",
  "imp.reused": "पुनःउपयोग लीटर",
  "imp.notes": "टिप्पणी (वैकल्पिक)",
  "imp.notesPh": "वर्षा, रखरखाव, मीटर रीडिंग…",
  "imp.reuseHigher":
    "इस प्रविष्टि में पुनःउपयोग संग्रह से अधिक है — यह तब मान्य है जब आप पहले संग्रहित पानी इस्तेमाल कर रहे हों।",
  "imp.saveRecord": "रिकॉर्ड सेव करें",
  "imp.saved": "रिकॉर्ड सेव हुआ",
  "imp.saveErr": "सेव नहीं हुआ — ब्राउज़र स्टोरेज उपलब्ध नहीं है।",
  "imp.trend": "मासिक रुझान",
  "imp.removeDemo": "डेमो डेटा हटाएँ",
  "imp.loadDemo": "डेमो डेटा लोड करें",
  "imp.demoBanner": "डेमो डेटा शामिल है — यह असली मापा प्रभाव नहीं है। डेमो मान कुल में शामिल नहीं होते।",
  "imp.emptyChart1": "अभी कोई रिकॉर्ड नहीं।",
  "imp.emptyChart2": "फ़ॉर्म से पहला रिकॉर्ड जोड़ें।",
  "imp.legendCollected": "संग्रहित (ली)",
  "imp.legendReused": "पुनःउपयोग (ली)",
  "imp.thDate": "तारीख",
  "imp.thCollected": "संग्रह",
  "imp.thReused": "पुनःउपयोग",
  "imp.thNotes": "टिप्पणी",
  "imp.thType": "प्रकार",
  "imp.thActions": "कार्रवाइयाँ",
  "imp.badgeRecorded": "दर्ज",
  "imp.deleteAria": "रिकॉर्ड हटाएँ {date}",

  "safe.eyebrow": "जानकारी",
  "safe.title": "वर्षाजल बुनियादी बातें व सुरक्षा",
  "safe.sub": "निर्माण से पहले मायने रखने वाले सवालों के सरल जवाब।",
  "safe.q1": "वर्षाजल संचयन क्या है?",
  "safe.a1": "छत या दूसरी कठोर सतह पर गिरने वाली बारिश को रोकना, छानना और बाद के उपयोग के लिए संग्रहित करना — नालियों में बहने की जगह।",
  "safe.q2": "कैचमेंट क्षेत्र क्यों मायने रखता है?",
  "safe.a2": "छत का हर वर्ग मीटर हर मिमी बारिश पर लगभग 1 लीटर पकड़ता है। बड़ा कैचमेंट यानी अधिक संभावित पानी।",
  "safe.q3": "रनऑफ़ गुणांक क्या है?",
  "safe.a3": "बारिश का वह हिस्सा जो वास्तव में आपके टैंक तक पहुँचता है (0 से 1)। कुछ पानी छींटे, वाष्पीकरण या सोखने में चला जाता है। चिकनी धातु की छतों में कम नुकसान (≈0.9); खुरदरी या छिद्रयुक्त सतहों में अधिक।",
  "safe.q4": "फ़र्स्ट-फ्लश डाइवर्ज़न क्यों?",
  "safe.a4": "पहली बारिश छत की धूल, पत्ते और पक्षियों की बीट बहा देती है। फ़र्स्ट-फ्लश डाइवर्टर वह सबसे गंदा पानी बहा देता है ताकि वह टैंक में न जाए।",
  "safe.q5": "किन उपयोगों के लिए इलाज चाहिए?",
  "safe.a5": "बागवानी और बाहरी सफ़ाई के लिए आमतौर पर बुनियादी छँटाई काफ़ी है। शौचालय फ्लशिंग के लिए अलग नल-नेटवर्क और स्थानीय अनुमति चाहिए। पीने या खाना बनाने के लिए उचित इलाज और नियमित जल-गुणवत्ता जाँच ज़रूरी।",
  "safe.q6": "ओवरफ़्लो और रखरखाव क्यों मायने रखते हैं?",
  "safe.a6": "भारी बारिश में भरा टैंक सुरक्षित रूप से ओवरफ़्लो होना चाहिए। सफ़ाई न हो तो जालियाँ और अटरियाँ जाम होती हैं, पानी की गुणवत्ता गिरती है, और खुले टैंक मच्छर पाल सकते हैं।",
  "safe.estTitle": "हम क्या अनुमान देते हैं",
  "safe.est1": "अनुमानित सालाना संग्रहणीय मात्रा",
  "safe.est2": "औसत दैनिक मात्रा",
  "safe.est3": "प्रारंभिक संग्रहण योजना मात्रा",
  "safe.est4": "सामान्य संग्रह, पुनःउपयोग व रखरखाव मार्गदर्शन",
  "safe.noTitle": "हम क्या गारंटी नहीं देते",
  "safe.no1": "वास्तविक संग्रह — वर्षा हर साल बदलती है",
  "safe.no2": "पीने योग्य सुरक्षित पानी",
  "safe.no3": "बाढ़ रोकथाम या भूजल सुधार",
  "safe.no4": "इंजीनियरिंग-स्तर का टैंक या रिचार्ज डिज़ाइन",
  "safe.waterTitle": "जल गुणवत्ता",
  "safe.waterText": "संचित वर्षाजल अपने-आप पीने योग्य सुरक्षित नहीं होता। पीने के उपयोग के लिए उपयुक्त इलाज और जल-गुणवत्ता जाँच ज़रूरी है।",
  "safe.assessTitle": "साइट मूल्यांकन",
  "safe.assessText": "संग्रहण आकार और भूजल रिचार्ज के लिए मिट्टी, संदूषण जोखिम, संरचना और स्थानीय अनुमतियों को शामिल करता साइट-विशिष्ट मूल्यांकन चाहिए।",
  "safe.privacyTitle": "आपकी निजता",
  "safe.privacyText":
    "आपकी साइट प्रोफ़ाइलें, रिकॉर्ड और चेकलिस्ट इसी ब्राउज़र के लोकल स्टोरेज में रहते हैं। कुछ भी सर्वर पर नहीं जाता। ब्राउज़र डेटा साफ़ करने पर ये मिट जाते हैं।",
  "safe.cta": "मेरे वर्षाजल का हिसाब लगाएँ",
};

const dicts: Record<Lang, Record<string, string>> = { en, hi };

function translate(lang: Lang, key: string, params?: Record<string, string | number>): string {
  let s = dicts[lang]?.[key] ?? dicts.en[key] ?? key;
  if (params) for (const [k, v] of Object.entries(params)) s = s.replaceAll(`{${k}}`, String(v));
  return s;
}

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  err: (english: string) => string;
  pick: <T>(enValue: T, hiValue: T) => T;
};

const LangCtx = createContext<Ctx>({
  lang: "en",
  setLang: () => {},
  t: (key, params) => translate("en", key, params),
  err: (s) => s,
  pick: (enValue) => enValue,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const apply = () => {
      try {
        const raw = window.localStorage.getItem(KEY);
        if (raw === "hi" || raw === "en") setLangState(raw);
      } catch {
        /* storage unavailable */
      }
    };
    apply();
    window.addEventListener(EVT, apply);
    window.addEventListener("storage", apply);
    return () => {
      window.removeEventListener(EVT, apply);
      window.removeEventListener("storage", apply);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang: (l: Lang) => {
        try {
          window.localStorage.setItem(KEY, l);
          window.dispatchEvent(new Event(EVT));
        } catch {
          /* storage unavailable */
        }
        setLangState(l);
      },
      t: (key, params) => translate(lang, key, params),
      err: (s) => (lang === "hi" ? (ERROR_HI[s] ?? s) : s),
      pick: <T,>(enValue: T, hiValue: T) => (lang === "hi" ? hiValue : enValue),
    }),
    [lang],
  );

  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);

export const SITE_TYPES_HI: Record<string, string> = {
  home: "घर",
  school: "स्कूल / कॉलेज",
  apartment: "अपार्टमेंट / हाउसिंग सोसाइटी",
  office: "ऑफ़िस / व्यावसायिक",
  other: "अन्य",
};

export const SURFACE_HI: Record<string, string> = {
  metal: "धातु की चादर की छत",
  tile: "टाइल वाली छत",
  concrete: "कंक्रीट / सपाट छत",
  other: "अन्य सतह",
};

export const USES_HI: Record<string, string> = {
  gardening: "बागवानी व लैंडस्केपिंग",
  cleaning: "बाहरी सफ़ाई",
  flushing: "शौचालय फ्लशिंग",
  mixed: "पीने-योग्य-नहीं मिश्रित उपयोग",
};

export const ASSUMPTIONS_HI: Record<string, string> = {
  "1 mm of rain on 1 m² ≈ 1 litre before losses.": "1 मिमी वर्षा 1 वर्ग मी पर ≈ नुकसान से पहले 1 लीटर।",
  "Annual rainfall is the figure you entered — it is not fetched or verified.":
    "सालाना वर्षा वही आँकड़ा है जो आपने भरा — यह लाया या जाँचा नहीं जाता।",
  "The runoff coefficient accounts for splash, evaporation and absorption losses.":
    "रनऑफ़ गुणांक छींटे, वाष्पीकरण और सोखने के नुकसान का ध्यान रखता है।",
  "Rain is spread evenly across the year for the daily average; real rainfall is seasonal.":
    "दैनिक औसत के लिए वर्षा को साल भर में बराबर माना गया है; असली वर्षा मौसमी होती है।",
  "Storage size is preliminary planning guidance, not an engineering design.":
    "संग्रहण का आकार प्रारंभिक योजना मार्गदर्शन है, इंजीनियरिंग डिज़ाइन नहीं।",
};

export const MAINT_HI: Record<string, { title: string; description: string }> = {
  roof: { title: "छत और अटरियाँ साफ़ करें", description: "बरसात शुरू होने से पहले पत्ते, धूल और मैल हटाएँ।" },
  flush: { title: "फ़र्स्ट-फ्लश डाइवर्ज़न जाँचें", description: "डाइवर्टर खाली और साफ़ करें ताकि सबसे गंदी पहली बारिश बह जाए।" },
  filter: { title: "फ़िल्टर जाँचें", description: "मेश और फ़िल्टर मीडिया धोएँ या बदलें; जमाव देखें।" },
  cover: { title: "संग्रहण ढका रखें", description: "ढक्कन कसे हुए और अपारदर्शी रखें ताकि रोशनी और मैल अंदर न जाएँ।" },
  overflow: {
    title: "ओवरफ़्लो रास्ते जाँचें",
    description: "सुनिश्चित करें कि ओवरफ़्लो सुरक्षित निकास पर जाए — पड़ोसियों पर या जाम नालियों में नहीं।",
  },
  leaks: { title: "रिसाव और मच्छर घुसपैठ देखें", description: "जोड़ों, जालियों और वेंट में खाली जगह जाँचें।" },
  tank: { title: "टैंक साफ़ करें", description: "अपने सिस्टम की सिफ़ारिश के अनुसार साफ़ करें, आमतौर पर मानसून से पहले।" },
};

export const ERROR_HI: Record<string, string> = {
  "Give this site a name.": "इस साइट को कोई नाम दें।",
  "Keep the name under 80 characters.": "नाम 80 अक्षरों से कम रखें।",
  "Enter a city or location.": "शहर या स्थान भरें।",
  "Keep the location under 100 characters.": "स्थान 100 अक्षरों से कम रखें।",
  "Enter your annual rainfall in mm.": "अपनी सालाना वर्षा मिमी में भरें।",
  "Rainfall must be zero or more.": "वर्षा शून्य या उससे अधिक होनी चाहिए।",
  "That seems too high — check the value (mm per year).": "यह बहुत ज़्यादा लगता है — मान जाँचें (मिमी प्रति वर्ष)।",
  "Enter the catchment area in m².": "कैचमेंट क्षेत्र वर्ग मीटर में भरें।",
  "Catchment area must be greater than zero.": "कैचमेंट क्षेत्र शून्य से अधिक होना चाहिए।",
  "That area seems too large — check the value.": "यह क्षेत्र बहुत बड़ा लगता है — मान जाँचें।",
  "Runoff coefficient must be between 0 and 1.": "रनऑफ़ गुणांक 0 और 1 के बीच होना चाहिए।",
  "Storage days must be greater than zero.": "संग्रहण के दिन शून्य से अधिक होने चाहिए।",
  "Choose 120 days or fewer.": "120 दिन या कम चुनें।",
  "Choose a date.": "तारीख चुनें।",
  "Enter litres collected (0 or more).": "संग्रहित लीटर भरें (0 या अधिक)।",
  "Enter litres reused (0 or more).": "पुनःउपयोग लीटर भरें (0 या अधिक)।",
  "Keep notes under 300 characters.": "टिप्पणी 300 अक्षरों से कम रखें।",
};
