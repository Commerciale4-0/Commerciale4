import { STRINGS } from "./strings";

export const SESSION_LOGGED_USER = "loggedUser";
export const SESSION_SELECTED_COMPANY = "selectedCompany";

export const ORDERS = () => {
    return [
        { id: 0, title: STRINGS.relevance, icon: "sort-amount-desc" },
        { id: 1, title: `↑ ${STRINGS.revenues}`, icon: null },
        { id: 2, title: `↓ ${STRINGS.revenues}`, icon: null },
        { id: 3, title: `↑ ${STRINGS.employees}`, icon: null },
        { id: 4, title: `↓ ${STRINGS.employees}`, icon: null },
        { id: 5, title: `↑ ${STRINGS.nearest}`, icon: null },
        { id: 6, title: `↓ ${STRINGS.farthest}`, icon: null },
    ];
};

export const COMPANY_TYPES = () => {
    return [
        { value: 1, label: STRINGS.productProvider },
        { value: 2, label: STRINGS.serviceProvider },
        { value: 3, label: STRINGS.productServiceProvider },
    ];
};

export const ISO = [
    { value: 1, label: "9001: 2015" },
    { value: 2, label: "9001: 2015 – RT21" },
    { value: 3, label: "15358: 2011" },
    { value: 4, label: "45001: 2018" },
    { value: 5, label: "18001: 2007" },
    { value: 6, label: "3834: 2006" },
];

export const N_EMPOYEES = () => {
    return [
        { value: 0, label: STRINGS.noLimit },
        { value: 1, label: "3" },
        { value: 2, label: "8" },
        { value: 3, label: "15" },
        { value: 4, label: "30" },
        { value: 5, label: "50" },
        { value: 6, label: "80" },
        { value: 7, label: "120" },
        { value: 8, label: "200" },
        { value: 9, label: "400" },
        { value: 10, label: "1000" },
        { value: 11, label: "3000" },
        { value: 12, label: "10000" },
    ];
};

export const REVENUES = () => {
    return [
        { value: 0, label: STRINGS.noLimit },
        { value: 1, label: "0" },
        { value: 2, label: `500${STRINGS.k}` },
        { value: 3, label: `1${STRINGS.m}` },
        { value: 4, label: `2${STRINGS.m}` },
        { value: 5, label: `4${STRINGS.m}` },
        { value: 6, label: `8${STRINGS.m}` },
        { value: 7, label: `15${STRINGS.m}` },
        { value: 8, label: `30${STRINGS.m}` },
        { value: 9, label: `60${STRINGS.m}` },
        { value: 10, label: `100${STRINGS.m}` },
        { value: 11, label: `150${STRINGS.m}` },
        { value: 12, label: `300${STRINGS.m}` },
    ];
};

// export const ATECO_CODES = () => {
//     return [
//         { value: 0, label: STRINGS.otherCode },
//         { value: 1, label: "22.1" },
//         { value: 2, label: "22.2" },
//         { value: 3, label: "24.1" },
//         { value: 4, label: "24.2" },
//         { value: 5, label: "24.31" },
//         { value: 6, label: "24.32" },
//         { value: 7, label: "24.33" },
//         { value: 8, label: "24.34" },
//         { value: 9, label: "24.41" },
//         { value: 10, label: "24.42" },
//         { value: 11, label: "24.43" },
//         { value: 12, label: "24.44" },
//         { value: 13, label: "24.45" },
//         { value: 14, label: "24.51" },
//         { value: 15, label: "24.52" },
//         { value: 16, label: "24.53" },
//         { value: 17, label: "24.54" },
//         { value: 18, label: "25.11" },
//         { value: 19, label: "25.12.1" },
//         { value: 20, label: "25.21" },
//         { value: 21, label: "25.29" },
//         { value: 22, label: "25.3" },
//         { value: 23, label: "25.5" },
//         { value: 24, label: "25.61" },
//         { value: 25, label: "25.62" },
//         { value: 26, label: "25.7" },
//         { value: 27, label: "25.9" },
//         { value: 28, label: "26.12" },
//         { value: 29, label: "26.2" },
//         { value: 30, label: "26.30.1" },
//         { value: 31, label: "26.51.10" },
//         { value: 32, label: "26.52" },
//         { value: 33, label: "26.70.11" },
//         { value: 34, label: "28 (tutti/all)" },
//         { value: 35, label: "29.1" },
//         { value: 36, label: "29.2" },
//         { value: 37, label: "29.3" },
//         { value: 38, label: "33.11" },
//         { value: 39, label: "33.2" },
//         { value: 40, label: "46.61" },
//         { value: 41, label: "46.62" },
//         { value: 42, label: "46.63" },
//         { value: 43, label: "46.64" },
//         { value: 44, label: "46.69.20" },
//         { value: 45, label: "46.69.91" },
//         { value: 46, label: "46.69.94" },
//         { value: 47, label: "46.69.99" },
//     ];
// };

