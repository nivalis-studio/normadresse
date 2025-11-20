/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { deburr } from 'es-toolkit/string';

const DEFAULT_MAX_LENGTH = 32;

type CsvRule = {
  etape: string;
  long: string;
  court: string;
  option: string;
};

const RULES_DATA: Array<CsvRule> = [
  { etape: '1', long: 'ALLEE ', court: 'all ', option: '' },
  { etape: '1', long: 'AVENUE ', court: 'av ', option: '' },
  { etape: '1', long: 'BOULEVARD ', court: 'bd ', option: '' },
  { etape: '1', long: 'CARREFOUR ', court: 'carr ', option: '' },
  { etape: '1', long: 'CENTRE COMMERCIAL ', court: 'ccal @ ', option: '' },
  { etape: '1', long: 'IMMEUBLE(S|) ', court: 'imm ', option: '' },
  { etape: '1', long: 'IMPASSE ', court: 'imp ', option: '' },
  { etape: '1', long: 'LIEU DIT ', court: 'ld @ ', option: '' },
  { etape: '1', long: 'LOTISSEMENT ', court: 'lot ', option: '' },
  { etape: '1', long: 'PASSAGE ', court: 'pas ', option: '' },
  { etape: '1', long: 'PLACE ', court: 'pl ', option: '' },
  { etape: '1', long: 'RESIDENCE(S|) ', court: 'res ', option: '' },
  { etape: '1', long: 'ROND POINT ', court: 'rpt @ ', option: '' },
  { etape: '1', long: 'ROUTE ', court: 'rte ', option: '' },
  { etape: '1', long: 'SQUARE ', court: 'sq ', option: '' },
  { etape: '1', long: 'VILLAGE ', court: 'vlge ', option: '' },
  { etape: '1', long: 'ZONE INDUSTRIELLE ', court: 'zi @ ', option: '' },
  {
    etape: '1.0',
    long: 'ZONE D ACTIVITE ECONOMIQUE ',
    court: 'zae @ @ @ ',
    option: '',
  },
  {
    etape: '1.0',
    long: 'ZONE ACTIVITE ECONOMIQUE ',
    court: 'zae @ @ ',
    option: '',
  },
  { etape: '1', long: 'ZONE D ACTIVITE ', court: 'za @ @ ', option: '' },
  { etape: '1', long: 'ZONE ACTIVITE ', court: 'za @ ', option: '' },
  {
    etape: '1',
    long: 'ZONE AMENAGEMENT CONCERTE ',
    court: 'zac @ @ ',
    option: '',
  },
  {
    etape: '1',
    long: 'ZONE D AMENAGEMENT CONCERTE ',
    court: 'zac @ @ @ ',
    option: '',
  },
  {
    etape: '1',
    long: 'ZONE D AMENAGEMENT DIFFERE ',
    court: 'zad @ @ @ ',
    option: '',
  },
  {
    etape: '1',
    long: 'ZONE AMENAGEMENT DIFFERE ',
    court: 'zad @ @ ',
    option: '',
  },
  {
    etape: '1',
    long: 'ZONE A URBANISER EN PRIORITE ',
    court: 'zup @ @ @ @ ',
    option: '',
  },
  {
    etape: '1.0',
    long: 'ZONE ARTISANALE ',
    court: 'zone artisanale ',
    option: '',
  },
  { etape: '1.0', long: 'LA PIERRE ', court: 'LA pierre ', option: '' },
  {
    etape: '1.0',
    long: ' DE LA FONTAINE( PROLONGEE|$)',
    court: ' de la fontaine\\g<1>',
    option: '',
  },
  {
    etape: '2.0',
    long: 'SAINT JEAN BAPTISTE',
    court: 'st JEAN BAPTISTE',
    option: '',
  },
  { etape: '2.0', long: 'DE L AIGLETTE', court: 'AIGLETTE @ @', option: '' },
  { etape: '2.0', long: 'SAINTE CROIX', court: 'SAINTE croix', option: '' },
  { etape: '2.0', long: 'TOUR CARREE', court: 'tour CARREE', option: '' },
  { etape: '2.0', long: 'PONT SAINT', court: 'pont SAINT', option: '' },
  {
    etape: '2.0',
    long: 'SAINT PIERRE SAINT',
    court: 'st pierre st',
    option: '',
  },
  {
    etape: '2.0',
    long: 'ANTOINE DE SAINT',
    court: 'ANTOINE DE st',
    option: '',
  },
  {
    etape: '2.0',
    long: 'DECLARATION UNIVERSELLE DES DROITS',
    court: 'DECLARATION universelle DES droits',
    option: '',
  },
  { etape: '2.0', long: 'LA CLAIRE', court: 'LA claire', option: '' },
  { etape: '2.0', long: 'LA TOUR', court: 'LA tour', option: '' },
  { etape: '2', long: 'ADJUDANT', court: 'adj', option: '' },
  { etape: '2', long: 'ASPIRANT', court: 'asp', option: '' },
  { etape: '2', long: 'CARDINAL', court: 'cdl', option: '' },
  { etape: '2', long: 'COMMANDANT', court: 'cdt', option: '' },
  { etape: '2', long: 'DIRECT(EUR|ION)', court: 'dir', option: '' },
  { etape: '2', long: 'DOCTEUR', court: 'dr', option: '' },
  { etape: '2', long: 'EVEQUE', court: 'evq', option: '' },
  { etape: '2', long: 'FUSILIERS', court: 'fus', option: '' },
  {
    etape: '2.0',
    long: 'GOUVERNEUR GENERAL',
    court: 'gouv GENERAL',
    option: '',
  },
  { etape: '2', long: 'GENERAL', court: 'gal', option: '' },
  { etape: '2', long: 'INGENIEUR', court: 'ing', option: '' },
  { etape: '2', long: 'INSPECTEUR', court: 'insp', option: '' },
  { etape: '2', long: 'LIEUTENANT DE VAISSEAU', court: 'ltdv @ @', option: '' },
  { etape: '2', long: 'LIEUTENANT', court: 'lt', option: '' },
  { etape: '2', long: 'COLONEL', court: 'cnl', option: '' },
  { etape: '2', long: 'MAITRE', court: 'me', option: '' },
  { etape: '2', long: 'MARECHAL', court: 'mal', option: '' },
  { etape: '2', long: 'MEDECIN', court: 'med', option: '' },
  { etape: '2', long: 'MONSEIGNEUR', court: 'mgr', option: '' },
  { etape: '2', long: 'NOTRE DAME', court: 'nd @', option: '' },
  { etape: '2', long: 'PASTEUR', court: 'past', option: '' },
  { etape: '2', long: 'PREFET', court: 'pref', option: '' },
  { etape: '2', long: 'PRESIDENT', court: 'pdt', option: '' },
  { etape: '2', long: 'PROFESSEUR', court: 'pr', option: '' },
  { etape: '2', long: 'RECTEUR', court: 'rect', option: '' },
  { etape: '2', long: 'SERGENT', court: 'sgt', option: '' },
  { etape: '2', long: 'VEUVE', court: 'vve', option: '' },
  {
    etape: '3',
    long: '(AMANIEU|ARTHUR|ALAIN|ARNOULD|ALIX|AGNES|ANATOLE|AUGUSTE|AUGUSTIN|AMBROISE|AMADEUS|ALBERT|AGATHE|ANGELIQUE|ANNE|ANDRE|ANDREE|ANTOINE|ANTOINETTE|ANTONIO|ADRIEN|ALEXANDRE|ALEXANDRA|ALPHONSE|ALFRED|ARISTIDE|ACHILLE)',
    court: 'a',
    option: '',
  },
  {
    etape: '3',
    long: '(BAPTISTE|BERNARD|BENJAMIN|BERTRAND)',
    court: 'b',
    option: '',
  },
  {
    etape: '3',
    long: '(CLEMENT|CMLEMENCE|CAMILLE|CESAR|CATHERINE|CORENTIN|CLAIRE|CLOTILDE|CHARLES|CHARLOTTE|CLAUDE|CHRISTIANE|CHRISTOPHE|CHRISTIAN|CHRISTINE|CONSTANTIN|CYRILLE)',
    court: 'c',
    option: '',
  },
  {
    etape: '3',
    long: '(DENIS|DOMINIQUE|DANIEL|DANIELLE|DANIELE|DIEUDONNE)',
    court: 'd',
    option: '',
  },
  {
    etape: '3',
    long: '(EDME|EDOUARD|EDMOND|EDMONDE|ETIENNE|EMILE|EMMANUEL|EMMANUELLE|ERNEST|EUGENE|ELISABETH)',
    court: 'e',
    option: '',
  },
  {
    etape: '3',
    long: '(FITZGERALD|FELIX|FOLCO|FRANCOIS|FRANCOISE|FRANCIS|FRANKLIN|FERDINAND|FERNAND|FREDERIC|FREDERIQUE|FULGENCE)',
    court: 'f',
    option: '',
  },
  {
    etape: '3',
    long: '(GUY|GUILLIBERT|GABRIEL|GERMAIN|GERMAINE|GEOFFROY|GEORGES|GEORGETTE|GASPARD|GASTON|GUSTAVE|GILLES|GILBERT|GILBERTE|GENEVIEVE|GUENIEVRE|GERARD|GUILLAUME|GUILLEMETTE)',
    court: 'g',
    option: '',
  },
  {
    etape: '3',
    long: '(HIPPOLYTE|HECTOR|HENRI|HERCULE|HONORE|HUBERT)',
    court: 'h',
    option: '',
  },
  { etape: '3', long: '(IRENE)', court: 'i', option: '' },
  {
    etape: '3',
    long: '(JEAN|JEANNE|JEANINE|JANINE|JOHANNES|JOHN|JACQUES|JOSEPH|JOSEPHE|JOSEPHINE|JULIEN|JACQUELINE|JULES)',
    court: 'j',
    option: '',
  },
  { etape: '3', long: '(KONRAD)', court: 'k', option: '' },
  {
    etape: '3',
    long: '(LAZARE|LAUREN(T|CE)|LOUIS(|E)|LUC(|IE|IEN|IENNE)|LUDOVIC|LUDVIG|LUDWIG|LINO|LEON)',
    court: 'l',
    option: '',
  },
  {
    etape: '3',
    long: '(MARC|MARIUS|MANON|MAXIME|MAXIMILIEN|MARGUERITE|MARIE|MADELEINE|MAURICE|MARCEL|MARCELLE|MATHIEU|MELCHIOR|MARTIN|MONIQUE|MELANIE|MICHEL|MICHELLE|MARCELLIN)',
    court: 'm',
    option: '',
  },
  {
    etape: '3',
    long: '(NICOLAS|NAPOLEON|NELSON|NOEL)',
    court: 'n',
    option: '',
  },
  { etape: '3', long: '(OCTAVIEN|OSCAR)', court: 'o', option: '' },
  {
    etape: '3',
    long: '(PASCAL|PASCALE|PATRICE|PAUL|PIERRE|PHILIPPE|PHILIBERT|PERRINE|PROSPER)',
    court: 'p',
    option: '',
  },
  {
    etape: '3',
    long: '(RAOUL|ROBERT|RENE|RAYMOND|REGIS|RICHARD|ROLAND|ROGER|ROLLET)',
    court: 'r',
    option: '',
  },
  {
    etape: '3',
    long: '(SOPHIE|SYLVESTRE|SEBASTIEN|STANISLAS)',
    court: 's',
    option: '',
  },
  {
    etape: '3',
    long: '(TELESPHORE|THERESE|THEODOR|THEODORE|THEOPHILE|TOUSSAINT)',
    court: 't',
    option: '',
  },
  { etape: '3', long: '(VINCENT)', court: 'v', option: '' },
  { etape: '3', long: '(YVES|YVONNE)', court: 'y', option: '' },
  { etape: '4', long: 'AERODROME', court: 'aer', option: '' },
  { etape: '4', long: 'AEROGARE', court: 'aerg', option: '' },
  { etape: '4', long: 'AERONAUTIQUE', court: 'aern', option: '' },
  { etape: '4', long: 'AEROPORT', court: 'aerp', option: '' },
  { etape: '4', long: 'AGENCE', court: 'agce', option: '' },
  { etape: '4', long: 'AGRICOLE', court: 'agric', option: '' },
  { etape: '4', long: 'ANCIEN(NEMENT|)', court: 'anc', option: '' },
  { etape: '4', long: 'APPARTEMENT(S|)', court: 'app', option: '' },
  { etape: '4', long: 'ARMEMENT', court: 'armt', option: '' },
  { etape: '4', long: 'ARRONDISSEMENT', court: 'arr', option: '' },
  { etape: '4', long: 'ASSOCIATION', court: 'assoc', option: '' },
  { etape: '4', long: 'ASSURANCE', court: 'assur', option: '' },
  { etape: '4', long: 'ATELIER', court: 'at', option: '' },
  { etape: '4', long: 'BARAQUEMENT', court: 'brq', option: '' },
  { etape: '4', long: 'BAS(SE|SES|)', court: 'BAS', option: '' },
  { etape: '4', long: 'BATAILLON(S|)', court: 'BTN', option: '' },
  { etape: '4', long: 'BATIMENT(S|)', court: 'BAT', option: '' },
  { etape: '4', long: 'BIS', court: 'B', option: '' },
  { etape: '4', long: 'BOITE POSTALE', court: 'BP @', option: '' },
  { etape: '4', long: 'CABINET', court: 'CAB', option: '' },
  { etape: '4', long: 'CANTON(AL|)', court: 'CANT', option: '' },
  { etape: '4', long: 'CASE POSTALE', court: 'CP', option: '' },
  { etape: '4', long: 'CHAMBRE', court: 'CHBR', option: '' },
  { etape: '4', long: 'CITADELLE', court: 'CTD', option: '' },
  { etape: '4', long: 'COLLEGE', court: 'COLL', option: '' },
  { etape: '4', long: 'COLONIE', court: 'COLO', option: '' },
  { etape: '4', long: 'COMITE', court: 'CTE', option: '' },
  { etape: '4', long: 'COMMERCIAL', court: 'CIAL', option: '' },
  { etape: '4', long: 'COMMUNA(L|UX)', court: 'COM', option: '' },
  { etape: '4', long: 'COMPAGNIE', court: 'CIE', option: '' },
  { etape: '4', long: 'COMPAGNON(S|)', court: 'COMP', option: '' },
  { etape: '4', long: 'COOPERATIVE', court: 'COOP', option: '' },
  { etape: '4', long: 'COURSE SPECIALE', court: 'CS @', option: '' },
  { etape: '4', long: 'CROIX', court: 'CRX', option: '' },
  { etape: '4', long: 'DELEGATION', court: 'DELEG', option: '' },
  { etape: '4', long: 'DEPARTEMENTA(L|UX)', court: 'DEP', option: '' },
  { etape: '4', long: 'DIVISION', court: 'DIV', option: '' },
  { etape: '4', long: 'ECONOMI(E|QUE)', court: 'ECO', option: '' },
  { etape: '4', long: 'ECRIVAIN(S|)', court: 'ECRIV', option: '' },
  { etape: '4', long: 'ENSEIGNEMENT', court: 'ENST', option: '' },
  { etape: '4', long: 'ENSEMBLE', court: 'ENS', option: '' },
  { etape: '4', long: 'ENTREE(S|)', court: 'ENT', option: '' },
  { etape: '4', long: 'ENTREPRISE', court: 'ENTR', option: '' },
  { etape: '4', long: 'EPOU(SE|X)', court: 'EP', option: '' },
  { etape: '4', long: 'ETABLISSEMENT(S|)', court: 'ETS', option: '' },
  { etape: '4', long: 'ETAGE', court: 'ETG', option: '' },
  { etape: '4', long: 'ETAT MAJOR', court: 'EM @', option: '' },
  { etape: '4', long: 'FACULTE', court: 'FAC', option: '' },
  { etape: '4', long: 'FORE(STIER|T)', court: 'FOR', option: '' },
  { etape: '4', long: 'FRANCAIS(E|)', court: 'FR', option: '' },
  { etape: '4', long: 'GENDARMERIE', court: 'GEND', option: '' },
  { etape: '4', long: 'GOUVERNE(MENTAL|UR)', court: 'GOUV', option: '' },
  { etape: '4', long: 'GRANDES', court: 'GDES', option: '' },
  { etape: '4', long: 'GRANDS', court: 'GDS', option: '' },
  { etape: '4', long: 'GRANDE', court: 'GDE', option: '' },
  { etape: '4', long: 'GRAND', court: 'GD', option: '' },
  { etape: '4', long: 'HAUTES', court: 'HTES', option: '' },
  { etape: '4', long: 'HAUTS', court: 'HTS', option: '' },
  { etape: '4', long: 'HAUTE', court: 'HTE', option: '' },
  { etape: '4', long: 'HAUT', court: 'HT', option: '' },
  { etape: '4', long: 'HOPITA(L|UX)', court: 'HOP', option: '' },
  { etape: '4', long: 'HOSPI(CE|TALIER)', court: 'HOSP', option: '' },
  { etape: '4', long: 'HOTEL', court: 'HOT', option: '' },
  { etape: '4', long: 'INFANTERIE', court: 'INFANT', option: '' },
  { etape: '4', long: 'INFERIEUR(E|)', court: 'INF', option: '' },
  { etape: '4', long: 'INSTITUT', court: 'INST', option: '' },
  { etape: '4', long: 'INTERNATIONAL(E|)', court: 'INTERN', option: '' },
  { etape: '4', long: 'LABORATOIRE', court: 'LABO', option: '' },
  { etape: '2', long: 'MADAME', court: 'MME', option: '' },
  { etape: '2', long: 'MADEMOISELLE', court: 'MLLE', option: '' },
  { etape: '4', long: 'MAGASIN', court: 'MAG', option: '' },
  { etape: '4', long: 'MAISON', court: 'MAIS', option: '' },
  { etape: '4', long: 'MARITIME', court: 'MAR', option: '' },
  { etape: '-4.0', long: 'MARTYR(S|)', court: 'MYR', option: '' },
  { etape: '4', long: 'MEDICAL', court: 'MED', option: '' },
  { etape: '4', long: 'MESDAMES', court: 'MMES', option: '' },
  { etape: '4', long: 'MESDEMOISELLES', court: 'MLLES', option: '' },
  { etape: '4', long: 'MESSIEURS', court: 'MM', option: '' },
  { etape: '4', long: 'MILITAIRE', court: 'MIL', option: '' },
  { etape: '4', long: 'MINISTERE', court: 'MIN', option: '' },
  { etape: '4', long: 'MONSIEUR', court: 'M', option: '' },
  { etape: '4', long: 'MUNICIPAL', court: 'MUN', option: '' },
  { etape: '4', long: 'MUTUEL', court: 'MUT', option: '' },
  { etape: '4', long: 'NATIONAL', court: 'NAL', option: '' },
  { etape: '4', long: 'NOUVE(AU|LLE)', court: 'NOUV', option: '' },
  { etape: '4', long: 'OBSERVATOIRE', court: 'OBS', option: '' },
  { etape: '4', long: 'PETIT', court: 'PT', option: '' },
  { etape: '4', long: 'PETITE', court: 'PTE', option: '' },
  { etape: '4.0', long: 'PETITES', court: 'PTE', option: '' },
  { etape: '4', long: 'PETITES', court: 'PTES', option: '' },
  { etape: '4.0', long: 'PETITS', court: 'PT', option: '' },
  { etape: '4', long: 'PETITS', court: 'PTS', option: '' },
  { etape: '4', long: 'POLICE', court: 'POL', option: '' },
  { etape: '4', long: 'PREFECTURE', court: 'PREF', option: '' },
  { etape: '4', long: 'PROFESSIONNEL(LE|)', court: 'PROF', option: '' },
  { etape: '0', long: 'PROLONGE(E|)', court: 'PROL', option: '' },
  { etape: '4', long: 'PROPRIETE', court: 'PROP', option: '' },
  { etape: '4', long: 'QUATER', court: 'Q', option: '' },
  { etape: '4', long: 'QUINQUIES', court: 'CAB', option: '' },
  { etape: '4', long: 'REGIMENT', court: 'RGT', option: '' },
  { etape: '4', long: 'REGION(AL|)', court: 'REG', option: '' },
  { etape: '4', long: 'REPUBLIQUE', court: 'REP', option: '' },
  { etape: '4', long: 'RESTAURANT', court: 'REST', option: '' },
  { etape: '4', long: 'SANATORIUM', court: 'SANA', option: '' },
  { etape: '4', long: 'SERVICE', court: 'SCE', option: '' },
  { etape: '4', long: 'SOCIETE', court: 'SOC', option: '' },
  { etape: '4', long: 'SOUS COUVERT', court: 'SC @', option: '' },
  { etape: '4', long: 'SOUS PREFECTURE', court: 'SPREF @', option: '' },
  { etape: '4', long: 'SOUS PREFET', court: 'SPREF @', option: '' },
  { etape: '4', long: 'SUPERIEUR(E|)', court: 'SUP', option: '' },
  { etape: '4', long: 'SYNDICAT', court: 'SYND', option: '' },
  { etape: '4', long: 'TECHNI(CIEN|QUE)', court: 'TECH', option: '' },
  { etape: '4', long: 'TER', court: 'T', option: '' },
  { etape: '4', long: 'TRI SERVICE ARRIVEE', court: 'TSA @ @', option: '' },
  { etape: '4', long: 'TUNNEL', court: 'TUN', option: '' },
  { etape: '4', long: 'UNIVERSITAIRE', court: 'UNVT', option: '' },
  { etape: '4', long: 'UNIVERSITE', court: 'UNIV', option: '' },
  { etape: '4', long: 'VELODROME', court: 'VELOD', option: '' },
  { etape: '4', long: 'VIEILLE(S|)', court: 'VIEL', option: '' },
  { etape: '4', long: 'VIEUX', court: 'VX', option: '' },
  { etape: '5.0', long: 'CENTRE cial', court: 'ccal @', option: '' },
  { etape: '5', long: 'CENTRE', court: 'CTRE', option: '' },
  { etape: '5', long: 'ABBAYE', court: 'ABBA', option: '' },
  { etape: '5', long: 'AG(G|)LOMERATION ', court: 'AGGL', option: '' },
  { etape: '5', long: 'AIRES ', court: 'AIRE', option: '' },
  {
    etape: '5',
    long: 'ANCIEN(NES|NE|S|) (CHEMIN|CHEMINS|ROUTE|ROUTES)',
    court: 'ANCI \\g<2>',
    option: '',
  },
  { etape: '5', long: 'ARCADE(S|)', court: 'ARCA', option: '' },
  { etape: '5', long: 'AUTOROUTE', court: 'AUTO', option: '' },
  { etape: '5', long: 'BARRIERE(S|)', court: 'BARR', option: '' },
  { etape: '5', long: 'BAS CHEMIN', court: 'BAS', option: '' },
  { etape: '5', long: 'BASTI(DE|ON)', court: 'BAST', option: '' },
  { etape: '5', long: 'BEGUINAGE(S|)', court: 'BEGU', option: '' },
  { etape: '5', long: 'BERGE(S|)', court: 'BERG', option: '' },
  { etape: '5', long: 'BOUCLE', court: 'BOUC', option: '' },
  { etape: '5', long: 'BOURG', court: 'BOUR', option: '' },
  { etape: '5', long: 'BUTTE', court: 'BUTT', option: '' },
  { etape: '5', long: 'CAMP(AGNE|ING)', court: 'CAMP', option: '' },
  {
    etape: '5',
    long: 'CARR(E|EAU|EFFOUR|IERE(S|))',
    court: 'CARR',
    option: '',
  },
  { etape: '5', long: 'CASTEL', court: 'CAST', option: '' },
  { etape: '5', long: 'CAVEE', court: 'CAVE', option: '' },
  { etape: '5', long: 'CENTRAL', court: 'CENT', option: '' },
  { etape: '5', long: 'CHALET', court: 'CHAL', option: '' },
  { etape: '5', long: 'CHAPELLE', court: 'CHAP', option: '' },
  { etape: '5', long: 'CHARMILLE', court: 'CHAR', option: '' },
  { etape: '5', long: 'CHATEAU', court: 'CHAT', option: '' },
  { etape: '5', long: 'CHAUSSEE(S|)', court: 'CHAU', option: '' },
  {
    etape: '5',
    long: 'CHEMIN( VICINAL|S VICINAUX|EMENT(S|))',
    court: 'CHEM \\g<1>',
    option: '',
  },
  { etape: '5', long: 'CHEMIN', court: 'CHEM', option: '' },
  { etape: '5', long: 'CITES', court: 'CITE', option: '' },
  { etape: '5', long: 'CLOITRE', court: 'CLOI', option: '' },
  { etape: '5', long: 'COLLINE(S|)', court: 'COLL', option: '' },
  { etape: '5', long: 'CONTOUR', court: 'CONT', option: '' },
  { etape: '5', long: 'CORNICHE(S|)', court: 'CORN', option: '' },
  { etape: '5', long: 'COTEAU', court: 'COTE', option: '' },
  { etape: '5', long: 'COTTAGE(S|)', court: 'COTT', option: '' },
  { etape: '5', long: 'COURS', court: 'COUR', option: '' },
  { etape: '5', long: 'DARSE', court: 'DARS', option: '' },
  { etape: '5', long: 'DEGRE(S|)', court: 'DEGRE', option: '' },
  { etape: '5', long: 'DESCENTE(S|)', court: 'DESC', option: '' },
  { etape: '5', long: 'DIGUE(S|)', court: 'DIGU', option: '' },
  { etape: '5', long: 'DOMAINE(S|)', court: 'DOMA', option: '' },
  { etape: '5', long: 'ECLUSE(S|)', court: 'ECLU', option: '' },
  { etape: '5', long: 'EGLISE', court: 'EGLI', option: '' },
  { etape: '5', long: 'ENCEINTE', court: 'ENCE', option: '' },
  { etape: '5', long: 'ENCL(AVE|OS)', court: 'ENCL', option: '' },
  { etape: '5', long: 'ESCALIER(S|)', court: 'ESCA', option: '' },
  { etape: '5', long: 'ESPACE(S|)', court: 'ESPA', option: '' },
  { etape: '5', long: 'ESPLANADE(S|)', court: 'ESPL', option: '' },
  { etape: '5', long: 'ETANG', court: 'ETAN', option: '' },
  { etape: '5', long: 'FAUBOURG', court: 'FAUB', option: '' },
  { etape: '5', long: 'FERME(S|)', court: 'FERM', option: '' },
  { etape: '5', long: 'FONTAINE', court: 'FONT', option: '' },
  { etape: '5', long: 'FORUM', court: 'FORU', option: '' },
  { etape: '5', long: 'FOSSE(S|)', court: 'FOSS', option: '' },
  { etape: '5', long: 'FOYER', court: 'FOYE', option: '' },
  { etape: '5', long: 'GALERIE(S|)', court: 'GALE', option: '' },
  { etape: '5', long: 'GARENNE', court: 'GARE', option: '' },
  {
    etape: '5',
    long: 'GRAND(E|ES|) (BOULEVARD|ENSEMBLE|RUE)(S|)',
    court: 'GRAN \\g<1>\\g<2>',
    option: '',
  },
  { etape: '5', long: 'GRILLE', court: 'GRIL', option: '' },
  { etape: '5', long: 'GRIMPETTE', court: 'GRIM', option: '' },
  { etape: '5', long: 'GROUPE(MENT|S|)', court: 'GROU', option: '' },
  { etape: '5', long: 'HALLE(S|)', court: 'HALL', option: '' },
  { etape: '5', long: 'HAMEAU(X|)', court: 'HAME', option: '' },
  { etape: '5', long: 'HIPPODROME', court: 'HIPP', option: '' },
  { etape: '5', long: 'IMPASSES', court: 'IMPA', option: '' },
  { etape: '5', long: 'JARDIN(S|)', court: 'JARD', option: '' },
  { etape: '5', long: 'JETEE(S)', court: 'JETE', option: '' },
  { etape: '5', long: 'LEVEE', court: 'LEVE', option: '' },
  { etape: '5', long: 'LOTISSEMENTS', court: 'LOTI', option: '' },
  { etape: '5', long: 'LOTISSEMENT', court: 'LOT', option: '' },
  { etape: '5', long: 'MAISON FORESTIERE', court: 'MAIS @', option: '' },
  { etape: '5', long: 'MANOIR', court: 'MANO', option: '' },
  { etape: '5', long: 'MARCHE(S|)', court: 'MARC', option: '' },
  { etape: '5', long: 'METRO', court: 'METR', option: '' },
  { etape: '5', long: 'MONTEE(S|)', court: 'MONT', option: '' },
  { etape: '5', long: 'MOULIN(S|)', court: 'MOUL', option: '' },
  { etape: '5', long: 'MUSEE', court: 'MUSE', option: '' },
  { etape: '5', long: 'NOUVELLE ROUTE', court: 'NOUV RTE', option: '' },
  { etape: '5', long: 'PALAIS', court: 'PALA', option: '' },
  { etape: '5', long: 'PARCS', court: 'PARC', option: '' },
  { etape: '5', long: 'PARKING', court: 'PARK', option: '' },
  { etape: '5', long: 'PARVIS', court: 'PARV', option: '' },
  {
    etape: '5',
    long: 'PASS(AGE A NIVEAU|E(S|)|ERELLE(S|))',
    court: 'PASS',
    option: '',
  },
  { etape: '5', long: 'PATIO', court: 'PATI', option: '' },
  { etape: '5', long: 'PAVILLON(S|)', court: 'PAVI', option: '' },
  { etape: '5', long: 'PERI(PHERIQUE|STYLE)', court: 'PERI', option: '' },
  {
    etape: '5',
    long: 'PETIT(E|ES|) (CHEMIN|ALLEE|IMPASSE|ROUTE|RUE)(S|)',
    court: 'PETI \\g<1>\\g<2>',
    option: '',
  },
  { etape: '5', long: 'PLACIS', court: 'PLAC', option: '' },
  { etape: '5', long: 'PLAGE(S|)', court: 'PLAG', option: '' },
  { etape: '5', long: 'PLAINE', court: 'PLAI', option: '' },
  { etape: '5', long: 'PLATEAU(X|)', court: 'PLAT', option: '' },
  { etape: '5', long: 'POINTE', court: 'POIN', option: '' },
  { etape: '5', long: 'PONTS', court: 'PONT', option: '' },
  { etape: '5', long: 'PORT(E|IQUE(S|))', court: 'PORT', option: '' },
  { etape: '5', long: 'POTERNE', court: 'POTE', option: '' },
  { etape: '5', long: 'POURTOUR', court: 'POUR', option: '' },
  { etape: '5', long: 'PRESQU ILE', court: 'PRES', option: '' },
  { etape: '5', long: 'PROMENADE', court: 'PROM', option: '' },
  { etape: '5', long: 'QUARTIER', court: 'QUAR', option: '' },
  { etape: '5', long: 'RACCOURCI', court: 'RACC', option: '' },
  { etape: '5', long: 'RAIDILLON', court: 'RAID', option: '' },
  { etape: '5', long: 'RAMPE', court: 'RAMP', option: '' },
  { etape: '5', long: 'REMPART', court: 'REMP', option: '' },
  { etape: '5.0', long: 'RESIDENCE', court: 'RES', option: '' },
  { etape: '5', long: 'RESIDENCE(S|)', court: 'RESI', option: '' },
  { etape: '5', long: 'ROCADE', court: 'ROCA', option: '' },
  { etape: '5', long: 'ROQUET', court: 'ROQU', option: '' },
  { etape: '5', long: 'ROTONDE', court: 'ROTO', option: '' },
  { etape: '5', long: 'ROUTES', court: 'ROUT', option: '' },
  { etape: '5', long: 'RUELLE(S|)', court: 'RUEL', option: '' },
  { etape: '5', long: 'SENT(E|ES|IER|IERS)', court: 'SENT', option: '' },
  { etape: '5', long: 'STADE', court: 'STAD', option: '' },
  { etape: '5', long: 'STATION', court: 'STAT', option: '' },
  { etape: '0', long: 'TERRE PLEIN', court: 'TERR @', option: '' },
  { etape: '5', long: 'TERR(AIN|ASSE(S|))', court: 'TERR', option: '' },
  { etape: '5', long: 'TERTRE(S|)', court: 'TERT', option: '' },
  { etape: '5', long: 'TRAVERSE', court: 'TRAV', option: '' },
  { etape: '5', long: 'VALL(EE|ON)', court: 'VALL', option: '' },
  { etape: '5', long: 'VENELLE(S|)', court: 'VENE', option: '' },
  { etape: '5', long: 'VIEILLE ROUTE', court: 'VIEI', option: '' },
  { etape: '5', long: 'VIEUX CHEMIN', court: 'VIEU', option: '' },
  { etape: '5', long: 'VILLA(GES|S|)', court: 'VILL', option: '' },
  { etape: '5', long: 'VOIE COMMUNALE ', court: 'VOIE C ', option: '' },
  { etape: '5', long: 'VOIES', court: 'VOIE', option: '' },
  { etape: '6', long: ' SAINTES ', court: ' STES ', option: '' },
  { etape: '6', long: ' SAINTS ', court: ' STS ', option: '' },
  { etape: '6', long: ' SAINTE ', court: ' STE ', option: '' },
  { etape: '6', long: ' SAINT ', court: ' ST ', option: '' },
  { etape: '7.0', long: ' JUILLET ', court: ' juil ', option: '' },
  { etape: '7.0', long: ' SEPTEMBRE ', court: ' sep ', option: '' },
  { etape: '7.0', long: ' OCTOBRE ', court: ' oct ', option: '' },
  { etape: '7.0', long: ' NOVEMBRE ', court: ' nov ', option: '' },
  { etape: '7.0', long: ' DECEMBRE ', court: ' dec ', option: '' },
  { etape: '0', long: ' PROLONGE(E|)$', court: ' PROL', option: '' },
  { etape: '0', long: ' INFERIEUR(E|)$', court: ' INF', option: '' },
  { etape: '1.5', long: '^CENTRE', court: 'CTRE', option: '' },
  { etape: '9', long: ' L (HUILIER)', court: ' l \\g<1>', option: '' },
  {
    etape: '9',
    long: '([a-z]) DE LA (BARRE|BEDOYERE|BORDERIE|BOULINIERE|BOURDONNAIS|BRIFFE|BROSSE|BRUYERE|BULLY|CELLE|CHAIZE|CLOCHETERIE|CLYTE|COCHINIERE|COLOMBIERE|CONDAMINE|DEULE|DROME|FAYETTE|FERRE|FERRIERE|FORCE|FOU|FOUCHARDIERE|FRESNAYE|FUTAYE|GONTRIE|GORCE|GRAVIERE|GUERCHE|GUERONNIERE|HALLE|HAYE|HIRE|HONTAN|HOURTIQUE|HUERTA|MADIE|MARCK|MENNAIS|METHERIE|METTRIE|MOISSONNIERE|MORTEAU|MORVONNAIS|MOTHE|MOTTE|NOE|PEROUSE|PLATIERE|POMMERAYE|PORREE|PRADELLE|PROVOTE|QUINTINIE|ROBRIE|ROCHEFOUCAULD|ROCHEFOUCAULT|ROCHEJAQUELEIN|ROQUE|ROSE|ROVERE|SALLE|SORINIERE|TAILHEDE|TAILLE|TIBERGERIE|TOUCHE|TOURFONDUE|TREILLE|TREMBLAYE|TREMOILLE|VAISSIERE|VALLEE|VALLIERE|VARENDE|VAULX|VERNE|VIEUVILLE|VILLE|VILLEHERVE|VILLEMARQUE|VILLETTE|ZOUCH)',
    court: '\\g<1> de la \\g<2>',
    option: '',
  },
  {
    etape: '9',
    long: ' DE LA (BILLARDIERE|BOLLARDIERE|BOISSIERE|CHAPELLE|CHARRIERE|CHETARDIE|CONTRIE|COTARDIERE|CROIX|DROUERIE|GONZEE|GRAVIERES|HUARDIERE|JOSSERIE|LARGERE|MALLERIE|METTRIE|MERLIERE|MEURTHE|MOISSONNIERE|NOE|ROGERIE|SALLE|TOUR|VALETTE|VIGERIE)',
    court: ' de la \\g<1>',
    option: '',
  },
  {
    etape: '9',
    long: '([a-z]) DE L (AIGLE|ECLUSE|ESTOILE|HOSPITAL|ISLE|OYE)',
    court: '\\g<1> de l \\g<2>',
    option: '',
  },
  {
    etape: '9',
    long: '([a-z]|COMTE|COMTESSE|DUCHE|LATTRE) DE (BADE|BADERON|BAERENFELS|BAERZE|BAHEZRE|BAIF|BAILLEUL|BAILLON|BALANDA|BAMEVILLE|BANNES|BAR|BARANTE|BARBE|BARBIER|BARY|BASQUIAT|BASTEROT|BAUDRE|BAUFFREMONT|BAUMONT|BAVIERE|BAYARD|BAZVALLAN|BEARN|BEAUBOURG|BEAUCE|BEAUFFREMEZ|BEAUFORT|BEAUHARNAIS|BEAUJEU|BEAULIEU|BEAUMANOIR|BEAUMARCHAIS|BEAUMONT|BEAUNE|BEAUPRE|BEAUREGARD|BEAUREPAIRE|BEAUSOBRE|BEAUVAIS|BEAUVAU|BEAUVIGNAC|BEAUVILLE|BEAUVOIR|BEHAGUE|BEINS|BEJARRY|BELAY|BELLECOMBE|BELLEVILLE|BELLINGLISE|BELLONNET|BELSUNCE|BENAY|BEOST|BERAILH|BERANGER|BERGERAC|BERNARD|BERNARDY|BERNIES|BERNIN|BERNIS|BERNUY|BERRI|BERRY|BERTALOT|BERTHIER|BERTIN|BESNERAY|BETHENCOURT|BETHUNE|BETTIGNIES|BETZ|BEURNOUVILLE|BIDEAU|BIMARD|BISEFRANC|BLAGNY|BLAINVILLE|BLAISON|BLANC|BLANCHEFORT|BLARRU|BLEGNY|BLOIS|BOISANGER|BOISROBERT|BOISSIERE|BOISSIEU|BOISSON|BOLOGNE|BONCOURT|BONFORT|BONNEFON|BONNEGARDE|BONNEGENS|BOPPARD|BORDA|BORDEAUX|BORDEU|BORN|BORNIER|BORTOLI|BOSCHERE|BOUC|BOUCHEMAN|BOUGAINVILLE|BOUILLAS|BOUILLON|BOULAY|BOULOGNE|BOURBON|BOURDEILLES|BOURGOGNE|BOURGUEIL|BOURNAZEL|BOUTHEON|BOUTTEVILLE|BOVIS|BOYER|BRACIEUX|BRANCAS|BRANTOME|BREDA|BRETAGNE|BRETENNIERE|BRICOURT|BRIE|BRIENNE|BRIEY|BRION|BRISSAC|BRISSON|BROCA|BROGLIE|BROSSE|BROSSES|BROYES|BRUCOURT|BRUN|BRY|BUEIL|BUFFON|BURES|BUSSEUIL|BUTTET|BUXEUIL|BUXY|BUYER|CABESTANY|CABROL|CADENET|CAILLAVET|CAMARET|CAMBIAIRE|CAMBO|CAMPAIGNO|CAMPET|CAMPION|CAMPREDON|CAPELE|CARBONNIERES|CARCARADEC|CARDAILLAC|CARNAGET|CARNE|CASABIANCA|CASSAGNE|CASTANET|CASTILLE|CASTILLON|CASTRO|CAUS|CELLE|CERISAY|CERNAY|CERTAINES|CERVANTES|CESSAC|CESSOLE|CHABERT|CHABOT|CHALON|CHALUS|CHAMBES|CHAMBLY|CHAMPAGNE|CHAMPAIGNE|CHAMPDIVERS|CHAMPEVILLE|CHAMPROND|CHANDENEUX|CHANTAL|CHARANCE|CHARDIN|CHARDONNET|CHARRIN|CHASTEL|CHATEAUBRIAND|CHATEAUNEUF|CHATELIER|CHATELLUS|CHATILLON|CHAULHAC|CHAULHIAC|CHAUVIGNY|CHAUVIN|CHAZELLES|CHAZERAT|CHEFDEBIEN|CHELLES|CHENIER|CHOISEUL|CHOLET|CIREY|CLAIRAMBAULT|CLAIRVAUX|CLERMONT|CLERY|CLEVES|CLINCHAMP|CLOSMADEUC|COATANLEM|COETLAGAT|COHORN|COIGNARD|COLLERYE|COLOMBIES|COLS|COMBLES|COMBRET|COMMINES|COMMINGES|COMMYNES|CONDE|CONDILLAC|CONINCK|CONNAYE|COPPET|CORAL|CORAS|CORBERON|CORBIE|CORBIERE|CORDEMOY|CORMONTAIGNE|CORNOUAILLE|COTTE|COUBERTIN|COUCY|COUDUN|COUETUS|COULOMB|COURCY|COURTENAY|COURTOUX|COURVOISIER|COUX|CRABOSSE|CRAON|CRESNE|CRESSIA|CROCY|CROUSAZ|CROUY|CUERS|CUEVAS|CUMONT|DANGEAU|DERVAL|DIE|DIETRICH|DIEU|DION|DOMANOVA|DOMBASLE|DON|DORMANS|DOUAI|DOUE|DREUX|DURBOIS|DURFORT|DURNES|FALGUIERE|FALLA|FALLOUX|FAUCIGNY|FAVIERES|FAYE|FELICE|FENELON|FERRE|FITTE|FLANDRE|FLERS|FLORANS|FLORETTE|FLORIAN|FOE|FOIGNY|FOIX|FONDEVILLE|FONSCOLOMBE|FONSEQUE|FONTARCE|FONTENELLE|FONTMICHEL|FOOR|FORAS|FORBIN|FOREZ|FORTIA|FOSSA|FOUCAUD|FOUCAULD|FOUCAULT|FOUGY|FOULON|FOURNIVAL|FRANCE|FRANCHEVILLE|FRANQUEVILLE|FREMINVILLE|FRESQUET|FREYCINET|FROIDOUR|FRONTENAC|FRONZE|FROUVILLE|FUNES|GAIL|GALARD|GANAY|GANNES|GARIDEL|GARLANDE|GARRIGUES|GASPARIN|GASPERI|GASSION|GAUCOURT|GAULLE|GAVARDY|GAVRE|GAYRARD|GAZANYOLA|GEIGER|GENAS|GENEVE|GENNES|GERDE|GERES|GERVILLE|GESLIN|GEYTER|GIBON|GIFFA|GINGINS|GIRARD|GIRARDIER|GIRARDIN|GIRODET|GISORS|GLEYZE|GODEWAERSVELDE|GOHR|GONCOURT|GONDI|GONDY|GONZAGUE|GORRIS|GORSSE|GOURDON|GOURGUES|GOURMONT|GOURNAY|GOUX|GOUY|GRACIA|GRAILLY|GRANDMAISON|GRASSE|GRESSOT|GREZILLAC|GRIBALDY|GROUCHY|GROUX|GUEBRIANT|GUELDRE|GUERCHEVILLE|GUERIN|GUERLANDE|GUERLINS|GUETHEM|GUIGNARD|GUIGNE|GUILHEM|GUILLOCHE|GUIRAMAND|GUISE|HARCOURT|HARGUES|HARISTEGUY|HAUTECLOCQUE|HAYNIN|HENNOT|HENO|HEREDIA|HEU|HOGUES|HONGRIE|JABRUN|JAMES|JAVENE|JOIE|JOIGNY|JOINVILLE|JOLY|JOUVENEL|JOUY|JUBECOURT|JUIGNE|JUR|JUSSIEU|KERALLAIN|KERARDEN|KERGOLAY|KERGOMARD|KERGORLAY|KERMADEC|KEROUAL|KEROUALLAN|KERSAINT|KERVEGUEN|KERVILER|KNYFF|KOCK|LABAT|LABAUME|LABERE|LACARRE|LACEPEDE|LACLOS|LADIME|LADONCHAMPS|LAFFEMAS|LAGARRIGUE|LAIGUE|LAISNE|LAIT|LALAING|LALANDE|LAMAGDELAINE|LAMARCK|LAMENNAIS|LAMER|LAMIC|LAMONTA|LAMOTHE|LANCIVAL|LANGHEAC|LANGLE|LANNOY|LAPLACE|LAPRADE|LAROCHE|LASSALLE|LASSERVE|LASSUS|LASTEYRIE|LATHENAY|LATOUCHE|LAUNAY|LAURENS|LAUZUN|LAVAL|LAVARDIN|LAVAUR|LAVERGNE|LAVIGNE|LAVOISIER|LEOBARDY|LEPINAY|LEPINEY|LESCURE|LESSEPS|LESTONNAC|LETIN|LEVARE|LEVESVILLE|LEVIS|LEZARDIERE|LICE|LIEGE|LIGNIERES|LINA|LINGENDES|LINIERS|LION|LIONNE|LISSORGUES|LLUCIA|LONGPRE|LORRAINE|LORRIS|LOUIS|LOUVAIN|LOUVRES|LUBERSAC|LUGNY|LUNA|LUNE|LUSSAC|LUXEMBOURG|LUZARCHES|LYON|LYONNE|MABLY|MACHAULT|MACHECOUL|MAGNEVILLE|MAGNIENVILLE|MAGNITOT|MAI|MAILLE|MAILLY|MAINVILLE|MAISONNEUVE|MAISTRE|MALARET|MALARTIC|MALESTROIT|MALEVILLE|MALMAINS|MANDELOT|MANDERSCHEID|MANGOU|MANSENCAL|MARCA|MARCE|MARCEAU|MAREAU|MAREUIL|MARIGNY|MARILLAC|MARIN|MARIVAUX|MARLY|MARMIER|MARSANGY|MARTEL|MARTHE|MARTI|MARTIMPREY|MARTIN|MARTRES|MARVILLE|MASCAREIGNAS|MASCARON|MASSY|MATHAREL|MAUDUIT|MAUNY|MAUPEOU|MAUPERTUIS|MAUROY|MAUSSAC|MAY|MAYTIE|MEDICIS|MELESSE|MELLON|MELUN|MENOU|MERAT|MERIC|MERY|MESMES|METZ|MEULAN|MEUNG|MEYERE|MEZIERES|MICHELS|MIGNON|MIRABEAU|MIRAVAL|MIRIBEL|MIRMAN|MOELAN|MOIVRE|MOLAY|MONACHIS|MONACO|MONAIX|MONDRAGON|MONFREID|MONLUC|MONPLANET|MONTAIGU|MONTALEMBERT|MONTALENT|MONTALIVET|MONTBRAY|MONTCALM|MONTEBISE|MONTEIL|MONTERA|MONTEREAU|MONTESPAN|MONTESQUIEU|MONTESQUIOU|MONTFAUCON|MONTFAVET|MONTFORT|MONTFREID|MONTGOLFIER|MONTGOMMERY|MONTI|MONTIGNY|MONTIJO|MONTLAUR|MONTLUISANT|MONTPELLIER|MONTREJEAU|MONTREUIL|MONTRON|MONTS|MORAES|MORANGIES|MOREY|MORTAGNE|MORTAIN|MORVILLIERS|MOUCHY|MOUNET|MUIZON|MUN|MUSSET|MUTIGNY|MUYSSART|NADAL|NANGIS|NANSOUTY|NARZAC|NASSE|NAUTONNIER|NAVARRE|NAVERY|NEGRO|NEHOU|NERVO|NEUBOURG|NEUFVILLE|NEURE|NEUVILLE|NEVERS|NEYMAN|NEZOT|NICOLAY|NOAILLES|NOGUER|NOLE|NOLHAC|NOROY|PAGAN|PAGANIS|PALADINES|PALASOL|PALAYS|PALISSY|PALLAS|PANGE|PARCEVAUX|PARDAILLAN|PARIS|PAROY|PAUL|PAYNS|PEGUILHAN|PEIGNE|PEIRESC|PENTHIEVRE|PERETTI|PERIGNON|PERSAN|PESQUIDOUX|PEYRE|PEYRONNET|PIERREBUFFIERE|PINGON|PINS|PINTEVILLE|PIOLENC|PISAN|PISSELEU|PLANET|PLANTAVIT|PLUVINEL|POILLY|POIX|POLIGNAC|POLLINCHOVE|POMAIROLS|POMMEREU|POMMERY|PONCHER|PONS|PONSAY|PONT|PONTEVES|PONTHIEU|PORCARO|PORTUGAL|POSSEL|POUTRINCOURT|PRESLES|PRESSENCE|PRIE|PRIMAUGUET|PROVENCE|PROVINS|PUYBUSQUE|PUYRAVAULT|QUAY|QUELEN|QUERHOENT|RAINCOURT|RAIS|RAMEL|RANCONNET|RANCONVAL|RANCY|RATHSAMHAUSEN|RAVETON|RAYNAL|RAZILLY|REAUMUR|REFUGE|REGIS|REGNIER|RELY|RENAUD|RENEVILLE|RESSEGUIER|REYNIES|RICHEMONT|RICULPHE|RIDDER|RILLE|RIOUFFE|RIVERY|ROBERT|ROBERVAL|ROBESPIERRE|ROCHAMBEAU|ROCHEBRUNE|ROCHEFORT|ROCHETAILLEE|ROCQUIGNY|RODAY|RODEMACK|ROHAN|ROMAIN|ROMAN|ROMAS|ROME|RONCEVAUX|RONSARD|ROQUEFIXADE|ROSIERES|ROSIMBOS|ROSMADEC|ROSNAY|ROSNY|ROSSILLON|ROTHSCHILD|ROUBAIX|ROUJOUX|ROUVILLE|ROUVRES|ROUX|ROZ|ROZET|RUAT|RUTTE|SADE|SAHUQUE|SAIGE|SAILLY|SAISSAC|SALES|SALIGNE|SALLES|SALVANDY|SALVE|SAONE|SARDAC|SARO|SAULX|SAVARY|SAVEUSE|SAVIGNAC|SAVOIE|SAVONNIERE|SAXE|SAYMOND|SECONDAT|SEGLA|SEGOGNE|SEGUR|SENECTERRE|SERENT|SEROUX|SERRANT|SERRES|SERS|SERVIERES|SEVIGNE|SEYSSEL|SEZE|SIBAS|SIBOUNE|SIGOYER|SILHON|SIVRY|SMET|SOBIRATS|SOLAGES|SOLAND|SOLLIER|SOREAU|SOUHY|SOULTRAIT|SOUVILLE|SULLY|SURVILLE|SUZANNET|TAFFIN|TALLEYRAND|TALVAS|TANLAY|TARNOWSKY|TASSIGNY|TATZO|TAULNAY|TEIL|TERLINE|TERSOM|TESSAN|THAIX|THANEY|THEOBALD|THOLOZAN|THOR|THORIGNY|THOUARS|TILHA|TINGUY|TOCQUEVILLE|TORRES|TOULOUSE|TOUR|TOURCOING|TOURNES|TOURNON|TOURTIER|TOURTOULON|TOURVILLE|TRANCHERE|TRETS|TREVIERS|TRIE|TRIGON|TRIQUERVILLE|TROYES|TURCKHEIM|TURENNE|TYARD|VACQUEROLLES|VAILLY|VALERNES|VALOIS|VALON|VARZY|VASSAL|VAUBAN|VAUCANSON|VAUCANSSON|VAUDEMONT|VAUGELAS|VAUVENARGUES|VAUX|VAYRAC|VENDOME|VENOGE|VENTADORN|VENTADOUR|VERGENNES|VERNEJOUL|VERNOLS|VERNON|VERRAZANO|VEYSSIERE|VEZELAY|VEZINS|VIC|VICHY|VICQ|VIDEAU|VIENNE|VIERVILLE|VIGENERE|VIGNET|VIGNY|VIGUIER|VILLAGES|VILLARS|VILLELE|VILLENEUVE|VILLERS|VILLETAIN|VILLIERS|VILMORIN|VINCI|VIRELLE|VITRY|VITTEL|VITTON|VIVIE|VIVONNE|VIZCAYA|VLAMINCK|VOGUE|VOISIN|VOLONTAT|VOLVIRE|WALLE|WANGEN|WENDEL|WERVE|WESTHUS|WESTPHALEN|WETT|WEY|WILS|WISSANT|WORE)',
    court: '\\g<1> de \\g<2>',
    option: '',
  },
  {
    etape: '9',
    long: '([A-Z]) DU (BARRE|BARRY|BELLAY|BOS|BUIS|BUYS|CERCEAU|CHALARD|CHANET|CLAUD|COETLOSQUET|COUCHANT|DRESNAY|FOU|FOUILLOUX|GARD|GARREAU|GAST|GAY|GUA|GUESCLIN|HAURE|LUART|LUXEMBOURG|LYS|MAYNE|MEUNIER|PASQUIER|PLET|QUELENNEC|QUESNAY|REY|ROOY|ROZIER|SAUSSAY|TEMPLE|TERRAIL|TILLET|TREUIL|TROU)',
    court: '\\g<1> du \\g<2>',
    option: '',
  },
  {
    etape: '9',
    long: '([A-Z]) D (ABBANS|ACIGNE|ADHEMAR|AFFIS|AGAY|AGESCY|AGHONNE|AGOSTIN|AGRAIN|AGREVE|AGUESSEAU|AIGNEAUX|AIGREVILLE|AILLY|AIRE|ALBARADE|ALBI|ALBRET|ALEMBERT|ALESME|ALEXIS|ALFARO|ALLARD|ALLONNES|ALSACE|AMADE|AMBOISE|AMOU|AMOURS|ANDELI|ANDOINS|ANDOUINS|ANDUZE|ANGELY|ANGENNES|ANGERS|ANGLADE|ANGLETERRE|ANGOULEME|ANJOU|ANTHES|ANTOINE|AOUR|APREMONT|AQUITAINE|ARABIE|ARAGON|ARAU|ARBAUD|ARBAUMONT|ARBRISSEL|ARC|ARCHES|ARCHIAC|ARCIS|ARCON|ARGENSON|ARGENT|ARGENTRE|ARISTE|ARLANDES|ARMONVILLE|ARNAUD|ARRADON|ARRAS|ARSONVAL|ARTAGNAN|ARTOIS|ASNIERES|ASSEZAT|ASTIER|ASTORG|ASTROS|AUBERMESNIL|AUBIGNE|AUBIGNY|AUBUSSON|AULAN|AULON|AUMALE|AUNETTE|AUREILHE|AURENSAN|AURIAC|AUTON|AUTRICHE|AUVERGNE|AUXERRE|AUXY|AVENCHES|AVERTON|AVIGNON|AVY|AYEN|AZY|ECOSSE|EICHTHAL|ELVA|ENNERY|ENTRAGUES|EPINAY|ERARD|ERCHIEU|ESCLEVIN|ESCOUBLEAU|ESPAGNE|ESPARBES|ESPIC|ESPINAY|ESTAING|ESTAMPES|ESTE|ESTEVE|ESTEVES|ESTIENNE|ESTRADES|EU|HALLUIN|HARCOURT|HARDIVILLERS|HARLEVILLE|HASTREL|HAUTPOUL|HELBINGUE|HENRY|HERMY|HERS|HONDT|HONORINE|HOSTEL|HOTEL|HOURTE|HUART|HUMIERES|IGNY|ILLINS|IMBERT|INTIGNANO|OLIVET|OLIVIER|OMS|OR|ORBAIS|ORIOLA|ORLEANS|ORNANO|OURVILLE|OYHENART|URCLE|URFE|URSULE|USSEL|UZES|WHITE|Y)',
    court: '\\g<1> d \\g<2>',
    option: '',
  },
  {
    etape: '9',
    long: '([A-Z]) LE (BACQUER|BAIL|BALP|BALPE|BARBU|BARON|BARZIC|BAS|BASTARD|BAUD|BAUX|BAYON|BEC|BELLEC|BELLER|BELLOUR|BERD|BERRE|BIHAN|BIS|BITTER|BLANC|BLEU|BLOA|BOBINNEC|BOMIN|BON|BONNIEC|BOUCHER|BOUDEC|BOUHART|BOULCH|BOURBLANC|BOURDELLES|BOURDIEC|BOURGES|BOURGO|BOURHIS|BRAS|BRAZ|BRET|BRETON|BRIS|BRIX|BROZEC|BRUN|BRUSQ|BUCHERON|CALVE|CALVEZ|CAM|CANADIEN|CAPITAINE|CARDONNEL|CARRER|CERF|CHATELIER|CHAUVE|CHEVALLIER|CHEVOIR|CIEUX|CLANCHE|CLERC|CLERT|CLEZIO|COCQ|COIN|COMTE|CONFESSEUR|COQ|COR|CORBUSIER|CORDIER|CORNEC|COROLLER|CORRE|COULTEUX|COURT|COUTALLER|COZ|CROS|CUN|CUNFF|DAIN|DAMANY|DANOIS|DAUX|DEAN|DEBONNAIRE|DERRIEN|DEUT|DROGO|DROGOFF|DU|DUC|DUFF|FALHER|FEVRE|FLANCHEC|FLEM|FLOCH|FLOHIC|FOLL|FOUILLE|FRANC|FRANCAIS|FRAPPER|FUR|GAC|GAL|GALL|GALLEU|GALLO|GARDONNEL|GENTIL|GENTILE|GOFF|GOFFIC|GOIC|GORREC|GOULVEN|GRAND|GROS|GUELLAUT|GUEN|GUENNEC|GUIFF|GUIL|GUILLOUX|GUINER|GUYADER|HALPERT|HAMP|HEN|HENAFF|HENANFF|HERPEUX|HIR|HO|JAUDET|JEAN|JEANNE|JEUNE|LABOUREUR|LAE|LAN|LAY|LEON|LIN|LONG|LORRAIN|LOUARN|LOUP|LUC|MAISTRE|MAITRE|MANCQ|MANER|MAO|MAOUT|MARESQUIER|MARIE|MASSON|MASTIN|MEIGNEN|MENN|MENTEC|MEUR|MEUT|MEZO|MIGNOT|MOAL|MOALIGOU|MOENIC|MOIGN|MOIGNE|MOING|MOLGAT|MONNIER|MONTAGNER|MORE|MOULEC|MOULT|MOYNE|MUET|NAIN|NAOURES|NAVIGATEUR|NESTOUR|NOTRE|NOUAIL|NY|PAIRE|PAN|PATRE|PAYEN|PAYS|PECQ|PELLETIER|PENNEC|PENVEN|PERE|PEVEDIC|PIC|PICHON|PIEUX|PITRE|POGAMP|POLOZEC|POT|POULAIN|POULENNEC|POVREMOYNE|PRINCE|QUEINEC|QUELLEC|QUINTREC|RICOLAIS|ROCHOIS|ROI|ROUGE|ROUSSEAU|ROUX|ROY|ROYER|SAMEDY|SENECHAL|SIDANER|SODEC|STANGUENNEC|STRADIC|STRAT|SUAVE|TALLEC|TAROUILLY|TELLIER|TEMERAIRE|TENNEUR|TESTU|TEXIER|THEULE|THIEC|TOQUIN|TRIVIDIC|TULLIER|TUTOUR|VAGUERES|VAILLANT|VAU|VEILLE|VENERABLE|VERRIER|VEZOUET|VIOL)',
    court: '\\g<1> le \\g<2>',
    option: '',
  },
  { etape: '9', long: ' DE LATTRE ', court: ' de LATTRE ', option: '' },
];
type CompiledRule = {
  long: string;
  short: string;
  pattern?: RegExp;
};

