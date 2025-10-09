/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it } from 'bun:test';
import { normalize } from './index.js';

describe('normalize', () => {
  it('should normalize addresses', () => {
    const fixtures = [
      [
        'BOULEVARD DU MARECHAL JEAN MARIE DE LATTRE DE TASSIGNY',
        'BD MAL J M DE LATTRE DE TASSIGNY',
      ],
      ['SENTIER DE LA CÔTE', 'SENTIER DE LA COTE'],
      [
        'SQUARE DES SOEURS DE SAINT VINCENT DE PAUL',
        'SQ SOEURS DE ST VINCENT DE PAUL',
      ],
      ['RUE LINO BORRINI DIT LINO VENTURA', 'RUE L BORRINI DIT LINO VENTURA'],
      [
        'RUE ETIENNE GEOFFROY DE SAINT HILAIRE',
        'RUE E GEOFFROY DE SAINT HILAIRE',
      ],
      [
        'RUE DU PRINCE FERDINAND DE BOURBON DES DEUX SICILES',
        'RUE P F DE BOURBON DEUX SICILES',
      ],
      [
        'RUE DU MARECHAL PHILIPPE DE HAUTECLOCQUE DIT LECLERC',
        'RUE MAL P DE H DIT LECLERC',
      ],
      [
        'RUE DU LIEUTENANT DE VAISSEAU JEAN DOMINIQUE ANDRIEUX',
        'RUE DU LTDV J DOMINIQUE ANDRIEUX',
      ],
      ['RUE DU GROUPE SCOLAIRE LOUIS BRETON', 'RUE DU GROU SCOLAIRE L BRETON'],
      [
        'RUE DU CORPS EXPEDITIONNAIRE FRANCAIS EN ITALIE 1943 1944',
        'RUE C E FR ITALIE 1943 1944',
      ],
      [
        'RUE DES FRERES MARC ET JEAN MARIE GAMON',
        'RUE DES FRERES M ET J M GAMON',
      ],
      ['TRAVERSE NOTRE DAME DE BON SECOURS', 'TRAVERSE ND DE BON SECOURS'],
      ['AVENUE GEORGES ET CLAUDE CAUSTIER', 'AV GEORGES ET CLAUDE CAUSTIER'],
      [
        'AVENUE DE LA DIVISION DU GENERAL LECLERC',
        'AV DE LA DIVISION DU GAL LECLERC',
      ],
      [
        "ALLÉE DE L'ABBAYE NOTRE DAME DU GRAND MARCHÉ",
        'ALL DE L ABBAYE ND DU GD MARCHE',
      ],
      [
        'ALLEE 1ER BATAILLON DU RGT DE BIGORRE FFI 1944 1945',
        'ALL 1ER BTN R B FFI 1944 1945',
      ],
      [
        'AGGLOMERATION DE VILLENEUVE D ENTRAUNES',
        'AGGL DE VILLENEUVE D ENTRAUNES',
      ],
      ['SENTIER DE LA RAVINE DES PONCEAUX', 'SENT DE LA RAVINE DES PONCEAUX'],
      [
        'SENTIER DE LA FONTAINE DU PETIT DAMIETTE',
        'SENT DE LA FONT DU PT DAMIETTE',
      ],
      ['RUE EMMANUEL D ASTIER DE LA VIGERIE', 'RUE E D ASTIER DE LA VIGERIE'],
      [
        'PLACE CHARLES DE GAULLE ET DE LA RESISTANCE',
        'PL C DE GAULLE DE LA RESISTANCE',
      ],
      [
        'ALLEE DES VILLAS DE LA GRANDE BASTIDE',
        'ALL DES VILLAS DE LA GDE BASTIDE',
      ],
      [
        'RUE L APPEL DU 18 JUIN DU GENERAL DE GAULLE',
        'RUE APPEL 18 JUIN GAL DE GAULLE',
      ],
      [
        'ANCIEN CHEMIN DE GRANGE DE PUZAIS AU SCEY',
        'ANC CHEM GRANGE PUZAIS AU SCEY',
      ],
      [
        'BOURG DE SAINT MICHEL L ECLUSE ET LEPARON',
        'BOUR ST MICHEL L ECLU ET LEPARON',
      ],
      [
        'CARREFOUR DU GENERAL JACQUES PARIS DE BOLLARDIERE',
        'CARR GAL J PARIS DE BOLLARDIERE',
      ],
      [
        'CHEMIN DE L EGLISE DE SAINT CHRISTOPHE',
        'CHEM DE L EGLI DE ST CHRISTOPHE',
      ],
      [
        'CARREFOUR JEAN DE LATTRE DE TASSIGNY',
        'CARR JEAN DE LATTRE DE TASSIGNY',
      ],
      [
        'CHEMIN DE LA FERME DES BOIS AU CHEMIN DES MOULINS',
        'CHEM FERM BOIS CHEM DES MOULINS',
      ],
      [
        'CHEMIN DE LA GRANDE RUE AU CHEMIN DES ROBERDES',
        'CHEM GDE RUE CHEM DES ROBERDES',
      ],
      [
        'CHEMIN DE TRAVERSE DE LA FORET DE SENART',
        'CHEM DE TRAV DE LA FOR DE SENART',
      ],
      [
        'CHEMIN DE VILLENEUVE SAINT GEORGES A LA GRANGE',
        'CHEM DE V ST GEORGES GRANGE',
      ],
      [
        'CHEMIN DEPARTEMENTAL 116 D ARPAJON A AUNEAU',
        'CHEM DEP 116 D ARPAJON A AUNEAU',
      ],
      [
        'CHEMIN DES DROITS DE L HOMME ET DE L ENFANT',
        'CHEM DROITS HOMME ET DE L ENFANT',
      ],
      ['CENTRE ADMINISTRATIF WALDECK L HUILIER', 'CTRE A WALDECK L HUILIER'],
      [
        'BOULEVARD SAINT JEAN BAPTISTE DE LA SALLE',
        'BD ST JEAN BAPTISTE DE LA SALLE',
      ],
      ['BOURG DE SAINT ETIENNE DES LANDES', 'BOURG DE ST ETIENNE DES LANDES'],
      ['BOURG SAINT JULIEN DES EGLANTIERS', 'BOURG ST JULIEN DES EGLANTIERS'],
      [
        'CARREFOUR DE L EUROPE PRIX NOBEL DE LA PAIX 2012',
        'CARR EUROPE PRIX NOBEL PAIX 2012',
      ],
      [
        'MONTEE DE L EGLISE SAINT PIERRE SAINT PAUL',
        'MONT DE L EGLI ST PIERRE ST PAUL',
      ],
      [
        'VOIE DE LA DECLARATION UNIVERSELLE DES DROITS DE L HOMME',
        'VOIE D UNIVERSELLE DROITS HOMME',
      ],
      [
        'RUE ALICE DOMON ET LÉONIE DUQUET, SŒUR ALICIA ET SŒUR LÉONIE',
        'RUE A D L D S A SOEUR LEONIE',
      ],
    ] as const;

    for (const [source, expected] of fixtures) {
      expect(normalize(source)).toBe(expected);
    }
  });

  it('should handle short addresses that do not need normalization', () => {
    expect(normalize('RUE COURTE')).toBe('RUE COURTE');
    expect(normalize('PLACE A')).toBe('PLACE A');
    expect(normalize('AVENUE B')).toBe('AVENUE B');
  });

  it('should handle custom max length parameter', () => {
    const longStreet = 'BOULEVARD DU MARECHAL JEAN MARIE DE LATTRE DE TASSIGNY';

    expect(normalize(longStreet, 20)).toBe('BD MAL J M L TASSIGNY');
    expect(normalize(longStreet, 15)).toBe('BD MAL J M L TASSIGNY');
    expect(normalize(longStreet, 50)).toBe(
      'BD DU MARECHAL JEAN MARIE DE LATTRE DE TASSIGNY',
    );
  });

  it('should handle very long addresses that trigger later normalization steps', () => {
    const veryLongAddress =
      'BOULEVARD DU GENERAL MARECHAL JEAN MARIE PIERRE AUGUSTE FERDINAND ALEXANDRE BENJAMIN CHARLES DOMINIQUE EMMANUEL FRANCOIS GEORGES HENRI JACQUES LAURENT MICHEL NICOLAS OLIVIER PHILIPPE ROBERT SEBASTIEN THOMAS VICTOR';

    const result = normalize(veryLongAddress, 20);

    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle addresses with mixed case and special characters', () => {
    expect(normalize("Rue de l'Église Saint-Pierre")).toBe(
      'RUE DE L EGLISE SAINT PIERRE',
    );
    expect(normalize('Avenue des Champs-Élysées')).toBe(
      'AVENUE DES CHAMPS ELYSEES',
    );
    expect(normalize('Boulevard Saint-Germain-des-Prés')).toBe(
      'BOULEVARD SAINT GERMAIN DES PRES',
    );
  });

  it('should handle addresses with newline characters', () => {
    expect(normalize('RUE DE LA\nPAIX')).toBe('RUE DE LA PAIX');
    expect(normalize('BOULEVARD\nDU MARECHAL\nJEAN MARIE')).toBe(
      'BOULEVARD DU MARECHAL JEAN MARIE',
    );
    expect(normalize('AVENUE\n\nDES CHAMPS')).toBe('AVENUE DES CHAMPS');
    expect(normalize('\nRUE DE LA LIBERTE\n')).toBe('RUE DE LA LIBERTE');
  });

  it('should handle addresses that need extensive shortening', () => {
    const extremelyLongAddress =
      'BOULEVARD DU TRES HONORABLE MONSIEUR LE MARECHAL JEAN MARIE PIERRE AUGUSTE FERDINAND ALEXANDRE BENJAMIN CHARLES DOMINIQUE EMMANUEL FRANCOIS GEORGES HENRI JACQUES LAURENT MICHEL NICOLAS OLIVIER PHILIPPE ROBERT SEBASTIEN THOMAS VICTOR DE LA GRANDE NATION DES DROITS DE L HOMME ET DU CITOYEN DE LA REPUBLIQUE FRANCAISE AU SOLEIL LEVANT SUR LA BELLE MONTAGNE DES SAINTS ET DES SAINTES';

    const result = normalize(extremelyLongAddress, 10);

    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle addresses that trigger article elimination', () => {
    const articleHeavyAddress =
      'RUE DE LA GRANDE MAISON DU ROI ET DE LA REINE DES ANGES ET DES SAINTS AU SOLEIL DE LA MONTAGNE';

    const result = normalize(articleHeavyAddress, 15);

    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });

  it('should preserve saint names when dealing with name abbreviations', () => {
    const saintAddress = 'RUE SAINT PHILIPPE MARIE JACQUES BERNARD';
    const result = normalize(saintAddress);

    expect(result).toContain('SAINT PHILIPPE');
  });

  it('should handle edge cases with empty and whitespace', () => {
    expect(normalize('   ').trim()).toBe('');
    expect(normalize('')).toBe('');
    expect(normalize('A')).toBe('A');
  });

  it('should handle numeric addresses', () => {
    expect(normalize('RUE 123 456')).toBe('RUE 123 456');
    expect(normalize('AVENUE 1944 1945')).toBe('AVENUE 1944 1945');
  });

  it('should handle addresses with particles (step 9)', () => {
    const addressWithParticles = 'RUE PIERRE DE LA FONTAINE ET MARIE DU BOIS';
    const result = normalize(addressWithParticles);

    expect(result).toBeDefined();
  });

  it('should return the original string when already within max length', () => {
    const shortAddress = 'RUE A';

    expect(normalize(shortAddress, 32)).toBe('RUE A');
  });

  it('should handle addresses that trigger early return in step 6', () => {
    const address = 'RUE SAINTE MARIE';
    const result = normalize(address, 15);

    expect(result).toBeDefined();
  });

  it('should handle addresses with special patterns that trigger selectShortWords with @', () => {
    const address = 'RUE A B C D E F G H I J K L M N O P Q R S T U V W X Y Z';
    const result = normalize(address, 5);

    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle single character input', () => {
    expect(normalize('A')).toBe('A');
    expect(normalize('1')).toBe('1');
  });

  it('should handle very short max length', () => {
    const result = normalize('BOULEVARD DU MARECHAL', 5);

    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle edge case normalization scenarios', () => {
    expect(normalize('AVENUE', 10)).toBe('AVENUE');
    expect(normalize('BOULEVARD AVENUE', 8)).toBeDefined();
    expect(normalize('RUE DE', 10)).toBe('RUE DE');
  });

  it('should benchmark normalization performance', () => {
    const fixtures = [
      'BOULEVARD DU MARECHAL JEAN MARIE DE LATTRE DE TASSIGNY',
      'SENTIER DE LA CÔTE',
      'SQUARE DES SOEURS DE SAINT VINCENT DE PAUL',
      'RUE LINO BORRINI DIT LINO VENTURA',
      'RUE ETIENNE GEOFFROY DE SAINT HILAIRE',
      'RUE DU PRINCE FERDINAND DE BOURBON DES DEUX SICILES',
      'RUE DU MARECHAL PHILIPPE DE HAUTECLOCQUE DIT LECLERC',
      'RUE DU LIEUTENANT DE VAISSEAU JEAN DOMINIQUE ANDRIEUX',
      'RUE DU GROUPE SCOLAIRE LOUIS BRETON',
      'RUE DU CORPS EXPEDITIONNAIRE FRANCAIS EN ITALIE 1943 1944',
      'RUE DES FRERES MARC ET JEAN MARIE GAMON',
      'TRAVERSE NOTRE DAME DE BON SECOURS',
      'AVENUE GEORGES ET CLAUDE CAUSTIER',
      'AVENUE DE LA DIVISION DU GENERAL LECLERC',
      "ALLÉE DE L'ABBAYE NOTRE DAME DU GRAND MARCHÉ",
      'ALLEE 1ER BATAILLON DU RGT DE BIGORRE FFI 1944 1945',
      'AGGLOMERATION DE VILLENEUVE D ENTRAUNES',
      'SENTIER DE LA RAVINE DES PONCEAUX',
      'SENTIER DE LA FONTAINE DU PETIT DAMIETTE',
      'RUE EMMANUEL D ASTIER DE LA VIGERIE',
      'PLACE CHARLES DE GAULLE ET DE LA RESISTANCE',
      'ALLEE DES VILLAS DE LA GRANDE BASTIDE',
      'RUE L APPEL DU 18 JUIN DU GENERAL DE GAULLE',
      'ANCIEN CHEMIN DE GRANGE DE PUZAIS AU SCEY',
      'BOURG DE SAINT MICHEL L ECLUSE ET LEPARON',
      'CARREFOUR DU GENERAL JACQUES PARIS DE BOLLARDIERE',
      'CHEMIN DE L EGLISE DE SAINT CHRISTOPHE',
      'CARREFOUR JEAN DE LATTRE DE TASSIGNY',
      'CHEMIN DE LA FERME DES BOIS AU CHEMIN DES MOULINS',
      'CHEMIN DE LA GRANDE RUE AU CHEMIN DES ROBERDES',
      'CHEMIN DE TRAVERSE DE LA FORET DE SENART',
      'CHEMIN DE VILLENEUVE SAINT GEORGES A LA GRANGE',
      'CHEMIN DEPARTEMENTAL 116 D ARPAJON A AUNEAU',
      'CHEMIN DES DROITS DE L HOMME ET DE L ENFANT',
      'CENTRE ADMINISTRATIF WALDECK L HUILIER',
      'BOULEVARD SAINT JEAN BAPTISTE DE LA SALLE',
      'BOURG DE SAINT ETIENNE DES LANDES',
      'BOURG SAINT JULIEN DES EGLANTIERS',
      'CARREFOUR DE L EUROPE PRIX NOBEL DE LA PAIX 2012',
      'MONTEE DE L EGLISE SAINT PIERRE SAINT PAUL',
      'VOIE DE LA DECLARATION UNIVERSELLE DES DROITS DE L HOMME',
      'RUE ALICE DOMON ET LÉONIE DUQUET, SŒUR ALICIA ET SŒUR LÉONIE',
    ];

    const startTime = performance.now();

    for (const address of fixtures) {
      normalize(address);
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const avgTime = totalTime / fixtures.length;

    console.log('Benchmark Results:');
    console.log(`- Processed ${fixtures.length} addresses`);
    console.log(`- Total time: ${totalTime.toFixed(2)}ms`);
    console.log(`- Average per operation: ${avgTime.toFixed(3)}ms`);

    expect(totalTime).toBeGreaterThan(0);
  });
});
