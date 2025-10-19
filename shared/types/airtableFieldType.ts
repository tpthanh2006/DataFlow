// Full disclosure: This was entirely AI generated, will most likely need manual fixing/updates
// This may or may not be useful as I don't believe airtable.js has any types for fields
// Base Field export interface
export interface BaseField {
  id: string;
  name: string;
  description?: string;
  type: string;
}

// Field type interfaces - each extends BaseField
export interface SingleLineTextField extends BaseField {
  type: "singleLineText";
}

export interface EmailField extends BaseField {
  type: "email";
}

export interface UrlField extends BaseField {
  type: "url";
}

export interface MultilineTextField extends BaseField {
  type: "multilineText";
}

export interface NumberField extends BaseField {
  type: "number";
  options?: {
    precision: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  };
}

export interface CurrencyField extends BaseField {
  type: "currency";
  options?: {
    precision: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
    symbol: string;
  };
}

export interface PercentField extends BaseField {
  type: "percent";
  options?: {
    precision: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  };
}

type AirtableDateConfig = {
  dateFormat: {
    name: "local" | "friendly" | "us" | "european" | "iso";
    format: "l" | "LL" | "M/D/YYYY" | "D/M/YYYY" | "YYYY-MM-DD";
  };
};

export interface DateField extends BaseField {
  type: "date";
  options?: AirtableDateConfig;
}