type Rules = {
  [key: number]: Array<CompiledRule>;
};

let cachedRules: Rules | null = null;

const SPECIAL_CHARS_PATTERN = /[^A-Z0-9 ]/g;
const MULTIPLE_SPACES_PATTERN = /\s{2,}/g;
const UPPERCASE_ARTICLES_PATTERN =
  / (?:LE|LA|LES|AU|AUX|DE|DU|DES|[DAL]|ET|SUR|EN) /;
const LOWERCASE_ARTICLES_PATTERN =
  / (?:le|la|les|au|aux|de|du|des|[dal]|et|sur) /;

const compileRules = (): Rules => {
  if (cachedRules) {
    return cachedRules;
  }

  const rules = RULES_DATA.reduce<Rules>((acc: Rules, rule: CsvRule) => {
    const step = Number.parseFloat(rule.etape);
    const newRules = acc;

    newRules[step] ??= [];

    let pattern: RegExp | undefined;

    if (step === 1) {
      try {
        pattern = new RegExp(rule.long, 'g');
      } catch {
        // Fallback for invalid regex patterns
        pattern = new RegExp(
          rule.long.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          'g',
        );
      }
    }

    newRules[step].push({
      long: rule.long,
      short: rule.court.replaceAll(/\\g<(\d+)>/g, '$$$1'),
      pattern,
    });

    return newRules;
  }, {});

  cachedRules = rules;

  return rules;
};