export const REGIONS = [
    { value: 1, label: "Abruzzo" },
    { value: 2, label: "Basilicata" },
    { value: 3, label: "Calabria" },
    { value: 4, label: "Campania" },
    { value: 5, label: "Emilia Romagna" },
    { value: 6, label: "Friuli-Venezia Giulia" },
    { value: 7, label: "Lazio" },
    { value: 8, label: "Liguria" },
    { value: 9, label: "Lombardia" },
    { value: 10, label: "Marche" },
    { value: 11, label: "Molise" },
    { value: 12, label: "Piemonte" },
    { value: 13, label: "Puglia" },
    { value: 14, label: "Sardegna" },
    { value: 15, label: "Sicilia" },
    { value: 16, label: "Trentino-Alto Adige" },
    { value: 17, label: "Toscana" },
    { value: 18, label: "Umbria" },
    { value: 19, label: "Valle d'Aosta" },
    { value: 20, label: "Veneto" },
];

export const CITIES = [
    { value: 1, label: "Chieti", region: 1 },
    { value: 2, label: "L'Aquila", region: 1 },
    { value: 3, label: "Pescara", region: 1 },
    { value: 4, label: "Teramo", region: 1 },
    { value: 5, label: "Matera", region: 2 },
    { value: 6, label: "Potenza", region: 2 },
    { value: 7, label: "Catanzaro", region: 3 },
    { value: 8, label: "Cosenza", region: 3 },
    { value: 9, label: "Crotone", region: 3 },
    { value: 10, label: "Reggio Calabria", region: 3 },
    { value: 11, label: "Vibo Valentia", region: 3 },
    { value: 12, label: "Avellino", region: 4 },
    { value: 13, label: "Benevento", region: 4 },
    { value: 14, label: "Caserta", region: 4 },
    { value: 15, label: "Napoli", region: 4 },
    { value: 16, label: "Salerno", region: 4 },
    { value: 17, label: "Bologna", region: 5 },
    { value: 18, label: "Cesena", region: 5 },
    { value: 19, label: "Ferrara", region: 5 },
    { value: 20, label: "Forlì", region: 5 },
    { value: 21, label: "Modena", region: 5 },
    { value: 22, label: "Parma", region: 5 },
    { value: 23, label: "Piacenza", region: 5 },
    { value: 24, label: "Ravenna", region: 5 },
    { value: 25, label: "Reggio Emilia", region: 5 },
    { value: 26, label: "Rimini", region: 5 },
    { value: 27, label: "Gorizia", region: 6 },
    { value: 28, label: "Pordenone", region: 6 },
    { value: 29, label: "Trieste", region: 6 },
    { value: 30, label: "Udine", region: 6 },
    { value: 31, label: "Frosinone", region: 7 },
    { value: 32, label: "Latina", region: 7 },
    { value: 33, label: "Rieti", region: 7 },
    { value: 34, label: "Roma", region: 7 },
    { value: 35, label: "Viterbo", region: 7 },
    { value: 36, label: "Genova", region: 8 },
    { value: 37, label: "Imperia", region: 8 },
    { value: 38, label: "La Spezia", region: 8 },
    { value: 39, label: "Savona", region: 9 },
    { value: 40, label: "Bergamo", region: 9 },
    { value: 41, label: "Brescia", region: 9 },
    { value: 42, label: "Como", region: 9 },
    { value: 43, label: "Cremona", region: 9 },
    { value: 44, label: "Lecco", region: 9 },
    { value: 45, label: "Lodi", region: 9 },
    { value: 46, label: "Mantova", region: 9 },
    { value: 47, label: "Milano", region: 9 },
    { value: 48, label: "Monza", region: 9 },
    { value: 49, label: "Pavia", region: 9 },
    { value: 50, label: "Sondrio", region: 9 },
    { value: 51, label: "Varese", region: 9 },
    { value: 52, label: "Ancona", region: 10 },
    { value: 53, label: "Ascoli Piceno", region: 10 },
    { value: 54, label: "Fermo", region: 10 },
    { value: 55, label: "Macerata", region: 10 },
    { value: 56, label: "Pesaro", region: 10 },
    { value: 57, label: "Urbino", region: 10 },
    { value: 58, label: "Campobasso", region: 11 },
    { value: 59, label: "Isernia", region: 11 },
    { value: 60, label: "Alessandria", region: 12 },
    { value: 61, label: "Asti", region: 12 },
    { value: 62, label: "Biella", region: 12 },
    { value: 63, label: "Cuneo", region: 12 },
    { value: 64, label: "Novara", region: 12 },
    { value: 65, label: "Torino", region: 12 },
    { value: 66, label: "Verbania", region: 12 },
    { value: 67, label: "Vercelli", region: 12 },
    { value: 68, label: "Andria", region: 13 },
    { value: 69, label: "Bari", region: 13 },
    { value: 70, label: "Barletta", region: 13 },
    { value: 71, label: "Brindisi", region: 13 },
    { value: 72, label: "Foggia", region: 13 },
    { value: 73, label: "Lecce", region: 13 },
    { value: 74, label: "Taranto", region: 13 },
    { value: 75, label: "Trani", region: 13 },
    { value: 76, label: "Cagliari", region: 14 },
    { value: 77, label: "Carbonia", region: 14 },
    { value: 78, label: "Nuoro", region: 14 },
    { value: 79, label: "Oristano", region: 14 },
    { value: 80, label: "Sassari", region: 14 },
    { value: 81, label: "Agrigento", region: 15 },
    { value: 82, label: "Caltanissetta", region: 15 },
    { value: 83, label: "Catania", region: 15 },
    { value: 84, label: "Enna", region: 15 },
    { value: 85, label: "Messina", region: 15 },
    { value: 86, label: "Palermo", region: 15 },
    { value: 87, label: "Ragusa", region: 15 },
    { value: 88, label: "Siracusa", region: 15 },
    { value: 89, label: "Trapani", region: 15 },
    { value: 90, label: "Bolzano", region: 16 },
    { value: 91, label: "Trento", region: 16 },
    { value: 92, label: "Arezzo", region: 17 },
    { value: 93, label: "Firenze", region: 17 },
    { value: 94, label: "Grosseto", region: 17 },
    { value: 95, label: "Livorno", region: 17 },
    { value: 96, label: "Lucca", region: 17 },
    { value: 97, label: "Massa", region: 17 },
    { value: 98, label: "Pisa", region: 17 },
    { value: 99, label: "Pistoia", region: 17 },
    { value: 100, label: "Prato", region: 17 },
    { value: 101, label: "Siena", region: 17 },
    { value: 102, label: "Perugia", region: 18 },
    { value: 103, label: "Terni", region: 18 },
    { value: 104, label: "Aosta", region: 19 },
    { value: 105, label: "Belluno", region: 20 },
    { value: 106, label: "Padova", region: 20 },
    { value: 107, label: "Rovigo", region: 20 },
    { value: 108, label: "Treviso", region: 20 },
    { value: 109, label: "Venezia", region: 20 },
    { value: 110, label: "Verona", region: 20 },
    { value: 111, label: "Vicenza", region: 20 },
];

