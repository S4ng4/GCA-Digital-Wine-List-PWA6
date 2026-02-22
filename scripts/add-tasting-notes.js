#!/usr/bin/env node
/**
 * Add tasting_notes (visual, olfactory, gustatory) and body to every wine in wines.json.
 * Expert sommelier style, all in English.
 * Run from project root: node scripts/add-tasting-notes.js
 */

const fs = require('fs');
const path = require('path');

const WINES_PATH = path.join(__dirname, '..', 'data', 'wines.json');

// Body options (sommelier standard)
const BODIES = ['Light', 'Light-Medium', 'Medium', 'Medium-Full', 'Full'];

// Templates by wine family: { body, visual, olfactory, gustatory } with placeholders
function getTemplates(type, sub, region, varietals, name) {
  const t = (type || '').toUpperCase();
  const s = (sub || '').toUpperCase();
  const r = (region || '').toUpperCase();
  const v = (varietals || '').toLowerCase();
  const n = (name || '').toLowerCase();

  // Sparkling - Metodo Classico (Franciacorta, Trento, Alta Langa, etc.)
  if (t.includes('BOLLICINE') && (s.includes('METODO CLASSICO') || s.includes('CLASSICO'))) {
    if (n.includes('rosat') || n.includes('rosé') || n.includes('rose')) {
      return { body: 'Light-Medium', visual: 'Pale pink with fine, persistent perlage and salmon reflections.', olfactory: 'Red berries, wild strawberry, rose, brioche, citrus zest.', gustatory: 'Elegant and crisp, vibrant acidity, creamy mousse, delicate red fruit, mineral finish.' };
    }
    return { body: 'Light-Medium', visual: 'Straw yellow with fine, persistent perlage and greenish reflections.', olfactory: 'Bread crust, white flowers, citrus, fresh almond, white-fruit notes.', gustatory: 'Crisp and elegant, vibrant acidity, creamy mousse, mineral, lingering finish.' };
  }

  // Sparkling - Prosecco / Charmat
  if (t.includes('BOLLICINE') && s.includes('MARTINOTTI')) {
    if (n.includes('asti') || v.includes('moscato')) {
      return { body: 'Light', visual: 'Pale straw with delicate, fleeting bubbles.', olfactory: 'Peach, apricot, white flowers, grapey muscat.', gustatory: 'Sweet and fresh, low alcohol, floral, fruity finish.' };
    }
    if (n.includes('brachetto') || v.includes('brachetto')) {
      return { body: 'Light', visual: 'Bright ruby with violet reflections and soft foam.', olfactory: 'Strawberry, raspberry, rose, candy.', gustatory: 'Sweet and fragrant, low tannin, fruity, refreshing.' };
    }
    return { body: 'Light', visual: 'Pale straw with fine, lively perlage.', olfactory: 'White flowers, pear, apple, acacia, green almond.', gustatory: 'Fresh and easy-drinking, gentle acidity, floral, clean finish.' };
  }

  // Red wines by appellation/style
  if (t.includes('ROSSI') || s.includes('ROSSO')) {
    if (s.includes('BAROLO') || n.includes('barolo')) {
      return { body: 'Full', visual: 'Deep garnet with orange rim and brick highlights.', olfactory: 'Tar, rose, red cherry, dried flower, spice, underbrush.', gustatory: 'Powerful and structured, firm tannins, high acidity, long, complex finish.' };
    }
    if (s.includes('BARBARESCO') || n.includes('barbaresco')) {
      return { body: 'Medium-Full', visual: 'Luminous garnet with orange rim.', olfactory: 'Rose petal, wild cherry, licorice, crushed mint.', gustatory: 'Structured yet refined, firm tannins, vibrant acidity, saline finish.' };
    }
    if (s.includes('BRUNELLO') || n.includes('brunello')) {
      return { body: 'Full', visual: 'Deep ruby with garnet rim.', olfactory: 'Sour cherry, violet, tobacco, earth, spice.', gustatory: 'Full-bodied, dense tannins, bright acidity, long, savoury finish.' };
    }
    if (s.includes('CHIANTI') || n.includes('chianti')) {
      return { body: 'Medium', visual: 'Bright ruby with violet reflections.', olfactory: 'Sour cherry, violet, dried herbs, tobacco.', gustatory: 'Medium-bodied, crisp acidity, fine tannins, savoury finish.' };
    }
    if (s.includes('AMARONE') || n.includes('amarone')) {
      return { body: 'Full', visual: 'Deep ruby with garnet rim.', olfactory: 'Dried cherry, raisin, chocolate, spice, tobacco.', gustatory: 'Rich and powerful, velvety tannins, sweet fruit, long finish.' };
    }
    if (s.includes('RIPASSO') || n.includes('ripasso')) {
      return { body: 'Medium-Full', visual: 'Deep ruby with garnet hints.', olfactory: 'Dark cherry, dried fruit, spice, cocoa.', gustatory: 'Warm and rounded, soft tannins, ripe fruit, persistent.' };
    }
    if (s.includes('VALPOLICELLA') || n.includes('valpolicella')) {
      return { body: 'Light-Medium', visual: 'Bright ruby with purple rim.', olfactory: 'Red cherry, violet, almond, pepper.', gustatory: 'Light and fresh, soft tannins, drinkable, fruity finish.' };
    }
    if (s.includes('BARDOLINO') || n.includes('bardolino')) {
      return { body: 'Light', visual: 'Pale ruby with violet reflections.', olfactory: 'Cherry, strawberry, floral, fresh herbs.', gustatory: 'Light-bodied, crisp, easy-drinking, short finish.' };
    }
    if (s.includes('SUPERTUSCAN') || s.includes('IGT') && r.includes('TOSCANA')) {
      return { body: 'Full', visual: 'Deep ruby to garnet.', olfactory: 'Blackcurrant, plum, vanilla, tobacco, spice.', gustatory: 'Full-bodied, structured tannins, ripe fruit, long finish.' };
    }
    if (s.includes('MAREMMA') || n.includes('morellino')) {
      return { body: 'Medium', visual: 'Ruby with garnet rim.', olfactory: 'Red cherry, wild berry, herbs, spice.', gustatory: 'Medium-bodied, supple tannins, fresh acidity, savoury.' };
    }
    if (r.includes('PIEMONTE') && (v.includes('nebbiolo') || v.includes('barbera') || v.includes('dolcetto'))) {
      if (v.includes('barbera')) return { body: 'Medium', visual: 'Deep ruby with purple rim.', olfactory: 'Sour cherry, blackberry, violet, spice.', gustatory: 'Juicy acidity, medium tannin, fruity, food-friendly.' };
      if (v.includes('dolcetto')) return { body: 'Medium', visual: 'Purple-ruby with violet rim.', olfactory: 'Black cherry, plum, almond, violet.', gustatory: 'Soft tannins, fruity, bitter almond finish.' };
    }
    if (r.includes('SICILIA') || r.includes('SICILY')) {
      return { body: 'Medium-Full', visual: 'Deep ruby with purple rim.', olfactory: 'Dark fruit, black cherry, herbs, spice.', gustatory: 'Warm and rounded, firm tannins, ripe fruit, Mediterranean.' };
    }
    if (r.includes('PUGLIA') || r.includes('PUGLIA')) {
      return { body: 'Medium-Full', visual: 'Deep ruby with garnet rim.', olfactory: 'Prune, black cherry, dried herbs, earth.', gustatory: 'Rounded and warm, soft tannins, ripe fruit, easy.' };
    }
    if (r.includes('VENETO')) {
      return { body: 'Medium', visual: 'Ruby with garnet reflections.', olfactory: 'Red fruit, cherry, spice, almond.', gustatory: 'Medium-bodied, balanced, fruity, smooth finish.' };
    }
    if (n.includes('lacrima') || v.includes('lacrima') || (r.includes('MARCHE') && s.includes('ROSSO'))) {
      return { body: 'Medium', visual: 'Bright ruby with violet rim and purple reflections.', olfactory: 'Violet, rose, blackberry, blueberry, pepper, distinctive floral lift.', gustatory: 'Soft and fragrant, gentle tannins, juicy fruit, floral, easy finish.' };
    }
    if (r.includes('MARCHE') && (n.includes('conero') || n.includes('montepulciano'))) {
      return { body: 'Medium-Full', visual: 'Deep ruby with garnet rim.', olfactory: 'Black cherry, plum, leather, tobacco, spice.', gustatory: 'Structured and warm, rounded tannins, dark fruit, savoury finish.' };
    }
    // Generic red
    return { body: 'Medium', visual: 'Ruby with garnet rim.', olfactory: 'Red and black fruit, spice, floral notes.', gustatory: 'Balanced structure, moderate tannins, fruity, pleasant finish.' };
  }

  // Rosé
  if (t.includes('ROSAT') || t.includes('ROSE') || s.includes('ROSE') || s.includes('ROSAT')) {
    return { body: 'Light-Medium', visual: 'Pale pink with salmon or copper reflections.', olfactory: 'Strawberry, raspberry, citrus, flowers, herbs.', gustatory: 'Fresh and crisp, delicate fruit, clean, refreshing finish.' };
  }

  // White wines
  if (t.includes('BIANCHI') || s.includes('BIANCO')) {
    if (n.includes('gavi') || n.includes('cortese') || v.includes('cortese')) {
      return { body: 'Light-Medium', visual: 'Pale straw with green reflections.', olfactory: 'Citrus, white flowers, almond, mineral.', gustatory: 'Crisp and clean, vibrant acidity, dry, mineral finish.' };
    }
    if (n.includes('vermentino') || v.includes('vermentino') || r.includes('SARDEGNA') || r.includes('LIGURIA')) {
      return { body: 'Light-Medium', visual: 'Straw yellow with green hints.', olfactory: 'Citrus, Mediterranean herbs, white flowers, saline.', gustatory: 'Fresh and savoury, good acidity, mineral, coastal.' };
    }
    if (n.includes('fiano') || v.includes('fiano') || n.includes('greco') || v.includes('greco')) {
      return { body: 'Medium', visual: 'Straw yellow with golden hints.', olfactory: 'Stone fruit, hazelnut, flowers, honey.', gustatory: 'Round and textured, ripe fruit, mineral, persistent.' };
    }
    if (n.includes('falanghina') || v.includes('falanghina')) {
      return { body: 'Light-Medium', visual: 'Pale straw with green rim.', olfactory: 'White peach, apple, flowers, herbs.', gustatory: 'Fresh and fruity, soft acidity, easy-drinking.' };
    }
    if (n.includes('soave') || n.includes('garganega') || v.includes('garganega')) {
      return { body: 'Light-Medium', visual: 'Pale straw with green reflections.', olfactory: 'Almond, white flowers, citrus, stone fruit.', gustatory: 'Light and crisp, delicate, almond finish.' };
    }
    if (n.includes('pinot grigio') || v.includes('pinot grigio') || v.includes('pinot gris')) {
      return { body: 'Light-Medium', visual: 'Straw with copper or pink hints.', olfactory: 'Pear, apple, white flowers, almond.', gustatory: 'Crisp and clean, light body, dry, refreshing.' };
    }
    if (n.includes('friulano') || v.includes('friulano') || v.includes('tocai')) {
      return { body: 'Medium', visual: 'Straw yellow with golden tinge.', olfactory: 'Yellow fruit, almond, herbs, mineral.', gustatory: 'Round and savoury, bitter almond, persistent.' };
    }
    if (n.includes('ribolla') || v.includes('ribolla')) {
      return { body: 'Light-Medium', visual: 'Pale straw, sometimes hazy.', olfactory: 'Citrus, white flowers, stone fruit, mineral.', gustatory: 'Lean and mineral, crisp acidity, long finish.' };
    }
    if (r.includes('ALTO ADIGE') || r.includes('TRENTINO')) {
      return { body: 'Light-Medium', visual: 'Pale straw with green reflections.', olfactory: 'Apple, pear, white flowers, mountain herbs.', gustatory: 'Crisp and clean, alpine freshness, mineral.' };
    }
    if (r.includes('VALLE D\'AOSTA') || r.includes("VALLE D'AOSTA")) {
      return { body: 'Light-Medium', visual: 'Pale straw with green rim.', olfactory: 'Citrus, flowers, herbs, mineral.', gustatory: 'Nervy and mineral, high altitude freshness.' };
    }
    // Generic white
    return { body: 'Light-Medium', visual: 'Straw yellow with green reflections.', olfactory: 'White flowers, citrus, stone fruit, fresh.', gustatory: 'Crisp and clean, balanced acidity, dry finish.' };
  }

  // Orange / skin-contact
  if (t.includes('ARANCIONE') || s.includes('ARANCIONE') || n.includes('orange') || n.includes('skin')) {
    return { body: 'Medium', visual: 'Amber or deep orange with copper rim.', olfactory: 'Dried fruit, orange peel, herbs, honey, nut.', gustatory: 'Textured and tannic, oxidative notes, complex, long.' };
  }

  // Fallback
  return { body: 'Medium', visual: 'Bright colour with good clarity.', olfactory: 'Fruit and floral notes with regional character.', gustatory: 'Balanced and drinkable with a clean finish.' };
}

function addTastingToWine(wine) {
  const template = getTemplates(
    wine.wine_type,
    wine.subcategory || wine.wine_subcategory,
    wine.region,
    wine.varietals,
    wine.wine_name
  );
  return {
    ...wine,
    tasting_notes: {
      visual: template.visual,
      olfactory: template.olfactory,
      gustatory: template.gustatory
    },
    body: template.body
  };
}

function main() {
  const json = fs.readFileSync(WINES_PATH, 'utf8');
  const data = JSON.parse(json);
  if (!Array.isArray(data.wines)) {
    console.error('Invalid wines.json: expected { wines: [] }');
    process.exit(1);
  }
  data.wines = data.wines.map(addTastingToWine);
  fs.writeFileSync(WINES_PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log('Updated', data.wines.length, 'wines with tasting_notes and body.');
}

main();