const selectShortWords = (
  input: string,
  output: string,
  maxLength: number,
): string => {
  const long = input.split(' ');
  const short = output.split(' ');

  for (let i = short.length - 1; i >= 0; i--) {
    if (short[i] === '@') {
      if (i > 0) {
        // biome-ignore lint/style/noNonNullAssertion: checked earlier
        long[i - 1] = short[i - 1]!;
      }

      long.splice(i, 1);
      short.splice(i, 1);
    }
  }

  let next = '';

  for (let i = 1; i < short.length; ++i) {
    next = [
      ...short.slice(0, i).filter(Boolean),
      ...long.slice(i).filter(Boolean),
    ].join(' ');

    if (next.length <= maxLength) {
      break;
    }
  }

  return next;
};

const preprocessInput = (originalInput: string): string => {
  return deburr(originalInput)
    .toUpperCase()
    .replaceAll(SPECIAL_CHARS_PATTERN, ' ')
    .replaceAll(MULTIPLE_SPACES_PATTERN, ' ')
    .trim();
};

const applyRoadTypeAbbreviations = (
  currentInput: string,
  currentOutput: string,
  maxLength: number,
): string => {
  const rules = compileRules();
  let output = currentOutput;

  for (const rule of rules[1] ?? []) {
    if (rule.pattern) {
      output = output.replace(rule.pattern, rule.short);
    } else {
      output = output.replace(new RegExp(rule.long), rule.short);
    }
  }

  return selectShortWords(currentInput, output, maxLength);
};