export const getAtecoStringWithCode = (code) => {
    let atecoList = STRINGS.atecoList;
    let matchedArray = atecoList.filter((ateco) => ateco.value === code);
    if (!matchedArray || !matchedArray.length) {
        return "";
    }
    return matchedArray[0].label;
};

export const citiesInRegion = (regionId) => {
    let cities = [];
    for (let i in CITIES) {
        if (regionId === CITIES[i].region) {
            cities.push(CITIES[i]);
        }
    }
    return cities;
};

export const citiesByAsc = () => {
    return CITIES.sort((a, b) => {
        return a.label.localeCompare(b.label);
    });
};

export const regionsByAsc = () => {
    return REGIONS.sort((a, b) => {
        return a.label.localeCompare(b.label);
    });
};

export const maxsFromMin = (minId, items) => {
    let maxs = [];
    for (let i in items) {
        if (items[i].value > minId || items[i].value === 0) {
            maxs.push(items[i]);
        }
    }
    return maxs;
};

export const minsFromMax = (maxId, items) => {
    if (maxId === 0) {
        return items;
    }

    let mins = [];
    for (let i in items) {
        if (items[i].value < maxId || items[i].value === 0) {
            mins.push(items[i]);
        }
    }
    return mins;
};

export const distanceFromCoords = (lat1, lon1, lat2, lon2, unit = "K") => {
    if (lat1 === lat2 && lon1 === lon2) {
        return 0;
    } else {
        let radlat1 = (Math.PI * lat1) / 180;
        let radlat2 = (Math.PI * lat2) / 180;
        let theta = lon1 - lon2;
        let radtheta = (Math.PI * theta) / 180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = (dist * 180) / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit === "K") {
            dist = dist * 1.609344;
        }
        if (unit === "N") {
            dist = dist * 0.8684;
        }
        return dist;
    }
};