// https://airtable.com/developers/web/api/model/timezone
// Programmers note: :(
export const AIRTABLE_TIMEZONES = [
  "utc",
  "client",
  "Africa/Abidjan",
  "Africa/Accra",
  "Africa/Addis_Ababa",
  "Africa/Algiers",
  "Africa/Asmara",
  "Africa/Bamako",
  "Africa/Bangui",
  "Africa/Banjul",
  "Africa/Bissau",
  "Africa/Blantyre",
  "Africa/Brazzaville",
  "Africa/Bujumbura",
  "Africa/Cairo",
  "Africa/Casablanca",
  "Africa/Ceuta",
  "Africa/Conakry",
  "Africa/Dakar",
  "Africa/Dar_es_Salaam",
  "Africa/Djibouti",
  "Africa/Douala",
  "Africa/El_Aaiun",
  "Africa/Freetown",
  "Africa/Gaborone",
  "Africa/Harare",
  "Africa/Johannesburg",
  "Africa/Juba",
  "Africa/Kampala",
  "Africa/Khartoum",
  "Africa/Kigali",
  "Africa/Kinshasa",
  "Africa/Lagos",
  "Africa/Libreville",
  "Africa/Lome",
  "Africa/Luanda",
  "Africa/Lubumbashi",
  "Africa/Lusaka",
  "Africa/Malabo",
  "Africa/Maputo",
  "Africa/Maseru",
  "Africa/Mbabane",
  "Africa/Mogadishu",
  "Africa/Monrovia",
  "Africa/Nairobi",
  "Africa/Ndjamena",
  "Africa/Niamey",
  "Africa/Nouakchott",
  "Africa/Ouagadougou",
  "Africa/Porto-Novo",
  "Africa/Sao_Tome",
  "Africa/Tripoli",
  "Africa/Tunis",
  "Africa/Windhoek",
  "America/Adak",
  "America/Anchorage",
  "America/Anguilla",
  "America/Antigua",
  "America/Araguaina",
  "America/Argentina/Buenos_Aires",
  "America/Argentina/Catamarca",
  "America/Argentina/Cordoba",
  "America/Argentina/Jujuy",
  "America/Argentina/La_Rioja",
  "America/Argentina/Mendoza",
  "America/Argentina/Rio_Gallegos",
  "America/Argentina/Salta",
  "America/Argentina/San_Juan",
  "America/Argentina/San_Luis",
  "America/Argentina/Tucuman",
  "America/Argentina/Ushuaia",
  "America/Aruba",
  "America/Asuncion",
  "America/Atikokan",
  "America/Bahia",
  "America/Bahia_Banderas",
  "America/Barbados",
  "America/Belem",
  "America/Belize",
  "America/Blanc-Sablon",
  "America/Boa_Vista",
  "America/Bogota",
  "America/Boise",
  "America/Cambridge_Bay",
  "America/Campo_Grande",
  "America/Cancun",
  "America/Caracas",
  "America/Cayenne",
  "America/Cayman",
  "America/Chicago",
  "America/Chihuahua",
  "America/Costa_Rica",
  "America/Creston",
  "America/Cuiaba",
  "America/Curacao",
  "America/Danmarkshavn",
  "America/Dawson",
  "America/Dawson_Creek",
  "America/Denver",
  "America/Detroit",
  "America/Dominica",
  "America/Edmonton",
  "America/Eirunepe",
  "America/El_Salvador",
  "America/Fort_Nelson",
  "America/Fortaleza",
  "America/Glace_Bay",
  "America/Godthab",
  "America/Goose_Bay",
  "America/Grand_Turk",
  "America/Grenada",
  "America/Guadeloupe",
  "America/Guatemala",
  "America/Guayaquil",
  "America/Guyana",
  "America/Halifax",
  "America/Havana",
  "America/Hermosillo",
  "America/Indiana/Indianapolis",
  "America/Indiana/Knox",
  "America/Indiana/Marengo",
  "America/Indiana/Petersburg",
  "America/Indiana/Tell_City",
  "America/Indiana/Vevay",
  "America/Indiana/Vincennes",
  "America/Indiana/Winamac",
  "America/Inuvik",
  "America/Iqaluit",
  "America/Jamaica",
  "America/Juneau",
  "America/Kentucky/Louisville",
  "America/Kentucky/Monticello",
  "America/Kralendijk",
  "America/La_Paz",
  "America/Lima",
  "America/Los_Angeles",
  "America/Lower_Princes",
  "America/Maceio",
  "America/Managua",
  "America/Manaus",
  "America/Marigot",
  "America/Martinique",
  "America/Matamoros",
  "America/Mazatlan",
  "America/Menominee",
  "America/Merida",
  "America/Metlakatla",
  "America/Mexico_City",
  "America/Miquelon",
  "America/Moncton",
  "America/Monterrey",
  "America/Montevideo",
  "America/Montserrat",
  "America/Nassau",
  "America/New_York",
  "America/Nipigon",
  "America/Nome",
  "America/Noronha",
  "America/North_Dakota/Beulah",
  "America/North_Dakota/Center",
  "America/North_Dakota/New_Salem",
  "America/Nuuk",
  "America/Ojinaga",
  "America/Panama",
  "America/Pangnirtung",
  "America/Paramaribo",
  "America/Phoenix",
  "America/Port-au-Prince",
  "America/Port_of_Spain",
  "America/Porto_Velho",
  "America/Puerto_Rico",
  "America/Punta_Arenas",
  "America/Rainy_River",
  "America/Rankin_Inlet",
  "America/Recife",
  "America/Regina",
  "America/Resolute",
  "America/Rio_Branco",
  "America/Santarem",
  "America/Santiago",
  "America/Santo_Domingo",
  "America/Sao_Paulo",
  "America/Scoresbysund",
  "America/Sitka",
  "America/St_Barthelemy",
  "America/St_Johns",
  "America/St_Kitts",
  "America/St_Lucia",
  "America/St_Thomas",
  "America/St_Vincent",
  "America/Swift_Current",
  "America/Tegucigalpa",
  "America/Thule",
  "America/Thunder_Bay",
  "America/Tijuana",
  "America/Toronto",
  "America/Tortola",
  "America/Vancouver",
  "America/Whitehorse",
  "America/Winnipeg",
  "America/Yakutat",
  "America/Yellowknife",
  "Antarctica/Casey",
  "Antarctica/Davis",
  "Antarctica/DumontDUrville",
  "Antarctica/Macquarie",
  "Antarctica/Mawson",
  "Antarctica/McMurdo",
  "Antarctica/Palmer",
  "Antarctica/Rothera",
  "Antarctica/Syowa",
  "Antarctica/Troll",
  "Antarctica/Vostok",
  "Arctic/Longyearbyen",
  "Asia/Aden",
  "Asia/Almaty",
  "Asia/Amman",
  "Asia/Anadyr",
  "Asia/Aqtau",
  "Asia/Aqtobe",
  "Asia/Ashgabat",
  "Asia/Atyrau",
  "Asia/Baghdad",
  "Asia/Bahrain",
  "Asia/Baku",
  "Asia/Bangkok",
  "Asia/Barnaul",
  "Asia/Beirut",
  "Asia/Bishkek",
  "Asia/Brunei",
  "Asia/Chita",
  "Asia/Choibalsan",
  "Asia/Colombo",
  "Asia/Damascus",
  "Asia/Dhaka",
  "Asia/Dili",
  "Asia/Dubai",
  "Asia/Dushanbe",
  "Asia/Famagusta",
  "Asia/Gaza",
  "Asia/Hebron",
  "Asia/Ho_Chi_Minh",
  "Asia/Hong_Kong",
  "Asia/Hovd",
  "Asia/Irkutsk",
  "Asia/Istanbul",
  "Asia/Jakarta",
  "Asia/Jayapura",
  "Asia/Jerusalem",
  "Asia/Kabul",
  "Asia/Kamchatka",
  "Asia/Karachi",
  "Asia/Kathmandu",
  "Asia/Khandyga",
  "Asia/Kolkata",
  "Asia/Krasnoyarsk",
  "Asia/Kuala_Lumpur",
  "Asia/Kuching",
  "Asia/Kuwait",
  "Asia/Macau",
  "Asia/Magadan",
  "Asia/Makassar",
  "Asia/Manila",
  "Asia/Muscat",
  "Asia/Nicosia",
  "Asia/Novokuznetsk",
  "Asia/Novosibirsk",
  "Asia/Omsk",
  "Asia/Oral",
  "Asia/Phnom_Penh",
  "Asia/Pontianak",
  "Asia/Pyongyang",
  "Asia/Qatar",
  "Asia/Qostanay",
  "Asia/Qyzylorda",
  "Asia/Rangoon",
  "Asia/Riyadh",
  "Asia/Sakhalin",
  "Asia/Samarkand",
  "Asia/Seoul",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Asia/Srednekolymsk",
  "Asia/Taipei",
  "Asia/Tashkent",
  "Asia/Tbilisi",
  "Asia/Tehran",
  "Asia/Thimphu",
  "Asia/Tokyo",
  "Asia/Tomsk",
  "Asia/Ulaanbaatar",
  "Asia/Urumqi",
  "Asia/Ust-Nera",
  "Asia/Vientiane",
  "Asia/Vladivostok",
  "Asia/Yakutsk",
  "Asia/Yangon",
  "Asia/Yekaterinburg",
  "Asia/Yerevan",
  "Atlantic/Azores",
  "Atlantic/Bermuda",
  "Atlantic/Canary",
  "Atlantic/Cape_Verde",
  "Atlantic/Faroe",
  "Atlantic/Madeira",
  "Atlantic/Reykjavik",
  "Atlantic/South_Georgia",
  "Atlantic/St_Helena",
  "Atlantic/Stanley",
  "Australia/Adelaide",
  "Australia/Brisbane",
  "Australia/Broken_Hill",
  "Australia/Currie",
  "Australia/Darwin",
  "Australia/Eucla",
  "Australia/Hobart",
  "Australia/Lindeman",
  "Australia/Lord_Howe",
  "Australia/Melbourne",
  "Australia/Perth",
  "Australia/Sydney",
  "Europe/Amsterdam",
  "Europe/Andorra",
  "Europe/Astrakhan",
  "Europe/Athens",
  "Europe/Belgrade",
  "Europe/Berlin",
  "Europe/Bratislava",
  "Europe/Brussels",
  "Europe/Bucharest",
  "Europe/Budapest",
  "Europe/Busingen",
  "Europe/Chisinau",
  "Europe/Copenhagen",
  "Europe/Dublin",
  "Europe/Gibraltar",
  "Europe/Guernsey",
  "Europe/Helsinki",
  "Europe/Isle_of_Man",
  "Europe/Istanbul",
  "Europe/Jersey",
  "Europe/Kaliningrad",
  "Europe/Kiev",
  "Europe/Kirov",
  "Europe/Lisbon",
  "Europe/Ljubljana",
  "Europe/London",
  "Europe/Luxembourg",
  "Europe/Madrid",
  "Europe/Malta",
  "Europe/Mariehamn",
  "Europe/Minsk",
  "Europe/Monaco",
  "Europe/Moscow",
  "Europe/Nicosia",
  "Europe/Oslo",
  "Europe/Paris",
  "Europe/Podgorica",
  "Europe/Prague",
  "Europe/Riga",
  "Europe/Rome",
  "Europe/Samara",
  "Europe/San_Marino",
  "Europe/Sarajevo",
  "Europe/Saratov",
  "Europe/Simferopol",
  "Europe/Skopje",
  "Europe/Sofia",
  "Europe/Stockholm",
  "Europe/Tallinn",
  "Europe/Tirane",
  "Europe/Ulyanovsk",
  "Europe/Uzhgorod",
  "Europe/Vaduz",
  "Europe/Vatican",
  "Europe/Vienna",
  "Europe/Vilnius",
  "Europe/Volgograd",
  "Europe/Warsaw",
  "Europe/Zagreb",
  "Europe/Zaporozhye",
  "Europe/Zurich",
  "Indian/Antananarivo",
  "Indian/Chagos",
  "Indian/Christmas",
  "Indian/Cocos",
  "Indian/Comoro",
  "Indian/Kerguelen",
  "Indian/Mahe",
  "Indian/Maldives",
  "Indian/Mauritius",
  "Indian/Mayotte",
  "Indian/Reunion",
  "Pacific/Apia",
  "Pacific/Auckland",
  "Pacific/Bougainville",
  "Pacific/Chatham",
  "Pacific/Chuuk",
  "Pacific/Easter",
  "Pacific/Efate",
  "Pacific/Enderbury",
  "Pacific/Fakaofo",
  "Pacific/Fiji",
  "Pacific/Funafuti",
  "Pacific/Galapagos",
  "Pacific/Gambier",
  "Pacific/Guadalcanal",
  "Pacific/Guam",
  "Pacific/Honolulu",
  "Pacific/Kanton",
  "Pacific/Kiritimati",
  "Pacific/Kosrae",
  "Pacific/Kwajalein",
  "Pacific/Majuro",
  "Pacific/Marquesas",
  "Pacific/Midway",
  "Pacific/Nauru",
  "Pacific/Niue",
  "Pacific/Norfolk",
  "Pacific/Noumea",
  "Pacific/Pago_Pago",
  "Pacific/Palau",
  "Pacific/Pitcairn",
  "Pacific/Pohnpei",
  "Pacific/Port_Moresby",
  "Pacific/Rarotonga",
  "Pacific/Saipan",
  "Pacific/Tahiti",
  "Pacific/Tarawa",
  "Pacific/Tongatapu",
  "Pacific/Wake",
  "Pacific/Wallis",
] as const;
type Timezone = (typeof AIRTABLE_TIMEZONES)[number];