const applyTitleAbbreviations = (
  currentInput: string,
  currentOutput: string,
  maxLength: number,
): string => {
  const rules = compileRules();
  let output = currentOutput;

  // 2 - abréviation des titres militaires, religieux et civils
  for (let step = 0; step < 2; step++) {
    for (const rule of rules[2] ?? []) {
      output = output.replace(new RegExp(` ${rule.long} `), ` ${rule.short} `);
    }
  }

  return selectShortWords(currentInput, output, maxLength);
};

const applyGeneralAbbreviations = (
  currentInput: string,
  currentOutput: string,
  maxLength: number,
): string => {
  const rules = compileRules();
  let output = currentOutput;

  // 4 - abréviations générales
  for (let step = 0; step < 3; step++) {
    for (const rule of rules[4] ?? []) {
      output = output
        .replace(
          new RegExp(`(^| )${rule.long} `),
          ` ${rule.short.toLowerCase()} `,
        )
        .trim();
    }
  }

  return selectShortWords(currentInput, output, maxLength);
};

const applyRoadTypeAbbreviationsBis = (
  currentInput: string,
  currentOutput: string,
  maxLength: number,
): string => {
  const rules = compileRules();
  let output = currentOutput;

  // 5 - abréviation type de voies
  for (let step = 0; step < 2; step++) {
    for (const rule of rules[5] ?? []) {
      output = output.replace(
        new RegExp(` ${rule.long.trim()} `),
        ` ${rule.short.trim().toLowerCase()} `,
      );
    }

    for (const rule of rules[1] ?? []) {
      output = output.replace(
        new RegExp(` ${rule.long.trim()} `),
        ` ${rule.short.trim().toLowerCase()} `,
      );
    }
  }

  return selectShortWords(currentInput, output, maxLength);
};

