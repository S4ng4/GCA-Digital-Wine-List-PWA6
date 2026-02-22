/**
 * Helper function per determinare se una sottocategoria deve essere mostrata
 * e per ottenere la descrizione della sottocategoria
 */

// Valid subcategories to display (descriptions in English)
const VALID_SUBCATEGORIES = {
    // Sparkling
    'METODO MARTINOTTI': {
        show: true,
        description: 'Martinotti (Charmat) method - Second fermentation in tank'
    },
    'METODO ANCESTRALE': {
        show: true,
        description: 'Ancestral method - Natural fermentation in bottle'
    },
    'METODO CLASSICO': {
        show: true,
        description: 'Classic method - Second fermentation in bottle (Champagne method)'
    },
    // Tuscany
    'TOSCANA ROSSO': {
        show: true,
        description: 'Tuscan red wines'
    },
    'CHIANTI': {
        show: true,
        description: 'Chianti DOCG - The most famous Tuscan wine'
    },
    'MONTALCINO': {
        show: true,
        description: 'Brunello di Montalcino DOCG - The king of Tuscan wines'
    },
    'SUPERTUSCAN': {
        show: true,
        description: 'Super Tuscan - Innovative Tuscan wines'
    },
    // Veneto
    'VENETO ROSSO': {
        show: true,
        description: 'Veneto red wines'
    },
    'AMARONE': {
        show: true,
        description: 'Amarone della Valpolicella DOCG - Dry passito wine'
    },
    // Piedmont
    'PIEMONTE ROSSO': {
        show: true,
        description: 'Piedmont red wines'
    },
    'BAROLO DOCG': {
        show: true,
        description: 'Barolo DOCG - The king of wines'
    },
    'BARBARESCO DOCG': {
        show: true,
        description: 'Barbaresco DOCG - The queen of wines'
    }
};

/**
 * Verifica se una sottocategoria deve essere mostrata
 */
function shouldShowSubcategory(subcategory, wine) {
    if (!subcategory) return false;
    
    // Controlla se è una sottocategoria valida
    if (VALID_SUBCATEGORIES[subcategory]) {
        return true;
    }
    
    // Per sparkling, mostra solo i metodi
    if (wine.wine_type && wine.wine_type.includes('BOLLICINE')) {
        return subcategory.startsWith('METODO') || subcategory === 'BOLLICINE';
    }
    
    return false;
}

/**
 * Ottiene la descrizione della sottocategoria
 */
function getSubcategoryDescription(subcategory) {
    if (VALID_SUBCATEGORIES[subcategory]) {
        return VALID_SUBCATEGORIES[subcategory].description;
    }
    return '';
}

/**
 * Formatta la sottocategoria per la visualizzazione
 */
function formatSubcategoryForDisplay(subcategory, wine) {
    if (!shouldShowSubcategory(subcategory, wine)) {
        return null;
    }
    
    const description = getSubcategoryDescription(subcategory);
    
    return {
        name: subcategory,
        description: description
    };
}

/**
 * Estrae il prezzo numerico da un vino
 */
function getWinePriceNumber(wine) {
    const price = wine.wine_price || wine.wine_price_bottle || wine.wine_price_glass;
    if (!price || price === 'N/A') return Infinity; // Vini senza prezzo vanno alla fine
    
    // Rimuove il simbolo $ e altri caratteri non numerici, mantiene solo numeri e punto
    const priceStr = String(price).replace(/[^0-9.]/g, '');
    const priceNum = parseFloat(priceStr);
    
    return isNaN(priceNum) ? Infinity : priceNum;
}

/**
 * Raggruppa i vini per sub-categoria
 * Restituisce un array di oggetti con { subcategoryInfo, wines }
 * I vini all'interno di ogni gruppo sono ordinati per prezzo crescente
 */
function groupWinesBySubcategory(wines) {
    const groups = new Map();
    const winesWithoutSubcategory = [];
    
    wines.forEach(wine => {
        const subcategory = wine.subcategory || '';
        const subcategoryInfo = formatSubcategoryForDisplay(subcategory, wine);
        
        if (subcategoryInfo) {
            const key = subcategoryInfo.name;
            if (!groups.has(key)) {
                groups.set(key, {
                    subcategoryInfo: subcategoryInfo,
                    wines: []
                });
            }
            groups.get(key).wines.push(wine);
        } else {
            winesWithoutSubcategory.push(wine);
        }
    });
    
    // Ordina i vini per prezzo crescente all'interno di ogni gruppo
    groups.forEach(group => {
        group.wines.sort((a, b) => {
            const priceA = getWinePriceNumber(a);
            const priceB = getWinePriceNumber(b);
            return priceA - priceB;
        });
    });
    
    // Ordina anche i vini senza sub-categoria per prezzo
    if (winesWithoutSubcategory.length > 0) {
        winesWithoutSubcategory.sort((a, b) => {
            const priceA = getWinePriceNumber(a);
            const priceB = getWinePriceNumber(b);
            return priceA - priceB;
        });
    }
    
    // Converti la Map in array e ordina per nome sub-categoria
    const groupedArray = Array.from(groups.values()).sort((a, b) => 
        a.subcategoryInfo.name.localeCompare(b.subcategoryInfo.name)
    );
    
    // Aggiungi i vini senza sub-categoria alla fine
    if (winesWithoutSubcategory.length > 0) {
        groupedArray.push({
            subcategoryInfo: null,
            wines: winesWithoutSubcategory
        });
    }
    
    return groupedArray;
}