type AirtableDatetimeConfig = {
  dateFormat: {
    name: "local" | "friendly" | "us" | "european" | "iso";
    format: "l" | "LL" | "M/D/YYYY" | "D/M/YYYY" | "YYYY-MM-DD";
  };
  timeFormat: {
    name: "12hour" | "24hour";
  };
  timeZone: Timezone;
};

export interface DatetimeField extends BaseField {
  type: "dateTime";
  options?: AirtableDatetimeConfig;
}

export interface PhoneNumberField extends BaseField {
  type: "phoneNumber";
}

export interface AttachmentField extends BaseField {
  type: "multipleAttachments";
  options?: {
    isReversed: boolean;
  };
}

export interface CheckboxField extends BaseField {
  type: "checkbox";
  options?: {
    icon?:
      | "check"
      | "xCheckbox"
      | "star"
      | "heart"
      | "thumbsUp"
      | "flag"
      | "dot";
    color:
      | "yellowBright"
      | "orangeBright"
      | "redBright"
      | "pinkBright"
      | "purpleBright"
      | "blueBright"
      | "cyanBright"
      | "tealBright"
      | "greenBright"
      | "grayBright";
  };
}

export interface RatingField extends BaseField {
  type: "rating";
  options?: {
    icon: "star" | "heart" | "thumbsUp" | "flag" | "dot";
    max: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    color:
      | "yellowBright"
      | "orangeBright"
      | "redBright"
      | "pinkBright"
      | "purpleBright"
      | "blueBright"
      | "cyanBright"
      | "tealBright"
      | "greenBright"
      | "grayBright";
  };
}