const applyFirstNameAbbreviations = (
  currentInput: string,
  currentOutput: string,
  maxLength: number,
): string => {
  const rules = compileRules();
  let output = currentOutput;

  // 3 - abréviations prénoms sauf pour ST prénoms
  const words = output.split(' ');

  for (let i = 1; i < words.length - 1; i++) {
    const word = words[i];

    if (!words[i - 1]?.startsWith('SAINT')) {
      for (const rule of rules[3] ?? []) {
        // biome-ignore lint/style/noNonNullAssertion: checked earlier
        if (new RegExp(rule.long).test(word!)) {
          words[i] = rule.short.toLowerCase();
        }
      }
    }

    output = words.join(' ');
  }

  return selectShortWords(currentInput, output, maxLength);
};

const applySaintAbbreviations = (
  currentInput: string,
  currentOutput: string,
  maxLength: number,
): string => {
  const rules = compileRules();
  let output = currentOutput;

  // 6 - abréviation saint/sainte et prolonge(e)/inférieur(e)
  for (let step = 0; step < 2; step++) {
    for (const rule of rules[6] ?? []) {
      output = output.replace(new RegExp(rule.long), rule.short.toLowerCase());
    }
  }

  return selectShortWords(currentInput, output, maxLength);
};

const applyRoadTypeBeginning = (
  currentInput: string,
  currentOutput: string,
  maxLength: number,
): string => {
  const rules = compileRules();
  let output = currentOutput;

  // 5bis - type de voie en début...
  for (const rule of rules[5] ?? []) {
    output = output.replace(
      new RegExp(`^${rule.long.trim()} `),
      `${rule.short.trim().toLowerCase()} `,
    );
  }

  return selectShortWords(currentInput, output, maxLength);
};

