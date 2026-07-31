import type { RoomFeatureCategory, RoomType } from "@prisma/client";

export const roomTypes: ReadonlyArray<{ value: RoomType; label: string }> = [
  { value: "LIVING", label: "Living" },
  { value: "BEDROOM", label: "Dormitor" },
  { value: "KITCHEN", label: "Bucătărie" },
  { value: "BATHROOM", label: "Baie" },
  { value: "HALL", label: "Hol" },
  { value: "DRESSING", label: "Dressing" },
  { value: "OFFICE", label: "Birou" },
  { value: "TECHNICAL_ROOM", label: "Cameră tehnică" },
  { value: "GARAGE", label: "Garaj" },
  { value: "TERRACE", label: "Terasă" },
  { value: "BALCONY", label: "Balcon" },
  { value: "COMMERCIAL_SPACE", label: "Spațiu comercial" },
  { value: "HOTEL_ROOM", label: "Cameră hotel" },
  { value: "OTHER", label: "Alt tip" },
];

export const featureCategories: ReadonlyArray<{
  value: RoomFeatureCategory;
  label: string;
}> = [
  { value: "LIGHTING", label: "Iluminat" },
  { value: "SHADING", label: "Jaluzele și umbrire" },
  { value: "HEATING", label: "Încălzire" },
  { value: "COOLING_VENTILATION", label: "Răcire și ventilație" },
  { value: "SECURITY", label: "Securitate" },
  { value: "ACCESS", label: "Acces" },
  { value: "MULTIMEDIA", label: "Multimedia" },
  { value: "ENERGY", label: "Energie" },
];

export type FeatureDefinition = {
  code: string;
  category: RoomFeatureCategory;
  label: string;
  quantityLabel?: string;
};