export const AIRTABLE_CHOICES_COLORS = [
  "blueLight2",
  "cyanLight2",
  "tealLight2",
  "greenLight2",
  "yellowLight2",
  "orangeLight2",
  "redLight2",
  "pinkLight2",
  "purpleLight2",
  "grayLight2",
  "blueLight1",
  "cyanLight1",
  "tealLight1",
  "greenLight1",
  "yellowLight1",
  "orangeLight1",
  "redLight1",
  "pinkLight1",
  "purpleLight1",
  "grayLight1",
  "blueBright",
  "cyanBright",
  "tealBright",
  "greenBright",
  "yellowBright",
  "orangeBright",
  "redBright",
  "pinkBright",
  "purpleBright",
  "grayBright",
  "blueDark1",
  "cyanDark1",
  "tealDark1",
  "greenDark1",
  "yellowDark1",
  "orangeDark1",
  "redDark1",
  "pinkDark1",
  "purpleDark1",
  "grayDark1",
] as const;

export interface SelectChoice {
  id?: string;
  name: string;
  color: (typeof AIRTABLE_CHOICES_COLORS)[number];
}

export interface SingleSelectField extends BaseField {
  type: "singleSelect";
  options?: {
    choices?: SelectChoice[];
  };
}

export interface MultipleSelectField extends BaseField {
  type: "multipleSelects";
  options?: {
    choices?: SelectChoice[];
  };
}