const applyParticleReplacement = (currentOutput: string): string => {
  const rules = compileRules();
  let output = currentOutput;

  // 9 - remplacement des particules des noms propres pour ne pas les supprimer
  for (const rule of rules[9] ?? []) {
    output = output.replace(new RegExp(rule.long), rule.short);
  }

  return output;
};

const removeUppercaseArticles = (
  currentOutput: string,
  maxLength: number,
): string => {
  let output = currentOutput;

  // 10 - élimination des articles
  for (let step = 0; step < 6; step++) {
    output = output.replace(UPPERCASE_ARTICLES_PATTERN, ' ');

    if (output.length <= maxLength) {
      return output;
    }
  }

  return output;
};

const applyResidualAbbreviations = (
  currentOutput: string,
  maxLength: number,
): string => {
  let output = currentOutput;

  // 11 - abréviations résiduelle
  const words = output.split(' ');

  for (let i = 1; i < words.length - 1; ++i) {
    const word = words[i];

    if (
      word &&
      word === word.toUpperCase() &&
      word.length > 1 &&
      // biome-ignore lint/style/noNonNullAssertion: can't be null
      word.codePointAt(0)! >= 'A'.codePointAt(0)!
    ) {
      // biome-ignore lint/style/noNonNullAssertion: number of chars is greater than 1
      words[i] = word[0]!;

      output = words.join(' ');

      if (output.length <= maxLength) {
        return output;
      }
    }
  }

  return output;
};

