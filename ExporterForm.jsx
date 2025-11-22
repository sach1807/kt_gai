import React, { useState, useEffect, useRef, useMemo } from 'react';

import {
    ChevronRight,
    ChevronLeft,
    Upload,
    FileText,
    AlertTriangle,
    CheckCircle,
    Info,
    Shield,
    Truck,
    Globe,
    DollarSign,
    Lock,
    Home,
    MapPin,
    Coins,
    Gavel,
    Clock,
    ArrowUp,
    Package,
    Users,
    Landmark,
    Languages,
    Map as MapIcon,
    Navigation,
    Anchor,
    HelpCircle,
} from 'lucide-react';

// --- Constants & Data

const inputClass = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34D399] focus:border-[#34D399] outline-none transition-all bg-white";

const BUYERS = [
    { id: 1, name: 'Nestle Europe' },
    { id: 2, name: 'Walmart Inc.' },
    { id: 3, name: 'Tesco PLC' },
    { id: 4, name: 'Carrefour SA' },
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD', 'AED'];

const COUNTRIES = ['India', 'USA', 'UK', 'UAE', 'Australia', 'Vietnam', 'China', 'Germany'];

const TRANSLATIONS = {
    en: {
        step1: "Parties & Terms",
        step2: "Cargo & Logistics",
        step3: "Docs & Financials",
        step4: "Service Providers",
        step5: "Security & Launch",
        supplier: "Supplier (Source)",
        buyer: "Buyer (Destination)",
        identified: "Identified?",
        locDetails: "Location Details",
        zip: "Zip Code",
        city: "City",
        country: "Country",
        curr: "Currency",
        next: "Next Step",
        prev: "Previous",
        submit_p1: "PUBLISH FOR PRICE BIDS",
        submit_p2: "DOMESTIC FACTORING (NON-IFSC)",
        submit_p3: "LAUNCH ITFS AUCTION (GIFT CITY)",
        cha_hint: "Customs House Agent: Expert who handles customs clearance paperwork.",
        incoterm_hint: "International rules defining who pays for shipping & insurance.",
        stuffing_hint: "Where goods are loaded into the container.",
        supply_type: "Supply Type",
        tax_implication: "Tax Implication",
        logistics_analysis: "Logistics Analysis",
        distance_calc: "Estimated Distance",
    },
    hi: {
        step1: "पार्टियाँ और शर्तें",
        step2: "माल और लॉजिस्टिक्स",
        step3: "दस्तावेज़ और वित्त",
        step4: "सेवा प्रदाता",
        step5: "सुरक्षा और लॉन्च",
        supplier: "आपूर्तिकर्ता (स्रोत)",
        buyer: "खरीदार (गंतव्य)",
        identified: "पहचाना गया?",
        locDetails: "स्थान विवरण",
        zip: "पिन कोड",
        city: "शहर",
        country: "देश",
        curr: "मुद्रा",
        next: "अगला",
        prev: "पिछला",
        submit_p1: "मूल्य बोली के लिए प्रकाशित करें",
        submit_p2: "घरेलू फैक्टरिंग (गैर-IFSC)",
        submit_p3: "ITFS नीलामी शुरू करें (GIFT City)",
        cha_hint: "कस्टम हाउस एजेंटः वह विशेषज्ञ जो सीमा शुल्क निकासी का काम संभालता है।",
        incoterm_hint: "अंतर्राष्ट्रीय नियम जो तय करते हैं कि शिपिंग और बीमा का भुगतान कौन करेगा।",
        stuffing_hint: "वह स्थान जहां सामान कंटेनर में लोड किया जाता है।",
        supply_type: "आपूर्ति प्रकार",
        tax_implication: "कर निहितार्थ",
        logistics_analysis: "लॉजिस्टिक्स विश्लेषण",
        distance_calc: "अनुमानित दूरी",
    }
};

const APPROVED_PROVIDERS = {
    inspection: ['Ninjacert', 'SGS', 'Bureau Veritas', 'Intertek'],
    warehousing: ['Krishi Safal', 'DHL Supply Chain', 'Maersk Warehousing'],
    sorting: ['Krishi Safal', 'Fresh Sort', 'Agri-Processing Unit 1'],
    transport: ['Prime Freight Solutions', 'Maersk Landside', 'Container Corp of India'],
    cha: ['Prime Freight Solutions', 'Seaways', 'Jeena & Co'],
    cha_dest: ['Prime Freight Solutions Global', 'Local Destination Agents']
};

const PACKING_TYPES = ['Bags (PP/Jute)', 'Cartons/Boxes', 'Pallets', 'Drums/Barrels', 'Loose/Bulk', 'Flexi-Bags'];

const CONTAINER_TYPES = ['LCL (Less than Container)', '20ft FCL (Full Container)', '40ft FCL', '40ft Reefer (Refrigerated)', 'Air Freight', 'Break Bulk'];

const STUFFING_TYPES = ['Factory Stuffing', 'CFS (Container Freight Station)', 'ICD (Inland Depot)', 'Dock Stuffing', 'Cross Stuffing'];

// Umbrella icon definition (fixed)
function Umbrella(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12a10.06 10.06 10 0-20 0Z" />
            <path d="M12 12v8" />
            <path d="M12 2v1" />
        </svg>
    );
}

const PAYMENT_SECURITY_OPTIONS = [
    { id: 'lc', label: "Letter of Credit (LC)", icon: FileText, desc: "Bank guarantees payment upon doc presentation." },
    { id: 'bg', label: "Bank Guarantee (BG)", icon: Shield, desc: "Bank covers loss if buyer defaults." },
    { id: 'insurance', label: "Credit Insurance (ECGC)", icon: Umbrella, desc: "Policy covering non-payment risk." },
    { id: 'property', label: "Property Collateral", icon: Home, desc: "Land/Building offered as security." },
    { id: 'commodity', label: "Underlying Commodity", icon: Package, desc: "Goods pledged to Platform's Warehousing Partner." },
    { id: 'cheque', label: "PDC / Cheque", icon: FileText, desc: "Post-dated cheque (Least preferred)." },
];

const DOCUMENT_CATEGORIES = {
    commercial: {
        title: "Commercial Documents",
        docs: ["Purchase Order (PO)", "Proforma Invoice", "Commercial Invoice", "Packing List"]
    },
    transport: {
        title: "Transport & Title (Critical)",
        docs: ["Bill of Lading (B/L)", "Delivery Order (DO)", "Lorry Receipt (LR)", "E-Way Bill", "Shipping Advice", "Delivery Advice"]
    },
    quality: {
        title: "Quality & Acceptance",
        docs: ["Quality Inspection Report", "Goods Received Note (GRN)", "Quality Acceptance Note"]
    },
    financial: {
        title: "Banking & Security",
        docs: ["Letter of Credit (LC)", "Bank Guarantee", "Cancelled Cheque", "Swift Copy / RTGS Proof"]
    }
};


// --- UI Components ---

const Header = ({ currentLang, setLang }) => (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md h-20 transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
            <div className="flex-shrink-0">
                <a href="#" className="text-xl font-extrabold text-[#0A1931] flex items-center gap-2">
                    <div className="bg-[#0A1931] p-1.5 rounded text-white">
                        <Globe size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="leading-none">Krishitrade</span>
                        <span className="text-[9px] font-medium text-gray-500 tracking-wide uppercase mt-0.5">ITFS Platform</span>
                    </div>
                </a>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative group">
                    <button onClick={() => setLang('en')} className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 hover:border-[#34D399]">
                        <Languages className="w-4 h-4" />
                        {currentLang === 'en' ? 'English' : 'हिंदी'}
                    </button>
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 hidden group-hover:block p-1 z-50">
                        <button onClick={() => setLang('en')} className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-gray-700">English</button>
                        <button onClick={() => setLang('hi')} className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-gray-700">हिंदी (Hindi)</button>
                        <button disabled className="block w-full text-left px-3 py-2 text-sm text-gray-400 cursor-not-allowed">Español (Coming Soon)</button>
                        <button disabled className="block w-full text-left px-3 py-2 text-sm text-gray-400 cursor-not-allowed">العربية (Coming Soon)</button>
                        <button disabled className="block w-full text-left px-3 py-2 text-sm text-gray-400 cursor-not-allowed">Français (Coming Soon)</button>
                    </div>
                </div>
                <button className="px-4 py-2 text-sm font-bold text-[#0A1931] rounded-full bg-gray-100 hover:bg-gray-200 transition duration-150 flex items-center gap-2">
                    <Home className="w-4 h-4" /> <span className="hidden sm:inline">Dashboard</span>
                </button>
            </div>
        </div>
    </header>
);

const Footer = () => (
    <footer className="bg-[#0A1931] text-gray-300 py-8 text-sm">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
            <div>
                <h4 className="text-white font-bold mb-2">Krishitrade</h4>
                <p className="opacity-70">Connecting global agriculture markets with integrated finance and logistics.</p>
            </div>
            <div>
                <h4 className="text-white font-bold mb-2">Links</h4>
                <ul className="space-y-1 opacity-70">
                    <li>Privacy Policy</li>
                    <li>Terms of Service</li>
                    <li>Support</li>
                </ul>
            </div>
            <div className="text-right opacity-50">
                &copy; 2024 Krishitrade Platform.
            </div>
        </div>
    </footer>
);

const ConflictAlert = ({ message, suggestion }) => (
    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-4 rounded-r-lg animate-fade-in">
        <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-orange-500 mr-3 mt-0.5" />
            <div>
                <h4 className="text-sm font-bold text-orange-800">Data Conflict Detected</h4>
                <p className="text-sm text-orange-700 mt-1">{message}</p>
                {suggestion && (
                    <div className="mt-2 text-xs bg-white/50 p-2 rounded border border-orange-200 text-orange-900">
                        <strong>Suggestion:</strong> {suggestion}
                    </div>
                )}
            </div>
        </div>
    </div>
);

const ProgressBar = ({ currentStep, totalSteps, steps, t }) => {
    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mb-8 border border-gray-100">
            <div className="flex justify-between items-center mb-3 text-sm font-semibold text-gray-600">
                <span>Step <span className="text-[#0A1931] font-bold">{currentStep}</span> of {totalSteps}</span>
                <span className="text-[#34D399] font-bold tracking-wide hidden sm:inline">{t(steps[currentStep - 1])}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 relative overflow-hidden">
                <div
                    className="bg-gradient-to-r from-[#2DD4BF] to-[#34D399] h-2.5 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                    style={{ width: `${progressPercentage}%` }} // Fixed template literal
                />
            </div>
        </div>
    );
};

// --- Helper Components

const FormLabel = ({ children, hint }) => (
    <div className="mb-1.5 group relative">
        <label className="block text-sm font-bold text-gray-700 flex items-center gap-1 cursor-help">
            {children}
            {hint && <Info className="w-3 h-3 text-gray-400" />}
        </label>
        {hint && <div className="absolute left-0 bottom-full mb-1 w-64 bg-gray-800 text-white text-[10px] p-2 rounded hidden group-hover:block z-50 shadow-lg">{hint}</div>}
    </div>
);

// Fixed InputField component
const InputField = ({ type = "text", placeholder, value, onChange, icon: Icon, list, suffix }) => (
    <div className="relative group">
        <input
            type={type}
            list={list}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34D399] focus:border-[#34D399] outline-none transition-all bg-white"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
        {Icon && <Icon className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 group-focus-within:text-[#34D399]" />}
        {suffix && <span className="absolute right-3 top-3.5 text-xs font-bold text-gray-400 pointer-events-none">{suffix}</span>}
    </div>
);

// --- Sub-component for Payment Terms Matrix ---

const PaymentTermsMatrix = ({ type, data, onChange }) => {
    const handleChange = (key, field, value) => {
        onChange(type, {
            ...data,
            [key]: { ...data[key], [field]: value }
        });
    };

    const inputStyle = "w-full p-2 text-sm border border-gray-300 rounded bg-white focus:ring-2 focus:ring-[#34D399] focus:border-transparent outline-none transition-all";

    return (
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mt-2">
            <h4 className="text-sm font-bold text-[#0A1931] mb-4 border-b pb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#34D399]" /> Expected Payment Terms
            </h4>
            <div className="grid grid-cols-12 gap-3 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <div className="col-span-4">Stage</div>
                <div className="col-span-3">Value %</div>
                <div className="col-span-5">Timing (Days)</div>
            </div>
            {['advance', 'loading', 'delivery'].map((stage) => (
                <div key={stage} className="grid grid-cols-12 gap-3 mb-3 items-center">
                    <div className="col-span-4 text-sm font-medium text-gray-700 capitalize">
                        {stage === 'advance' ? 'Advance' : stage === 'loading' ? 'Agst Loading' : 'Agst Delivery'}
                    </div>
                    <div className="col-span-3 relative">
                        <input
                            type="number"
                            placeholder="0"
                            className={inputStyle}
                            value={data[stage]?.percent || ""}
                            onChange={(e) => handleChange(stage, 'percent', e.target.value)}
                        />
                        <span className="absolute right-2 top-2.5 text-gray-400 text-xs pointer-events-none">%</span>
                    </div>
                    <div className="col-span-5">
                        <input
                            type="number"
                            placeholder={stage === 'delivery' ? "Days After" : "Days Before"}
                            className={inputStyle}
                            value={data[stage]?.days || ""}
                            onChange={(e) => handleChange(stage, 'days', e.target.value)}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

// Main Application
export default function App() {
    const formTopRef = useRef(null);
    const [step, setStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false); // Fixed variable name for clarity
    const [lang, setLang] = useState('en');

    // T helper
    const t = (key) => TRANSLATIONS[lang][key] || TRANSLATIONS['en'][key] || key;

    // Form State
    const [formData, setFormData] = useState({
        isSupplierIdentified: true,
        isBuyerIdentified: true,

        // Step 1: Commercials
        supplierTermType: "",
        supplierCurrency: 'USD',
        supplierTermDetails: { zip: "", city: "", country: 'India' },
        supplierPayment: { advance: { percent: "", days: "" }, loading: { percent: "", days: "" }, delivery: { percent: "", days: "" } },
        buyerTermType: "",
        buyerCurrency: 'USD',
        buyerTermDetails: { zip: "", city: "", country: 'USA' },
        buyerPayment: { advance: { percent: "", days: "" }, loading: { percent: "", days: "" }, delivery: { percent: "", days: "" } },

        // Step 2: Product & Cargo
        product: { name: "", hsnCode: "", gstRate: "", specifications: "" },
        cargo: { weight: "", weightUnit: 'MT', quantity: "", quantityUnit: 'Units', packingType: "", containerType: "", stuffingPoint: "" },
        productFiles: { photos: [], videos: [], reports: [] },

        // Step 3: Docs & Financials
        selectedDocTypes: [],
        documents: {},
        docNumber: "", docDate: "", dealCurrency: 'USD', docValue: "", fundingCurrency: 'USD', fundingAmount: "", deliveryDate: "",
        supplierBank: { bankName: "", swiftCode: "", iban: "", accountNo: "", ifscCode: "" },
        buyerBank: { bankName: "", swiftCode: "", iban: "", accountNo: "", ifscCode: "" },

        // Step 4: Logistics Providers
        providers: { inspection: "", warehousing: "", sorting: "", transport: "", cha: "", chaDest: "" },
        providerDocs: {},

        // Step 5: Security & Launch
        securityType: "",
        securityDetails: "",
        riskPreference: 'non-recourse',
        certified: false
    });

    const [conflicts, setConflicts] = useState([]);
    const [logisticsAnalysis, setLogisticsAnalysis] = useState(null);
    const [supplyAnalysis, setSupplyAnalysis] = useState(null);

    const steps = ["step1", "step2", "step3", "step4", "step5"];
    const totalSteps = steps.length;

    // --- LOGIC: Platform Determination
    const getPlatformType = useMemo(() => {
        if (!formData.isSupplierIdentified || !formData.isBuyerIdentified) {
            return {
                id: 1,
                label: t('submit_p1'),
                color: 'bg-purple-600',
                icon: Users,
                reason: "One or more parties are unidentified. Route to Price Discovery."
            };
        }

        const sCurr = formData.supplierCurrency;
        const bCurr = formData.buyerCurrency;

        if (sCurr === 'INR' && bCurr === 'INR') {
            return {
                id: 2,
                label: t('submit_p2'),
                color: 'bg-blue-600',
                icon: Home,
                reason: "All INR Transaction. Route to Domestic Factoring."
            };
        }

        return {
            id: 3,
            label: t('submit_p3'),
            color: 'bg-[#34D399]',
            icon: Gavel,
            reason: `Foreign currency involved (${sCurr} / ${bCurr}). Route to GIFT City ITFS.`, // Fixed template literal
        };
    }, [formData.isSupplierIdentified, formData.isBuyerIdentified, formData.supplierCurrency, formData.buyerCurrency, lang, t]);

    // --- LOGIC: Conflict & Supply Detection
    useEffect(() => {
        const newConflicts = [];
        const today = new Date();
        const dDate = new Date(formData.deliveryDate);

        if (formData.deliveryDate && !isNaN(dDate)) {
            const daysToDelivery = Math.ceil((dDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            const advanceDays = parseInt(formData.supplierPayment.advance.days || 0);

            if (advanceDays > 0 && daysToDelivery > 0 && advanceDays > daysToDelivery) {
                newConflicts.push({
                    msg: `Advance payment required ${advanceDays} days before delivery, but delivery is only ${daysToDelivery} days away.`, // Fixed template literal
                    suggestion: "Reduce advance payment timeline or extend delivery date."
                });
            }
        }

        setConflicts(newConflicts);

        // Supply Logic (Tax)
        let type = 'Unknown';
        let tax = 'Unknown';

        if (formData.isSupplierIdentified && formData.isBuyerIdentified) {
            const sCountry = formData.supplierTermDetails.country;
            const bCountry = formData.buyerTermDetails.country;
            const sCity = formData.supplierTermDetails.city;
            const bCity = formData.buyerTermDetails.city;

            if (sCountry === 'India' && bCountry === 'India') {
                type = 'Domestic Supply';
                tax = (sCity && bCity && sCity.toLowerCase() === bCity.toLowerCase()) ? 'CGST + SGST' : 'IGST';
            } else if (sCountry === 'India' && bCountry !== 'India') {
                type = 'Export (Cross Border)';
                tax = 'Zero Rated (LUT) / IGST with Refund';
            } else if (sCountry !== 'India' && bCountry === 'India') {
                type = 'Import';
                tax = 'Customs + IGST';
            } else {
                type = 'Third Country Trade';
                tax = 'Not Applicable in India';
            }
        }

        setSupplyAnalysis({ type, tax });

    }, [formData]);

    // --- LOGIC: Logistics
    useEffect(() => {
        if (step === 4 && formData.supplierTermDetails.city && formData.buyerTermDetails.city) {
            const isCrossBorder = formData.supplierTermDetails.country !== formData.buyerTermDetails.country;
            const mockDistance = isCrossBorder ? 6500 : 450;

            setLogisticsAnalysis({
                distance: mockDistance,
                origin: formData.supplierTermDetails.city,
                dest: formData.buyerTermDetails.city,
                requiresLogistics: mockDistance > 50,
                isCrossBorder
            });
        } else if (step === 4) {
            setLogisticsAnalysis(null);
        }
    }, [step, formData.supplierTermDetails, formData.buyerTermDetails]);

    const handleInputChange = (section, field, value) => {
        setFormData(prev => section ? { ...prev, [section]: { ...prev[section], [field]: value } } : {
            ...prev, [field]: value
        });
    };

    const handlePaymentTermChange = (type, newData) => {
        setFormData(prev => ({
            ...prev,
            [type === 'supplier' ? 'supplierPayment' : 'buyerPayment']: newData
        }));
    };

    const toggleIdentity = (role) => {
        setFormData(prev => {
            const newState = { ...prev };

            // Prevent deselecting both
            if (role === 'supplier') {
                if (prev.isSupplierIdentified && !prev.isBuyerIdentified) return prev;
                newState.isSupplierIdentified = !prev.isSupplierIdentified;
            } else {
                if (prev.isBuyerIdentified && !prev.isSupplierIdentified) return prev;
                newState.isBuyerIdentified = !prev.isBuyerIdentified;
            }

            return newState;
        });
    };

    // --- RENDERERS

    const renderStep1 = () => (
        <div className="animate-fade-in space-y-8">
            {supplyAnalysis && (
                <div className="bg-indigo-900 text-white p-4 rounded-lg flex justify-between items-center shadow-lg">
                    <div>
                        <h4 className="text-xs uppercase opacity-70 tracking-wider">{t('supply_type')}</h4>
                        <p className="font-bold text-lg flex items-center gap-2"><Globe className="w-4 h-4" /> {supplyAnalysis.type}</p>
                    </div>
                    <div className="text-right">
                        <h4 className="text-xs uppercase opacity-70 tracking-wider">{t('tax_implication')}</h4>
                        <p className="font-bold text-[#34D399]">{supplyAnalysis.tax}</p>
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
                {/* Supplier */}
                <div className={`bg-white rounded-xl border ${formData.isSupplierIdentified ? 'border-green-200 shadow-sm' : 'border-gray-200 border-dashed'}`}>
                    <div className="p-4 bg-gray-50 rounded-t-xl border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <div className="bg-[#34D399]/20 p-1.5 rounded"><Truck className="w-4 h-4 text-[#0A1931]" /></div>
                            {t('supplier')}
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-500">{t('identified')}</span>
                            <button onClick={() => toggleIdentity('supplier')} className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors duration-300 ${formData.isSupplierIdentified ? 'bg-[#34D399]' : 'bg-gray-300'}`}>
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${formData.isSupplierIdentified ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>
                    <div className="p-5 space-y-4">
                        {formData.isSupplierIdentified ? (
                            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 space-y-3 animate-fade-in">
                                <div className="text-xs font-bold text-[#1A3C71] flex items-center gap-1 uppercase tracking-wide"><MapPin className="w-3 h-3" /> {t('locDetails')}</div>
                                <div className="grid grid-cols-2 gap-3">
                                    <InputField placeholder={t('zip')} value={formData.supplierTermDetails.zip}
                                        onChange={(e) => handleInputChange('supplierTermDetails', 'zip', e.target.value)} />
                                    <InputField placeholder={t('city')}
                                        value={formData.supplierTermDetails.city} onChange={(e) =>
                                            handleInputChange('supplierTermDetails', 'city', e.target.value)} />
                                    <div className="col-span-2">
                                        <FormLabel>{t('country')}</FormLabel>
                                        <select className={inputClass}
                                            value={formData.supplierTermDetails.country} onChange={(e) =>
                                                handleInputChange('supplierTermDetails', 'country', e.target.value)}>
                                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-sm text-yellow-800 flex items-center gap-2"><Info className="w-4 h-4" /> <span>Supplier is unidentified. Platform 1 will solicit bids.</span></div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <FormLabel hint={t('incoterm_hint')}>Delivery Term (Incoterms)</FormLabel>
                                <select className={inputClass} value={formData.supplierTermType}
                                    onChange={(e) => handleInputChange(null, 'supplierTermType', e.target.value)}>
                                    <option value="">Select Incoterm...</option>
                                    <option value="exw">Ex Works</option>
                                    <option value="fob">FOB</option>
                                    <option value="cif">CIF</option>
                                </select>
                            </div>
                            <div className="col-span-2">
                                <FormLabel>Payment Currency</FormLabel>
                                <select className={inputClass} value={formData.supplierCurrency}
                                    onChange={(e) => handleInputChange(null, 'supplierCurrency', e.target.value)}>
                                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                        <PaymentTermsMatrix type="supplier" data={formData.supplierPayment}
                            onChange={handlePaymentTermChange} />
                    </div>
                </div>

                {/* Buyer */}
                <div className={`bg-white rounded-xl border ${formData.isBuyerIdentified ? 'border-green-200 shadow-sm' : 'border-gray-200 border-dashed'}`}>
                    <div className="p-4 bg-gray-50 rounded-t-xl border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <div className="bg-[#34D399]/20 p-1.5 rounded"><Globe className="w-4 h-4 text-[#0A1931]" /></div>
                            {t('buyer')}
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-500">{t('identified')}</span>
                            <button onClick={() => toggleIdentity('buyer')} className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors duration-300 ${formData.isBuyerIdentified ? 'bg-[#34D399]' : 'bg-gray-300'}`}>
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${formData.isBuyerIdentified ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>
                    <div className="p-5 space-y-4">
                        {formData.isBuyerIdentified ? (
                            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 space-y-3 animate-fade-in">
                                <div className="text-xs font-bold text-[#1A3C71] flex items-center gap-1 uppercase tracking-wide"><MapPin className="w-3 h-3" /> {t('locDetails')}</div>
                                <div className="grid grid-cols-2 gap-3">
                                    <InputField placeholder={t('zip')} value={formData.buyerTermDetails.zip}
                                        onChange={(e) => handleInputChange('buyerTermDetails', 'zip', e.target.value)} />
                                    <InputField placeholder={t('city')} value={formData.buyerTermDetails.city}
                                        onChange={(e) => handleInputChange('buyerTermDetails', 'city', e.target.value)} />
                                    <div className="col-span-2">
                                        <FormLabel>{t('country')}</FormLabel>
                                        <select className={inputClass}
                                            value={formData.buyerTermDetails.country} onChange={(e) =>
                                                handleInputChange('buyerTermDetails', 'country', e.target.value)}>
                                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-sm text-yellow-800 flex items-center gap-2"><Info className="w-4 h-4" /> <span>Buyer is unidentified. Platform 1 will solicit bids.</span></div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <FormLabel hint={t('incoterm_hint')}>Delivery Term (Incoterms)</FormLabel>
                                <select className={inputClass} value={formData.buyerTermType}
                                    onChange={(e) => handleInputChange(null, 'buyerTermType', e.target.value)}>
                                    <option value="">Select Incoterm...</option>
                                    <option value="exw">Ex Works</option>
                                    <option value="fob">FOB</option>
                                    <option value="cif">CIF</option>
                                </select>
                            </div>
                            <div className="col-span-2">
                                <FormLabel>Payment Currency</FormLabel>
                                <select className={inputClass} value={formData.buyerCurrency}
                                    onChange={(e) => handleInputChange(null, 'buyerCurrency', e.target.value)}>
                                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                        <PaymentTermsMatrix type="buyer" data={formData.buyerPayment}
                            onChange={handlePaymentTermChange} />
                    </div>
                </div>
            </div>

            {conflicts.length > 0 && (
                <div className="space-y-2">
                    {conflicts.map((c, i) => <
                        ConflictAlert key={i} message={c.msg}
                        suggestion={c.suggestion} />)}
                </div>
            )}
        </div>
    );

    const renderStep2 = () => (
        <div className="animate-fade-in space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Product Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-[#34D399]" /> Basic Product Info
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <FormLabel>Product Name</FormLabel>
                                <InputField
                                    list="products"
                                    placeholder="Start typing..."
                                    value={formData.product.name}
                                    onChange={(e) => handleInputChange('product', 'name', e.target.value)}
                                />
                                <datalist id="products"><option value="Basmati Rice" /><option
                                    value="Spices" /></datalist>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><FormLabel>HSN Code</FormLabel><InputField
                                    placeholder="1006.30" onChange={(e) => handleInputChange('product', 'hsnCode',
                                        e.target.value)} /></div>
                                <div><FormLabel>GST (%)</FormLabel><InputField type="number"
                                    placeholder="5" onChange={(e) => handleInputChange('product', 'gstRate', e.target.value)}
                                /></div>
                            </div>
                            <div><FormLabel>Specifications</FormLabel><textarea
                                className={`${inputClass} h-24`} placeholder="Quality parameters..." onChange={(e) =>
                                    handleInputChange('product', 'specifications', e.target.value)}></textarea></div>
                        </div>
                    </div>
                </div>

                {/* Cargo & Logistics Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Anchor className="w-5 h-5 text-blue-600" /> Cargo & Packing Details
                        </h3>
                        <p className="text-xs text-gray-500 mb-4 bg-blue-50 p-2 rounded">
                            We use this to calculate exact freight costs.
                        </p>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <FormLabel>Total Weight</FormLabel>
                                    <div className="flex">
                                        <input type="number" className="w-2/3 p-3 border
                                        border-gray-300 rounded-l-lg" placeholder="0.00" onChange={(e) =>
                                            handleInputChange('cargo', 'weight', e.target.value)} />
                                        <select className="w-1/3 p-3 border border-gray-300 rounded-r-lg
                                        bg-gray-50" onChange={(e) => handleInputChange('cargo', 'weightUnit', e.target.value)}>
                                            <option>MT</option><option>KG</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <FormLabel>Total Qty</FormLabel>
                                    <InputField type="number" placeholder="Count" suffix="Units"
                                        onChange={(e) => handleInputChange('cargo', 'quantity', e.target.value)} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <FormLabel>Packing Type</FormLabel>
                                    <select className={inputClass} onChange={(e) =>
                                        handleInputChange('cargo', 'packingType', e.target.value)}>
                                        <option value="">Select...</option>
                                        {PACKING_TYPES.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <FormLabel>Container Mode</FormLabel>
                                    <select className={inputClass} onChange={(e) =>
                                        handleInputChange('cargo', 'containerType', e.target.value)}>
                                        <option value="">Select...</option>
                                        {CONTAINER_TYPES.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <FormLabel hint={t('stuffing_hint')}>Stuffing Point</FormLabel>
                                <select className={inputClass} onChange={(e) =>
                                    handleInputChange('cargo', 'stuffingPoint', e.target.value)}>
                                    <option value="">Select Location...</option>
                                    {STUFFING_TYPES.map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="animate-fade-in space-y-8">
            <div className="bg-blue-50 border-l-4 border-[#1A3C71] p-4 rounded-r-lg mb-6 shadow-sm">
                <p className="text-sm font-semibold text-[#1A3C71] flex items-center">
                    <Info className="w-5 h-5 mr-2" /> Please upload key documents (Lorry Receipt,
                    GRN, Quality Report) to trigger payment release.
                </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(DOCUMENT_CATEGORIES).map(([key, category]) => (
                    <div key={key} className="bg-white rounded-xl border border-gray-200
                    shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 font-bold
                        text-gray-700 text-sm uppercase tracking-wide">
                            {category.title}
                        </div>
                        <div className="p-4 space-y-3">
                            {category.docs.map(doc => (
                                <div key={doc} className="flex items-center justify-between p-2
                                hover:bg-gray-50 rounded transition-colors">
                                    <span className="text-xs font-medium text-gray-700 flex items-center
                                    gap-2">
                                        <input type="checkbox" className="rounded text-[#34D399]" /> {doc}
                                    </span>
                                    <label className="cursor-pointer text-xs text-blue-600
                                    hover:text-blue-800 font-bold flex items-center gap-1">
                                        <Upload className="w-3 h-3" /> Upload
                                        <input type="file" className="hidden" />
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-10 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-bold text-[#0A1931] mb-6 flex items-center
                gap-2"><Landmark className="w-5 h-5 text-[#34D399]" /> Banking & Financials</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                        <FormLabel>Total Invoice Value</FormLabel>
                        <div className="flex gap-2">
                            <select className="w-28 p-3 border border-gray-300 rounded-lg bg-white
                            font-medium text-gray-700" value={formData.dealCurrency} onChange={(e) =>
                                handleInputChange(null, 'dealCurrency', e.target.value)}>
                                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <InputField type="number" placeholder="0.00" onChange={(e) =>
                                handleInputChange(null, 'docValue', e.target.value)} />
                        </div>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                        <FormLabel>Funding Required</FormLabel>
                        <div className="flex gap-2">
                            <select className="w-28 p-3 border border-gray-300 rounded-lg bg-white
                            font-medium text-gray-700" value={formData.fundingCurrency} onChange={(e) =>
                                handleInputChange(null, 'fundingCurrency', e.target.value)}>
                                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <InputField type="number" placeholder="0.00" onChange={(e) =>
                                handleInputChange(null, 'fundingAmount', e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Bank Details */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Supplier Bank */}
                    {formData.isSupplierIdentified && (
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide
                            flex items-center gap-2"><Truck className="w-4 h-4" /> Supplier Bank</h4>
                            <div className="space-y-3">
                                <InputField placeholder="Bank Name" onChange={(e) =>
                                    handleInputChange('supplierBank', 'bankName', e.target.value)} />
                                <InputField placeholder="SWIFT / IFSC" onChange={(e) =>
                                    handleInputChange('supplierBank', 'swiftCode', e.target.value)} />
                                <InputField placeholder="Account / IBAN" onChange={(e) =>
                                    handleInputChange('supplierBank', 'accountNo', e.target.value)} />
                            </div>
                        </div>
                    )}

                    {/* Buyer Bank */}
                    {formData.isBuyerIdentified && (
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide
                            flex items-center gap-2"><Globe className="w-4 h-4" /> Buyer Bank (Opening Bank)</h4>
                            <div className="space-y-3">
                                <InputField placeholder="Bank Name" onChange={(e) =>
                                    handleInputChange('buyerBank', 'bankName', e.target.value)} />
                                <InputField placeholder="SWIFT / IFSC" onChange={(e) =>
                                    handleInputChange('buyerBank', 'swiftCode', e.target.value)} />
                                <InputField placeholder="Account / IBAN" onChange={(e) =>
                                    handleInputChange('buyerBank', 'accountNo', e.target.value)} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="animate-fade-in space-y-8">
            {logisticsAnalysis && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200
                overflow-hidden">
                    <div className="bg-gray-900 p-4 text-white flex justify-between items-center">
                        <h3 className="font-bold flex items-center gap-2"><MapIcon className="w-5
                        h-5 text-[#34D399]" /> {t('logistics_analysis')}</h3>
                        {/* FIX: Corrected unterminated string literal by merging class names */}
                        <span className="text-xs bg-white/10 px-2 py-1 rounded">
                            {logisticsAnalysis.isCrossBorder ? "Cross-Border Shipment" : "Domestic Transport"}
                        </span>
                    </div>
                    <div className="p-0 grid md:grid-cols-2">
                        {/* Fake Map Area */}
                        <div className="h-64 bg-gray-100 relative flex items-center justify-center
                        bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                            <div className="absolute inset-0 bg-blue-900/5" />
                            <div className="absolute top-1/3 left-1/4 flex flex-col items-center
                            animate-bounce">
                                <MapPin className="w-8 h-8 text-red-500 drop-shadow-lg" />
                                <span className="text-xs font-bold bg-white px-1 rounded
                                shadow">{logisticsAnalysis.origin}</span>
                            </div>
                            <div className="absolute top-1/2 right-1/4 flex flex-col items-center
                            animate-bounce" style={{ animationDelay: '0.5s' }}>
                                <MapPin className="w-8 h-8 text-green-500 drop-shadow-lg" />
                                <span className="text-xs font-bold bg-white px-1 rounded
                                shadow">{logisticsAnalysis.dest}</span>
                            </div>
                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                <line x1="25%" y1="33%" x2="75%" y2="50%" stroke="#34D399"
                                    strokeWidth="3" strokeDasharray="5,5" />
                            </svg>
                        </div>
                        {/* Details */}
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-gray-500 text-sm">{t('distance_calc')}</span>
                                <span className="text-xl font-bold
                                text-[#0A1931]">{logisticsAnalysis.distance.toLocaleString()} km</span>
                            </div>
                            {logisticsAnalysis.requiresLogistics && (
                                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100
                                text-sm text-indigo-800">
                                    <strong className="flex items-center gap-2 mb-2"><Navigation
                                        className="w-4 h-4" /> Platform Recommendation</strong>
                                    <p>Distance exceeds city limits. We recommend using our empaneled
                                        logistics partners to ensure tracking visibility for the Factor.</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-gray-50 p-2 rounded"><span className="block
                                    text-gray-400">Est. Time</span><span
                                        className="font-bold">{logisticsAnalysis.isCrossBorder ? "25-35 Days (Ocean)" : "3-5 Days (Road)"}</span></div>
                                <div className="bg-gray-50 p-2 rounded"><span className="block
                                    text-gray-400">Est. Cost</span><span
                                        className="font-bold">{logisticsAnalysis.isCrossBorder ? "\$1,200-\$1,500" : "₹15,000 - 22,000"}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
                {Object.keys(APPROVED_PROVIDERS).map((key) => (
                    <div key={key} className="bg-white p-5 rounded-xl border border-gray-200
                    shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <FormLabel>{key.toUpperCase()}</FormLabel>
                            {key === 'cha' && <div className="group relative"><HelpCircle
                                className="w-4 h-4 text-gray-400 cursor-help" /><div className="absolute right-0 w-48
                                bg-black text-white text-[10px] p-2 rounded hidden group-hover:block
                                z-10">{t('cha_hint')}</div></div>}
                        </div>
                        <select className={inputClass} onChange={(e) =>
                            handleInputChange('providers', key, e.target.value)}>
                            <option value="">Select Provider...</option>
                            {APPROVED_PROVIDERS[key].map(opt => <option key={opt}
                                value={opt}>{opt}</option>)}
                            <option value="Other">Other (Requires Approval)</option>
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderStep5 = () => (
        <div className="animate-fade-in space-y-8">
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    {/* Payment Security Section */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-[#0A1931] mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-[#34D399]" /> Payment Security Offered
                        </h3>
                        <p className="text-xs text-gray-500 mb-4">Select the collateral or instrument
                            securing this trade. This directly impacts your funding rate.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {PAYMENT_SECURITY_OPTIONS.map(opt => (
                                <label key={opt.id} className={`flex items-start p-3 rounded-lg border
                                cursor-pointer transition-all ${formData.securityType === opt.id ? 'border-[#34D399] bg-green-50' : 'border-gray-200 hover:border-blue-300'}`}>
                                    <input type="radio" name="security" className="mt-1 mr-3
                                    text-[#34D399] focus:ring-[#34D399]" checked={formData.securityType === opt.id}
                                        onChange={() => handleInputChange(null, 'securityType', opt.id)} />
                                    <div>
                                        <span className="block font-bold text-gray-800
                                        text-sm">{opt.label}</span>
                                        <span className="block text-[10px] text-gray-500">{opt.desc}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                        {formData.securityType && (
                            <div className="mt-4 animate-fade-in">
                                <FormLabel>Additional Security Details</FormLabel>
                                <textarea className={`${inputClass} h-20 `}
                                    placeholder={formData.securityType === 'property' ? "Address of property..." : "Issuing Bank Name..."} onChange={(e) => handleInputChange(null, 'securityDetails',
                                        e.target.value)}></textarea>
                            </div>
                        )}
                    </div>
                    <div className="bg-[#FFFBEB] p-6 rounded-xl border-l-4 border-[#FBBF24]
                    shadow-sm">
                        <h3 className="text-lg font-bold text-[#0A1931] mb-4">Recourse
                            Preference</h3>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-3 cursor-pointer group bg-white/50 p-3
                            rounded-lg border border-transparent hover:border-[#FBBF24] transition-all w-1/2">
                                <input type="radio" name="risk" className="w-5 h-5 text-[#34D399]"
                                    checked={formData.riskPreference === 'non-recourse'} onChange={() =>
                                        handleInputChange(null, 'riskPreference', 'non-recourse')} />
                                <div><span className="font-bold text-[#0A1931]
                                    block">Non-Recourse</span><span className="text-[10px] text-gray-500">Factor absorbs
                                        buyer risk.</span></div>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group bg-white/50 p-3
                            rounded-lg border border-transparent hover:border-[#FBBF24] transition-all w-1/2">
                                <input type="radio" name="risk" className="w-5 h-5 text-[#34D399]"
                                    checked={formData.riskPreference === 'recourse'} onChange={() =>
                                        handleInputChange(null, 'riskPreference', 'recourse')} />
                                <div><span className="font-bold text-[#0A1931]
                                    block">Recourse</span><span className="text-[10px] text-gray-500">You retain buyer
                                        risk.</span></div>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 h-fit
                sticky top-24">
                    <h3 className="text-lg font-bold text-[#0A1931] mb-4 border-b pb-3">Deal
                        Summary</h3>
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Parties Identified</span>
                            <span className="font-bold text-[#0A1931] text-base">
                                {formData.isSupplierIdentified && formData.isBuyerIdentified ? "Both (Ready)"
                                    : "Partial (Bidding)"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Funding Req</span>
                            <span className="font-bold text-[#0A1931]
                            text-base">{formData.fundingCurrency} {formData.fundingAmount || '0'}</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-dashed">
                            <span className="text-xs text-gray-400 block mb-1">Routing to:</span>
                            <div className={`text-xs font-bold px-2 py-1 rounded flex items-center gap-1
                            ${getPlatformType.color} text-white`}>
                                {getPlatformType.icon && <getPlatformType.icon className="w-3 h-3" />} {getPlatformType.label}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-gray-50 p-5 rounded-xl border border-gray-200 flex gap-4
            items-start hover:border-[#34D399] transition-colors">
                <input type="checkbox" id="certify" className="mt-1 w-5 h-5 text-[#34D399]
                border-gray-300 rounded focus:ring-[#34D399] flex-shrink-0" checked={formData.certified}
                    onChange={(e) => handleInputChange(null, 'certified', e.target.checked)} />
                <label htmlFor="certify" className="text-sm text-gray-600 cursor-pointer select-none
                leading-relaxed">
                    I certify that the information provided regarding the underlying trade transaction is
                    true, complete, and correct.
                </label>
            </div>
        </div>
    );

    // Main Render
    return (
        <div className="min-h-screen bg-[#F3F4F6] flex flex-col font-sans text-gray-900">
            <style>{`@import url('https://fonts.googleapis.com/css?family=Inter:wght@300;400;500;600;700;800&display=swap'); body { font-family: 'Inter', sans-serif; }`}</style>

            <Header currentLang={lang} setLang={setLang} />

            <main className="flex-grow pt-28 pb-20 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                {isSubmitted ? (
                    <div className="text-center p-10 bg-white rounded-xl shadow-xl">
                        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-[#0A1931]">Success!</h2>
                        <p className="text-gray-600 mt-2">Your request has been successfully
                            routed.</p>
                        <div className={`mt-6 inline-block px-6 py-3 rounded text-white font-bold
                            ${getPlatformType.color}`}>
                            {getPlatformType.label}
                        </div>
                        <div className="mt-8 max-w-lg mx-auto bg-blue-50 p-4 rounded-lg border
                        border-blue-100 text-left">
                            <h4 className="font-bold text-[#0A1931] mb-2 flex items-center gap-2"><Info
                                className="w-4 h-4" /> Next Steps</h4>
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                <li>Admin verification pending (2-4 hours).</li>
                                {getPlatformType.id === 3 && <li>Documents will be securely shared with
                                    GIFT City Factors.</li>}
                                {getPlatformType.id === 1 && <li>Bids will be visible on your dashboard
                                    within 24 hours.</li>}
                                <li>Track status using Ref ID: #KT-{Math.floor(Math.random() * 10000)}</li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-10">
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0A1931]
                            mb-3">Request Liquidity: New Factoring Deal</h1>
                            <p className="text-lg text-gray-500">Initiate your cross-border funding auction
                                in 5 simple steps.</p>
                        </div>

                        <ProgressBar currentStep={step} totalSteps={totalSteps} steps={steps} t={t} />

                        <div ref={formTopRef} className="bg-white rounded-2xl shadow-2xl border-t-8
                        border-[#34D399] p-6 sm:p-10">

                            <form onSubmit={(e) => e.preventDefault()}>

                                {step === 1 && renderStep1()}
                                {step === 2 && renderStep2()}
                                {step === 3 && renderStep3()}
                                {step === 4 && renderStep4()}
                                {step === 5 && renderStep5()}

                                <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between
                                items-center">

                                    <button
                                        onClick={() => setStep(s => Math.max(1, s - 1))}
                                        disabled={step === 1}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold
                                        text-sm transition-all ${step === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'}`}
                                    >
                                        <ChevronLeft className="w-4 h-4" /> {t('prev')}
                                    </button>

                                    {step < totalSteps ? (
                                        <button
                                            onClick={() => setStep(s => Math.min(totalSteps, s + 1))}
                                            className="flex items-center gap-2 px-8 py-3.5 rounded-xl shadow-lg
                                            shadow-[#34D399]/30 bg-gradient-to-r from-[#2DD4BF] to-[#34D399] text-[#0A1931]
                                            font-bold hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
                                        >
                                            {t('next')} <ChevronRight className="w-4 h-4" />
                                        </button>

                                    ) : (

                                        <button
                                            onClick={() => setIsSubmitted(true)}
                                            disabled={!formData.certified}
                                            className={`flex items-center gap-2 px-10 py-4 rounded-xl shadow-lg
                                            transform active:scale-95 transition-all font-bold text-sm sm:text-lg text-white
                                            ${getPlatformType.color} hover:brightness-110 ${!formData.certified ? 'opacity-50 cursor-not-allowed' : ""}`}
                                        >
                                            {getPlatformType.label}
                                        </button>
                                    )}

                                </div>

                            </form>

                        </div>
                    </>
                )}
            </main>

            <Footer />

        </div>
    );
}