type AirtableCollaborator = {
  id: string;
  email?: string;
  name?: string;
  permissionLevel?: "none" | "read" | "comment" | "edit" | "create";
  profilePicUrl?: string;
};

export interface CollaboratorField extends BaseField {
  type: "singleCollaborator";
  options?: AirtableCollaborator;
}

export interface MultipleCollaboratorsField extends BaseField {
  type: "multipleCollaborators";
  options?: AirtableCollaborator[];
}

export interface LinkedRecordField extends BaseField {
  type: "multipleRecordLinks";
  options: {
    linkedTableId: string;
    isReversed?: boolean;
    prefersSingleRecordLink?: boolean;
    inverseLinkFieldId?: string;
    viewIdForRecordSelection?: string;
  };
}

export interface LookupField extends BaseField {
  type: "multipleLookupValues";
  options: {
    recordLinkFieldId: string | null;
    fieldIdInLinkedTable: string | null;
    isValid: boolean;
    result: {
      type: string;
      options?: unknown;
    } | null;
  };
}

export interface RollupField extends BaseField {
  type: "rollup";
  options: {
    recordLinkFieldId?: string;
    fieldIdInLinkedTable?: string;
    referencedFieldIds?: string[];
    result?: {
      type: string;
      options?: unknown;
    };
  };
}

export interface CountField extends BaseField {
  type: "count";
  options?: {
    isValid: boolean;
    recordLinkFieldId?: string | null;
  };
}

export interface FormulaField extends BaseField {
  type: "formula";
  options: {
    formula: string;
    isValid: boolean;
    referencedFieldIds: string[] | null;
    result: {
      type: string;
      options?: unknown;
    } | null;
  };
}

export interface CreatedTimeField extends BaseField {
  type: "createdTime";
  options?: {
    result?: {
      type: "dateTime";
      options?: {
        result: AirtableDateConfig | AirtableDatetimeConfig;
      };
    };
  };
}

export interface CreatedByField extends BaseField {
  type: "createdBy";
  options?: {
    id: string;
    email?: string;
    name?: string;
    permissionLevel?: "none" | "read" | "comment" | "edit" | "create";
    profilePicUrl?: string;
  };
}

export interface LastModifiedTimeField extends BaseField {
  type: "lastModifiedTime";
  options?: {
    result?: {
      type: "dateTime";
      options?: {
        isValid: boolean;
        result: AirtableDateConfig | AirtableDatetimeConfig | null;
      };
    };
    referencedFieldIds?: string[];
  };
}

export interface LastModifiedByField extends BaseField {
  type: "lastModifiedBy";
  options?: {
    id: string;
    email?: string;
    name?: string;
    permissionLevel?: "none" | "read" | "comment" | "edit" | "create";
    profilePicUrl?: string;
  };
}