export const numberFromStringWithUnit = (str) => {
    if (typeof str === "number") {
        return str;
    }

    if (!str || !str.length) {
        return 0;
    }

    let index = str.search(STRINGS.k);
    if (index !== -1) {
        return parseInt(str.substr(0, index)) * 1000;
    }

    index = str.search(STRINGS.m);
    if (index !== -1) {
        return parseInt(str.substr(0, index)) * 1000000;
    }

    index = str.search(STRINGS.b);
    if (index !== -1) {
        return parseInt(str.substr(0, index)) * 1000000000;
    }

    return parseInt(str);
};

export const stringWithUnitFromNumber = (numberStr) => {
    let number = parseInt(numberStr);

    if (!number) {
        return 0;
    }

    if (number >= 1000000000) {
        return getStringWithUnit(number, 1000000000) + " " + STRINGS.b;
    }

    if (number >= 1000000) {
        return getStringWithUnit(number, 1000000) + " " + STRINGS.m;
    }

    if (number >= 1000) {
        return getStringWithUnit(number, 1000) + " " + STRINGS.k;
    }

    return number;
};

const getStringWithUnit = (number, unit) => {
    if (number % unit > 0) {
        if (+(number / unit).toFixed(2).toString().slice(-1) === 0) {
            return (number / unit).toFixed(1);
        } else {
            return (number / unit).toFixed(2);
        }
    } else {
        return number / unit;
    }
};

export const orderTags = (srcTags, searchTags) => {
    if (!srcTags) {
        return null;
    }

    if (!searchTags || !searchTags.length) {
        return srcTags;
    }
    let matchedTags = [];
    for (let i in searchTags) {
        let searchTag = searchTags[i].name;
        for (let j in srcTags) {
            let tag = srcTags[j];
            if (tag.toLowerCase().search(searchTag.toLowerCase()) !== -1) {
                matchedTags.push(tag);
                srcTags.splice(j, 1);
                break;
            }
        }
    }

    let tags = matchedTags.slice(0);
    srcTags.forEach((tag) => {
        tags.push(tag);
    });

    return tags;
};

export const getCompanyTypeText = (value) => {
    let types = COMPANY_TYPES();
    let text = "";
    types.forEach((type) => {
        if (type.value === value) {
            text = type.label;
        }
    });

    return text;
};

export const getTotalCompanies = async (registeredCompanies) => {
    // return registeredCompanies;

    let result = await fetch("/init-data.json");
    if (result.status !== 200) {
        return { status: result.status, message: "An error occured due to pull initial companies! " };
    }
    let unregisteredCompanies = await result.json();
    console.log(unregisteredCompanies.length);

    let companies = registeredCompanies.slice(0);
    unregisteredCompanies.forEach((unregisteredCompany) => {
        let found = false;
        registeredCompanies.forEach((registeredCompany) => {
            if (unregisteredCompany.vat === registeredCompany.vat) {
                found = true;
            }
        });
        if (!found) {
            companies.push(unregisteredCompany);
        }
    });

    return { status: 1, data: companies };
};