export const featureDefinitions: readonly FeatureDefinition[] = [
  { code: "LIGHTING_ON_OFF", category: "LIGHTING", label: "On/Off", quantityLabel: "Circuite" },
  { code: "LIGHTING_DIMMABLE", category: "LIGHTING", label: "Dimabil", quantityLabel: "Circuite" },
  { code: "LIGHTING_RGBW", category: "LIGHTING", label: "RGB/RGBW", quantityLabel: "Zone" },
  { code: "LIGHTING_SCENES", category: "LIGHTING", label: "Scenarii" },
  {
    code: "LIGHTING_PRESENCE",
    category: "LIGHTING",
    label: "Senzor de prezență",
    quantityLabel: "Senzori",
  },
  {
    code: "LIGHTING_LUX",
    category: "LIGHTING",
    label: "Senzor de lumină",
    quantityLabel: "Senzori",
  },
  {
    code: "LIGHTING_FIXTURES",
    category: "LIGHTING",
    label: "Corpuri de iluminat",
    quantityLabel: "Corpuri",
  },
  {
    code: "LIGHTING_ZONES",
    category: "LIGHTING",
    label: "Zone de iluminat",
    quantityLabel: "Zone",
  },
  { code: "SHADING_BLINDS", category: "SHADING", label: "Jaluzele", quantityLabel: "Motoare" },
  { code: "SHADING_ROLLERS", category: "SHADING", label: "Rulouri", quantityLabel: "Motoare" },
  { code: "SHADING_CURTAINS", category: "SHADING", label: "Perdele", quantityLabel: "Motoare" },
  { code: "SHADING_AUTO", category: "SHADING", label: "Control automat" },
  { code: "HEATING_THERMOSTAT", category: "HEATING", label: "Termostat", quantityLabel: "Bucăți" },
  {
    code: "HEATING_FLOOR",
    category: "HEATING",
    label: "Încălzire în pardoseală",
    quantityLabel: "Zone",
  },
  { code: "HEATING_RADIATORS", category: "HEATING", label: "Radiatoare", quantityLabel: "Bucăți" },
  { code: "HEATING_VALVES", category: "HEATING", label: "Electrovalve", quantityLabel: "Bucăți" },
  { code: "HEATING_ZONE", category: "HEATING", label: "Zonă separată de temperatură" },
  {
    code: "COOLING_AC",
    category: "COOLING_VENTILATION",
    label: "Aer condiționat",
    quantityLabel: "Unități",
  },
  {
    code: "COOLING_FAN_COIL",
    category: "COOLING_VENTILATION",
    label: "Ventiloconvector",
    quantityLabel: "Unități",
  },
  { code: "VENTILATION_HRV", category: "COOLING_VENTILATION", label: "Recuperare de căldură" },
  {
    code: "SENSOR_CO2",
    category: "COOLING_VENTILATION",
    label: "Senzor CO₂",
    quantityLabel: "Senzori",
  },
  {
    code: "SENSOR_HUMIDITY",
    category: "COOLING_VENTILATION",
    label: "Senzor umiditate",
    quantityLabel: "Senzori",
  },
  {
    code: "SECURITY_MOTION",
    category: "SECURITY",
    label: "Senzor de mișcare",
    quantityLabel: "Senzori",
  },
  { code: "SECURITY_DOOR", category: "SECURITY", label: "Contact ușă", quantityLabel: "Contacte" },
  {
    code: "SECURITY_WINDOW",
    category: "SECURITY",
    label: "Contact fereastră",
    quantityLabel: "Contacte",
  },
  {
    code: "SECURITY_SMOKE",
    category: "SECURITY",
    label: "Detector fum",
    quantityLabel: "Detectoare",
  },
  {
    code: "SECURITY_GAS",
    category: "SECURITY",
    label: "Detector gaz",
    quantityLabel: "Detectoare",
  },
  {
    code: "SECURITY_WATER",
    category: "SECURITY",
    label: "Detector apă",
    quantityLabel: "Detectoare",
  },
  { code: "SECURITY_CAMERA", category: "SECURITY", label: "Cameră video", quantityLabel: "Camere" },
  { code: "SECURITY_ALARM", category: "SECURITY", label: "Alarmă" },
  { code: "ACCESS_LOCK", category: "ACCESS", label: "Yală inteligentă", quantityLabel: "Bucăți" },
  { code: "ACCESS_VIDEO", category: "ACCESS", label: "Videointerfon", quantityLabel: "Bucăți" },
  { code: "ACCESS_CONTROL", category: "ACCESS", label: "Control acces", quantityLabel: "Puncte" },
  { code: "ACCESS_RFID", category: "ACCESS", label: "Cititor RFID", quantityLabel: "Cititoare" },
  { code: "ACCESS_PIN", category: "ACCESS", label: "Tastatură PIN", quantityLabel: "Bucăți" },
  { code: "MEDIA_AUDIO", category: "MULTIMEDIA", label: "Audio", quantityLabel: "Zone" },
  { code: "MEDIA_TV", category: "MULTIMEDIA", label: "TV", quantityLabel: "Ecrane" },
  { code: "MEDIA_MULTIROOM", category: "MULTIMEDIA", label: "Multiroom", quantityLabel: "Zone" },
  { code: "MEDIA_CINEMA", category: "MULTIMEDIA", label: "Scenă Cinema" },
  {
    code: "ENERGY_MONITOR",
    category: "ENERGY",
    label: "Monitorizare consum",
    quantityLabel: "Circuite",
  },
  {
    code: "ENERGY_SWITCHED_SOCKET",
    category: "ENERGY",
    label: "Priză comandată",
    quantityLabel: "Prize",
  },
  {
    code: "ENERGY_METER",
    category: "ENERGY",
    label: "Contorizare circuit",
    quantityLabel: "Circuite",
  },
  { code: "ENERGY_PV", category: "ENERGY", label: "Integrare fotovoltaic" },
  { code: "ENERGY_EV", category: "ENERGY", label: "Integrare stație EV" },
];