const removeLowercaseArticles = (
  currentOutput: string,
  maxLength: number,
): string => {
  let output = currentOutput;

  // 12 - élimination des articles
  for (let step = 0; step < 4; step++) {
    output = output.replace(LOWERCASE_ARTICLES_PATTERN, ' ');

    if (output.length <= maxLength) {
      return output;
    }
  }

  return output;
};

const applyInitialSteps = (
  input: string,
  maxLength: number,
): { output: string; currentInput: string } => {
  let output = input;
  let currentInput = input;

  // Step 1: Road type abbreviations
  output = applyRoadTypeAbbreviations(currentInput, output, maxLength);

  if (output.length <= maxLength) {
    return { output, currentInput };
  }

  currentInput = output;

  // Step 2: Title abbreviations
  output = applyTitleAbbreviations(currentInput, output, maxLength);

  if (output.length <= maxLength) {
    return { output, currentInput };
  }

  currentInput = output;

  // Step 3: General abbreviations
  output = applyGeneralAbbreviations(currentInput, output, maxLength);

  if (output.length <= maxLength) {
    return { output, currentInput };
  }

  currentInput = output;

  return { output, currentInput };
};

const applyMiddleSteps = (
  input: string,
  currentInput: string,
  maxLength: number,
): { output: string; currentInput: string } => {
  let output = input;
  let updatedInput = currentInput;

  // Step 4: Road type abbreviations bis
  output = applyRoadTypeAbbreviationsBis(updatedInput, output, maxLength);

  if (output.length <= maxLength) {
    return { output, currentInput: updatedInput };
  }

  updatedInput = output;

  // Step 5: First name abbreviations
  output = applyFirstNameAbbreviations(updatedInput, output, maxLength);

  if (output.length <= maxLength) {
    return { output, currentInput: updatedInput };
  }

  updatedInput = output;

  // Step 6: Saint abbreviations
  output = applySaintAbbreviations(updatedInput, output, maxLength);

  if (output.length <= maxLength) {
    return { output, currentInput: updatedInput };
  }

  return { output, currentInput: updatedInput };
};