export interface AutoNumberField extends BaseField {
  type: "autoNumber";
}

export interface BarcodeField extends BaseField {
  type: "barcode";
  options?: {
    type?: string | null;
    text: string;
  };
}

export interface DurationField extends BaseField {
  type: "duration";
  options?: {
    durationFormat:
      | "h:mm"
      | "h:mm:ss"
      | "h:mm:ss.S"
      | "h:mm:ss.SS"
      | "h:mm:ss.SSS";
  };
}

export interface RichTextField extends BaseField {
  type: "richText";
}

export interface ButtonField extends BaseField {
  type: "button";
  options?: {
    label: string;
    url: string | null;
  };
}

export interface AITextField extends BaseField {
  type: "aiText";
  options?:
    | {
        state: "empty" | "loading" | "generated";
        isStale: boolean;
        value: string | null;
      }
    | {
        state: "error";
        errorType: string;
        isStale: boolean;
        value: string | null;
      };
}

// Main Field type as a union of all field types
export type AirtableField =
  | SingleLineTextField
  | EmailField
  | UrlField
  | MultilineTextField
  | NumberField
  | CurrencyField
  | PercentField
  | DateField
  | DatetimeField
  | PhoneNumberField
  | AttachmentField
  | CheckboxField
  | RatingField
  | SingleSelectField
  | MultipleSelectField
  | CollaboratorField
  | MultipleCollaboratorsField
  | LinkedRecordField
  | LookupField
  | RollupField
  | CountField
  | FormulaField
  | CreatedTimeField
  | CreatedByField
  | LastModifiedTimeField
  | LastModifiedByField
  | AutoNumberField
  | BarcodeField
  | DurationField
  | RichTextField
  | ButtonField
  | AITextField;

// Type guard functions for field types
export function isSingleLineTextField(
  field: AirtableField,
): field is SingleLineTextField {
  return field.type === "singleLineText";
}

export function isNumberField(field: AirtableField): field is NumberField {
  return field.type === "number";
}

export function isSingleSelectField(
  field: AirtableField,
): field is SingleSelectField {
  return field.type === "singleSelect";
}

export function isLinkedRecordField(
  field: AirtableField,
): field is LinkedRecordField {
  return field.type === "multipleRecordLinks";
}

export function isFormulaField(field: AirtableField): field is FormulaField {
  return field.type === "formula";
}

export const AIRTABLE_FIELD_TYPES = [
  "singleLineText",
  "email",
  "url",
  "multilineText",
  "number",
  "percent",
  "currency",
  "singleSelect",
  "multipleSelects",
  "singleCollaborator",
  "multipleCollaborators",
  "multipleRecordLinks",
  "date",
  "dateTime",
  "phoneNumber",
  "multipleAttachments",
  "checkbox",
  "formula",
  "createdTime",
  "rollup",
  "count",
  "lookup",
  "multipleLookupValues",
  "autoNumber",
  "barcode",
  "rating",
  "richText",
  "duration",
  "lastModifiedTime",
  "button",
  "createdBy",
  "lastModifiedBy",
  "externalSyncSource",
  "aiText",
] as const;
export type AirtableFieldTypes = (typeof AIRTABLE_FIELD_TYPES)[number];

export const AIRTABLE_AUTOGEN_FIELD_TYPES = [
  "formula",
  "lookup",
  "count",
  "rollup",
  "autoNumber",
  "button",
  "createdTime",
  "lastModifiedTime",
  "createdBy",
  "lastModifiedBy",
  "aiText",
] as const;

export const AIRTABLE_UNSUPPORTED_FIELD_TYPES = [
  ...AIRTABLE_AUTOGEN_FIELD_TYPES,
  "multipleAttachments",
  "barcode",
  "multipleSelects",
  "singleCollaborator",
  "externalSyncSource",
] as const;

// Add more type guards as needed...

// Example usage:
/*
const exampleField: Field = {
  id: 'fld1234567890',
  name: 'Status',
  type: 'singleSelect',
  options: {
    choices: [
      { name: 'Todo', color: 'redLight2' },
      { name: 'In Progress', color: 'yellowLight2' },
      { name: 'Done', color: 'greenLight2' }
    ]
  }
};
*/