const applyFinalSteps = (
  output: string,
  currentInput: string,
  maxLength: number,
): string => {
  let result = output;

  // Step 7: Road type at beginning
  result = applyRoadTypeBeginning(currentInput, result, maxLength);

  if (result.length <= maxLength) {
    return result;
  }

  // Step 8: Particle replacement
  result = applyParticleReplacement(result);

  // Step 9: Remove uppercase articles
  result = removeUppercaseArticles(result, maxLength);

  if (result.length <= maxLength) {
    return result;
  }

  // Step 10: Residual abbreviations
  result = applyResidualAbbreviations(result, maxLength);

  if (result.length <= maxLength) {
    return result;
  }

  // Step 11: Remove lowercase articles
  result = removeLowercaseArticles(result, maxLength);

  return result;
};

const normalizer = (
  originalInput: string,
  maxLength = DEFAULT_MAX_LENGTH,
): string => {
  const input = preprocessInput(originalInput);
  const output = input;

  if (output.length <= maxLength) {
    return output;
  }

  const initialResult = applyInitialSteps(output, maxLength);

  if (initialResult.output.length <= maxLength) {
    return initialResult.output;
  }

  const middleResult = applyMiddleSteps(
    initialResult.output,
    initialResult.currentInput,
    maxLength,
  );

  if (middleResult.output.length <= maxLength) {
    return middleResult.output;
  }

  return applyFinalSteps(
    middleResult.output,
    middleResult.currentInput,
    maxLength,
  );
};

export const normalize = (
  input: string,
  maxLength = DEFAULT_MAX_LENGTH,
): string => {
  return normalizer(input, maxLength).toUpperCase();
};

export const clearRulesCache = (): void => {
  cachedRules = null;
};
