import { ASSET_TUR14 } from "./stickerAssetTUR14.js";
import { ASSET_TUR15 } from "./stickerAssetTUR15.js";
import { ASSET_TUR16 } from "./stickerAssetTUR16.js";
import { ASSET_TUR17 } from "./stickerAssetTUR17.js";
import { ASSET_TUR18 } from "./stickerAssetTUR18.js";
import { ASSET_TUR19 } from "./stickerAssetTUR19.js";
import { ASSET_TUR20 } from "./stickerAssetTUR20.js";

const MISSING_STICKER = null;

export const STICKER_ASSETS = {
  ...ASSET_TUR14,
  ...ASSET_TUR15,
  ...ASSET_TUR16,
  ...ASSET_TUR17,
  ...ASSET_TUR18,
  ...ASSET_TUR19,
  ...ASSET_TUR20,

// AUS — fotos del ZIP validadas por nombre impreso
"AUS2": "/stickers/AUS2.jpg",
"AUS4": "/stickers/AUS4.jpg",
"AUS5": "/stickers/AUS5.jpg",
"AUS6": "/stickers/AUS6.jpg",
"AUS7": "/stickers/AUS7.jpg",
"AUS8": "/stickers/AUS8.jpg",
"AUS9": "/stickers/AUS9.jpg",
"AUS10": "/stickers/AUS10.jpg",
"AUS11": "/stickers/AUS11.jpg",
"AUS14": "/stickers/AUS14.jpg",
"AUS17": "/stickers/AUS17.jpg",
"AUS18": "/stickers/AUS18.jpg",
"AUS19": "/stickers/AUS19.jpg",

// TUR — originales validados en los PDF del álbum
"TUR1": "/turkey-original/TUR1.png",
"TUR2": "/turkey-original/TUR2.png",
"TUR3": "/turkey-original/TUR3.png",
"TUR4": "/turkey-original/TUR4.png",
"TUR5": "/turkey-original/TUR5.png",
"TUR6": "/turkey-original/TUR6.png",
"TUR7": "/turkey-original/TUR7.png",
"TUR8": "/turkey-original/TUR8.png",
"TUR9": "/turkey-original/TUR9.png",
"TUR10": "/turkey-original/TUR10.png",
"TUR11": "/turkey-original/TUR11.png",
"TUR12": "/turkey-original/TUR12.png",
"TUR13": MISSING_STICKER,
"TUR14": "/turkey-original/TUR14.png",
"TUR15": "/turkey-original/TUR15.png",
"TUR16": "/turkey-original/TUR16.png",
"TUR17": "/turkey-original/TUR17.png",
"TUR18": "/turkey-original/TUR18.png",
"TUR19": "/turkey-original/TUR19.png",
"TUR20": "/turkey-original/TUR20.png",
// ALG — fotos reales validadas visualmente (álbum, 16 láminas). null = sin lámina.
"ALG1": "/algeria/ALG01.jpg", // Algeria Crest
"ALG2": "/algeria/ALG04.jpg", // Alexis Guendouz
"ALG3": "/algeria/ALG09.jpg", // Ramy Bensebaini
"ALG4": "/algeria/ALG11.jpg", // Youcef Atal
"ALG5": "/algeria/ALG15.jpg", // Rayan Aït-Nouri
"ALG6": null, // Mohamed Amine — sin lámina
"ALG7": null, // Aïssa Mandi — sin lámina
"ALG8": "/algeria/ALG05.jpg", // Ismaël Bennacer
"ALG9": "/algeria/ALG16.jpg", // Houssem Aouar
"ALG10": "/algeria/ALG02.jpg", // Hicham Boudaoui
"ALG11": "/algeria/ALG07.jpg", // Ramiz Zerrouki
"ALG12": "/algeria/ALG14.jpg", // Nabil Bentaleb
"ALG13": null, // Algeria (foto selección) — sin lámina
"ALG14": "/algeria/ALG03.jpg", // Farès Chaïbi
"ALG15": "/algeria/ALG10.jpg", // Riyad Mahrez
"ALG16": "/algeria/ALG13.jpg", // Saïd Benrahma
"ALG17": "/algeria/ALG06.jpg", // Anis Hadj Moussa
"ALG18": "/algeria/ALG12.jpg", // Amine Gouiri
"ALG19": "/algeria/ALG08.jpg", // Baghdad Bounedjah
"ALG20": null, // Mohammed Amoura — sin lámina

// ARG — fotos reales validadas visualmente
"ARG1": "/stickers/ARG1.jpg",
"ARG2": "/stickers/ARG2.jpg",
"ARG3": "/stickers/ARG3.jpg",
"ARG4": "/stickers/ARG4.jpg",
"ARG5": "/stickers/ARG5.jpg",
"ARG6": "/stickers/ARG6.jpg",
"ARG7": "/stickers/ARG7.jpg",
"ARG8": "/stickers/ARG8.jpg",
"ARG9": "/stickers/ARG9.jpg",
"ARG10": "/stickers/ARG10.jpg",
"ARG11": "/stickers/ARG11.jpg",
"ARG12": "/stickers/ARG12.jpg",
"ARG13": "/stickers/ARG13.jpg",
"ARG14": "/stickers/ARG14.jpg",
"ARG15": "/stickers/ARG15.jpg",
"ARG16": "/stickers/ARG16.jpg",
"ARG17": "/stickers/ARG17.jpg",
"ARG18": "/stickers/ARG18.jpg",
"ARG19": "/stickers/ARG19.jpg",
"ARG20": "/stickers/ARG20.jpg",

// AUT — fotos reales validadas visualmente (álbum, 16 láminas). null = sin lámina.
"AUT1": "/austria/AUT01.png", // Austria Crest
"AUT2": "/austria/AUT07.png", // Alexander Schlager
"AUT3": "/austria/AUT12.png", // Patrick Pentz
"AUT4": "/austria/AUT05.png", // David Alaba
"AUT5": "/austria/AUT06.png", // Kevin Danso
"AUT6": "/austria/AUT10.png", // Philipp Lienhart
"AUT7": "/austria/AUT16.png", // Stefan Posch
"AUT8": null, // Philipp Mwene — sin lámina
"AUT9": "/austria/AUT08.png", // Alexander Prass
"AUT10": "/austria/AUT11.png", // Xaver Schlager
"AUT11": "/austria/AUT04.png", // Marcel Sabitzer
"AUT12": "/austria/AUT09.png", // Konrad Laimer
"AUT13": null, // Austria (foto selección) — sin lámina
"AUT14": null, // Florian Grillitsch — sin lámina
"AUT15": "/austria/AUT13.png", // Nicolas Seiwald
"AUT16": "/austria/AUT14.png", // Romano Schmid
"AUT17": "/austria/AUT15.png", // Patrick Wimmer
"AUT18": "/austria/AUT03.png", // Christoph Baumgartner
"AUT19": "/austria/AUT02.png", // Michael Gregoritsch
"AUT20": null, // Marko Arnautović — sin lámina

// BEL — fotos reales validadas visualmente (álbum, 16 láminas). null = sin lámina.
"BEL1": "/belgium/BEL01.png", // Belgium Crest
"BEL2": null, // Thibaut Courtois — sin lámina
"BEL3": "/belgium/BEL04.png", // Arthur Theate
"BEL4": "/belgium/BEL10.png", // Timothy Castagne
"BEL5": "/belgium/BEL07.png", // Zeno Debast
"BEL6": "/belgium/BEL03.png", // Brandon Mechele
"BEL7": "/belgium/BEL12.png", // Maxim De Cuyper
"BEL8": "/belgium/BEL09.png", // Thomas Meunier
"BEL9": "/belgium/BEL08.png", // Youri Tielemans
"BEL10": "/belgium/BEL05.png", // Amadou Onana
"BEL11": "/belgium/BEL14.png", // Nicolas Raskin
"BEL12": "/belgium/BEL06.png", // Alexis Saelemaekers
"BEL13": null, // Belgium (foto selección) — sin lámina
"BEL14": "/belgium/BEL02.png", // Hans Vanaken
"BEL15": "/belgium/BEL16.png", // Kevin De Bruyne
"BEL16": "/belgium/BEL15.png", // Jérémy Doku
"BEL17": null, // Charles De Ketelaere — sin lámina
"BEL18": null, // Leandro Trossard — sin lámina
"BEL19": "/belgium/BEL13.png", // Loïs Openda
"BEL20": "/belgium/BEL11.png", // Romelu Lukaku

// BIH — sólo tarjetas originales de las fuentes entregadas; null muestra el código
"BIH1": "/bosnia-original/BIH1.png",
"BIH2": "/bosnia-original/BIH2.png",
"BIH3": "/bosnia-original/BIH3.png",
"BIH4": "/bosnia-original/BIH4.png",
"BIH5": "/bosnia-original/BIH5.png",
"BIH6": "/bosnia-original/BIH6.png",
"BIH7": "/bosnia-original/BIH7.png",
"BIH8": "/bosnia-original/BIH8.png",
"BIH9": "/bosnia-original/BIH9.png",
"BIH10": null,
"BIH11": "/bosnia-original/BIH11.png",
"BIH12": "/bosnia-original/BIH12.png",
"BIH13": null,
"BIH14": null,
"BIH15": "/bosnia-original/BIH15.png",
"BIH16": "/bosnia-original/BIH16.png",
"BIH17": "/bosnia-original/BIH17.png",
"BIH18": "/bosnia-original/BIH18.png",
"BIH19": "/bosnia-original/BIH19.png",
"BIH20": "/bosnia-original/BIH20.png",

// CAN — sólo tarjetas originales de las fuentes entregadas; null muestra el código
"CAN1": "/canada-original/CAN1.png",
"CAN2": "/canada-original/CAN2.png",
"CAN3": "/canada-original/CAN3.png",
"CAN4": "/canada-original/CAN4.png",
"CAN5": "/canada-original/CAN5.png",
"CAN6": "/canada-original/CAN6.png",
"CAN7": "/canada-original/CAN7.png",
"CAN8": "/canada-original/CAN8.png",
"CAN9": "/canada-original/CAN9.png",
"CAN10": "/canada-original/CAN10.png",
"CAN11": "/canada-original/CAN11.png",
"CAN12": "/canada-original/CAN12.png",
"CAN13": null,
"CAN14": "/canada-original/CAN14.png",
"CAN15": "/canada-original/CAN15.png",
"CAN16": "/canada-original/CAN16.png",
"CAN17": "/canada-original/CAN17.png",
"CAN18": "/canada-original/CAN18.png",
"CAN19": "/canada-original/CAN19.png",
"CAN20": "/canada-original/CAN20.png",

// CIV — originales validados en los PDF del álbum
"CIV1": "/ivory-coast-original/CIV1.png",
"CIV2": "/ivory-coast-original/CIV2.png",
"CIV3": "/ivory-coast-original/CIV3.png",
"CIV4": "/ivory-coast-original/CIV4.png",
"CIV5": "/ivory-coast-original/CIV5.png",
"CIV6": "/ivory-coast-original/CIV6.png",
"CIV7": "/ivory-coast-original/CIV7.png",
"CIV8": "/ivory-coast-original/CIV8.png",
"CIV9": "/ivory-coast-original/CIV9.png",
"CIV10": "/ivory-coast-original/CIV10.png",
"CIV11": "/ivory-coast-original/CIV11.png",
"CIV12": "/ivory-coast-original/CIV12.png",
"CIV13": MISSING_STICKER,
"CIV14": MISSING_STICKER,
"CIV15": "/ivory-coast-original/CIV15.png",
"CIV16": "/ivory-coast-original/CIV16.png",
"CIV17": "/ivory-coast-original/CIV17.png",
"CIV18": "/ivory-coast-original/CIV18.png",
"CIV19": "/ivory-coast-original/CIV19.png",
"CIV20": MISSING_STICKER,

// COD — material real validado por nombre impreso
"COD1": "/stickers/COD1.jpg",
"COD3": "/stickers/COD7.jpg",
"COD5": MISSING_STICKER, // COD5.jpg contiene Meschack Elia, no Arthur Masuaku
"COD6": "/stickers/COD3.jpg",
"COD7": MISSING_STICKER, // COD7.jpg contiene Aaron Wan-Bissaka, no Joris Kayembe
"COD8": "/stickers/COD8.jpg",
"COD15": "/stickers/COD5.jpg",

// CPV — material real disponible
"CPV2": "/stickers/CPV2.jpg",

// CRO — se descartan CRO3.jpg, CRO5.jpg y CRO8.jpg por pertenecer a otras selecciones
"CRO3": MISSING_STICKER,
"CRO4": "/stickers/CRO4.jpg",
"CRO5": MISSING_STICKER,
"CRO6": "/stickers/CRO6.jpg",
"CRO8": "/stickers/CRO9.jpg",
"CRO9": MISSING_STICKER, // CRO9.jpg contiene Kristijan Jakić, no Luka Modrić
"CRO18": "/stickers/CRO18.jpg",

// CUW — originales validados en los PDF del álbum
"CUW1": "/curacao-original/CUW1.png",
"CUW2": "/curacao-original/CUW2.png",
"CUW3": "/curacao-original/CUW3.png",
"CUW4": "/curacao-original/CUW4.png",
"CUW5": "/curacao-original/CUW5.png",
"CUW6": "/curacao-original/CUW6.png",
"CUW7": "/curacao-original/CUW7.png",
"CUW8": "/curacao-original/CUW8.png",
"CUW9": "/curacao-original/CUW9.png",
"CUW10": "/curacao-original/CUW10.png",
"CUW11": "/curacao-original/CUW11.png",
"CUW12": "/curacao-original/CUW12.png",
"CUW13": MISSING_STICKER,
"CUW14": "/curacao-original/CUW14.png",
"CUW15": "/curacao-original/CUW15.png",
"CUW16": "/curacao-original/CUW16.png",
"CUW17": "/curacao-original/CUW17.png",
"CUW18": "/curacao-original/CUW18.png",
"CUW19": "/curacao-original/CUW19.png",
"CUW20": "/curacao-original/CUW20.png",

// CZE — sólo tarjetas originales de los PDF; null muestra el código sin foto externa
"CZE1": "/czechia-original/CZE1.png",
"CZE2": "/czechia-original/CZE2.png",
"CZE3": "/czechia-original/CZE3.png",
"CZE4": "/czechia-original/CZE4.png",
"CZE5": "/czechia/CZE5.png",
"CZE6": "/czechia-original/CZE6.png",
"CZE7": "/czechia-original/CZE7.png",
"CZE8": "/czechia-original/CZE8.png",
"CZE9": "/czechia-original/CZE9.png",
"CZE10": "/czechia-original/CZE10.png",
"CZE11": "/czechia-original/CZE11.png",
"CZE12": "/czechia/CZE12.png",
"CZE13": null,
"CZE14": "/czechia-original/CZE14.png",
"CZE15": "/czechia-original/CZE15.png",
"CZE16": "/czechia-original/CZE16.png",
"CZE17": "/czechia-original/CZE17.png",
"CZE18": "/czechia-original/CZE18.png",
"CZE19": "/czechia-original/CZE19.png",
"CZE20": "/czechia-original/CZE20.png",

"BRA1": "/stickers/BRA01.png",
"BRA2": "/stickers/BRA03.png",
"BRA3": "/stickers/BRA04.png",
"BRA4": "/stickers/BRA05.png",
"BRA5": "/stickers/BRA07.png",
"BRA6": "/stickers/BRA08.png",
"BRA7": "/stickers/BRA09.png",
"BRA8": "/stickers/BRA06.png",
"BRA9": "/stickers/BRA11.png",
"BRA10": "/stickers/BRA12.png",
"BRA11": "/stickers/BRA10.png",
"BRA12": "/stickers/BRA13.png",
"BRA13": "/stickers/BRA02.png",
"BRA14": "/stickers/BRA14.png",
"BRA15": "/stickers/BRA19.png",
"BRA16": "/stickers/BRA20.png",
"BRA17": "/stickers/BRA18.png",
"BRA18": "/stickers/BRA15.png",
"BRA19": "/stickers/BRA16.png",
"BRA20": "/stickers/BRA17.png",
"COL1": "/stickers/COL01.png",
"COL2": "/stickers/COL04.png",
"COL3": "/stickers/COL03.png",
"COL4": "/stickers/COL19.png",
"COL5": "/stickers/COL17.png",
"COL6": "/stickers/COL16.png",
"COL7": "/stickers/COL18.png",
"COL8": "/stickers/COL20.png",
"COL9": "/stickers/COL15.png",
"COL10": "/stickers/COL14.png",
"COL11": "/stickers/COL13.png",
"COL12": "/stickers/COL10.png",
"COL13": "/stickers/COL02.png",
"COL14": "/stickers/COL12.png",
"COL15": "/stickers/COL11.png",
"COL16": "/stickers/COL09.png",
"COL17": "/stickers/COL07.png",
"COL18": "/stickers/COL06.png",
"COL19": "/stickers/COL08.png",
"COL20": "/stickers/COL05.png",
"ECU1": "/stickers/ECU01.png",
"ECU2": "/stickers/ECU03.png",
"ECU3": "/stickers/ECU04.png",
"ECU4": "/stickers/ECU19.png",
"ECU5": "/stickers/ECU17.png",
"ECU6": "/stickers/ECU18.png",
"ECU7": "/stickers/ECU20.png",
"ECU8": "/stickers/ECU15.png",
"ECU9": "/stickers/ECU14.png",
"ECU10": "/stickers/ECU13.png",
"ECU11": "/stickers/ECU12.png",
"ECU12": "/stickers/ECU11.png",
"ECU13": "/stickers/ECU02.png",
"ECU14": "/stickers/ECU16.png",
"ECU15": "/stickers/ECU10.png",
"ECU16": "/stickers/ECU09.png",
"ECU17": "/stickers/ECU08.png",
"ECU18": "/stickers/ECU07.png",
"ECU19": "/stickers/ECU06.png",
"ECU20": "/stickers/ECU05.png",
// EGY — fotos reales validadas visualmente
"EGY1": "/stickers/EGY1.jpg",
"ENG1": "/stickers/ENG01.png",
"ENG2": "/stickers/ENG03.png",
"ENG3": "/stickers/ENG04.png",
"ENG4": "/stickers/ENG06.png",
"ENG5": "/stickers/ENG05.png",
"ENG6": "/stickers/ENG07.png",
"ENG7": "/stickers/ENG08.png",
"ENG8": "/stickers/ENG09.png",
"ENG9": "/stickers/ENG10.png",
"ENG10": "/stickers/ENG13.png",
"ENG11": "/stickers/ENG19.png",
"ENG12": "/stickers/ENG11.png",
"ENG13": "/stickers/ENG02.png",
"ENG14": "/stickers/ENG12.png",
"ENG15": "/stickers/ENG18.png",
"ENG16": "/stickers/ENG17.png",
// SIN PNG DISPONIBLE - falta subir imagen para "ENG17"
"ENG18": "/stickers/ENG16.png",
"ENG19": "/stickers/ENG15.png",
"ENG20": "/stickers/ENG14.png",
"ESP1": "/stickers/ESP01.png",
"ESP2": "/stickers/ESP03.png",
"ESP3": "/stickers/ESP20.png",
"ESP4": "/stickers/ESP19.png",
"ESP5": "/stickers/ESP18.png",
"ESP6": "/stickers/ESP17.png",
"ESP7": "/stickers/ESP16.png",
"ESP8": "/stickers/ESP15.png",
"ESP9": "/stickers/ESP14.png",
"ESP10": "/stickers/ESP13.png",
"ESP11": "/stickers/ESP12.png",
"ESP12": "/stickers/ESP11.png",
"ESP13": "/stickers/ESP02.png",
"ESP14": "/stickers/ESP10.png",
"ESP15": "/stickers/ESP04.png",
"ESP16": "/stickers/ESP07.png",
"ESP17": "/stickers/ESP06.png",
"ESP18": "/stickers/ESP05.png",
"ESP19": "/stickers/ESP08.png",
"ESP20": "/stickers/ESP09.png",
"FRA1": "/stickers/FRA01.png",
"FRA2": "/stickers/FRA03.png",
"FRA3": "/stickers/FRA20.png",
"FRA4": "/stickers/FRA19.png",
"FRA5": "/stickers/FRA18.png",
"FRA6": "/stickers/FRA17.png",
"FRA7": "/stickers/FRA16.png",
"FRA8": "/stickers/FRA15.png",
"FRA9": "/stickers/FRA13.png",
"FRA10": "/stickers/FRA12.png",
"FRA11": "/stickers/FRA11.png",
"FRA12": "/stickers/FRA10.png",
"FRA13": "/stickers/FRA02.png",
"FRA14": "/stickers/FRA14.png",
"FRA15": "/stickers/FRA09.png",
"FRA16": "/stickers/FRA08.png",
"FRA17": "/stickers/FRA07.png",
"FRA18": "/stickers/FRA06.png",
"FRA19": "/stickers/FRA05.png",
"FRA20": "/stickers/FRA04.png",
"GER1": "/stickers/GER01.png",
"GER2": "/stickers/GER10.png",
"GER3": "/stickers/GER14.png",
// SIN PNG DISPONIBLE - falta subir imagen para "GER4"
"GER5": "/stickers/GER07.png",
"GER6": "/stickers/GER05.png",
// SIN PNG DISPONIBLE - falta subir imagen para "GER7"
"GER8": "/stickers/GER02.png",
"GER9": "/stickers/GER09.png",
// SIN PNG DISPONIBLE - falta subir imagen para "GER10"
"GER11": "/stickers/GER04.png",
"GER12": "/stickers/GER06.png",
// SIN PNG DISPONIBLE - falta subir imagen para "GER13"
"GER14": "/stickers/GER12.png",
"GER15": "/stickers/GER11.png",
"GER16": "/stickers/GER03.png",
"GER17": "/stickers/GER13.png",
// SIN PNG DISPONIBLE - falta subir imagen para "GER18"
// SIN PNG DISPONIBLE - falta subir imagen para "GER19"
"GER20": "/stickers/GER08.png",
// GHA — fotos reales validadas por nombre impreso
"GHA1": "/stickers/GHA1.jpg",
"GHA3": "/stickers/GHA3.jpg",
"GHA8": "/stickers/GHA8.jpg",
"GHA9": "/stickers/GHA20.jpg",
"GHA12": "/stickers/GHA17.jpg",
"GHA13": MISSING_STICKER, // GHA13.jpg no permite confirmar el nombre impreso con suficiente confianza
"GHA17": MISSING_STICKER, // GHA17.jpg contiene a Kamaldeen Sulemana, no a André Ayew
"GHA20": MISSING_STICKER, // GHA20.jpg contiene a Abdul Issahaku Fatawu, no a Antoine Semenyo

// HAI — sólo tarjetas originales de las fuentes entregadas; null muestra el código
"HAI1": "/haiti-original/HAI1.png",
"HAI2": "/haiti-original/HAI2.png",
"HAI3": "/haiti-original/HAI3.png",
"HAI4": "/haiti-original/HAI4.png",
"HAI5": "/haiti-original/HAI5.png",
"HAI6": "/haiti-original/HAI6.png",
"HAI7": "/haiti-original/HAI7.png",
"HAI8": null,
"HAI9": "/haiti-original/HAI9.png",
"HAI10": "/haiti-original/HAI10.png",
"HAI11": "/haiti-original/HAI11.png",
"HAI12": "/haiti-original/HAI12.png",
"HAI13": null,
"HAI14": "/haiti-original/HAI14.png",
"HAI15": "/haiti-original/HAI15.png",
"HAI16": "/haiti-original/HAI16.png",
"HAI17": "/haiti-original/HAI17.png",
"HAI18": "/haiti-original/HAI18.png",
"HAI19": "/haiti-original/HAI19.png",
"HAI20": "/haiti-original/HAI20.png",

// IRN — material real validado
"IRN1": "/stickers/IRN1.jpg",

// IRQ — fotos reales validadas por nombre impreso
"IRQ1": "/stickers/IRQ1.jpg",
"IRQ2": MISSING_STICKER, // IRQ2.jpg contiene a Youssef Amyn, no a Jalal Hassani
"IRQ3": "/stickers/IRQ14.jpg",
"IRQ4": "/stickers/IRQ4.jpg",
"IRQ5": "/stickers/IRQ17.jpg",
"IRQ7": "/stickers/IRQ7.jpg",
"IRQ9": MISSING_STICKER, // IRQ9.jpg contiene a Marko Farji, no a Zidane Iqbal
"IRQ14": "/stickers/IRQ2.jpg",
"IRQ15": "/stickers/IRQ15.jpg",
"IRQ16": "/stickers/IRQ9.jpg",
"IRQ17": MISSING_STICKER, // IRQ17.jpg contiene a Akam Hashem, no a Osama Rashid
"IRQ18": "/stickers/IRQ16.jpg",

// JOR — fotos reales validadas por nombre impreso
"JOR1": "/stickers/JOR1.jpg",
"JOR7": "/stickers/JOR7.jpg",
"JOR10": "/stickers/JOR20.jpg",
"JOR12": "/stickers/JOR16.jpg",
"JOR14": MISSING_STICKER, // JOR14.jpg contiene a Ali Olwan, no a Amer Jamous
"JOR15": MISSING_STICKER, // JOR15.jpg contiene a Yazan Al-Naimat, no a Mousa Al-Taamari
"JOR16": "/stickers/JOR15.jpg",
"JOR18": "/stickers/JOR14.jpg",
"JOR20": MISSING_STICKER, // JOR20.jpg contiene a Nizar Al-Rashdan, no a Ibrahim Sabra
"JPN1": "/stickers/JPN01.png",
"JPN2": "/stickers/JPN12.png",
"JPN3": "/stickers/JPN13.png",
"JPN4": "/stickers/JPN14.png",
"JPN5": "/stickers/JPN15.png",
"JPN6": "/stickers/JPN19.png",
"JPN7": "/stickers/JPN20.png",
"JPN8": "/stickers/JPN16.png",
"JPN9": "/stickers/JPN17.png",
"JPN10": "/stickers/JPN18.png",
"JPN11": "/stickers/JPN06.png",
"JPN12": "/stickers/JPN05.png",
"JPN13": "/stickers/JPN02.png",
"JPN14": "/stickers/JPN03.png",
"JPN15": "/stickers/JPN04.png",
"JPN16": "/stickers/JPN07.png",
"JPN17": "/stickers/JPN08.png",
"JPN18": "/stickers/JPN09.png",
"JPN19": "/stickers/JPN10.png",
"JPN20": "/stickers/JPN11.png",
"KOR1": "/korea/KOR1.png",
"KOR2": "/korea/KOR2.png",
"KOR3": "/korea/KOR3.png",
"KOR4": "/korea/KOR4.png",
"KOR5": "/korea/KOR5.png",
"KOR6": "/korea/KOR6.png",
"KOR7": "/korea/KOR7.png",
"KOR8": null,
"KOR9": "/korea/KOR9.png",
"KOR10": "/korea/KOR10.png",
"KOR11": "/korea/KOR11.png",
"KOR12": "/korea/KOR12.png",
"KOR13": null,
"KOR14": "/korea/KOR14.png",
"KOR15": "/korea/KOR15.png",
"KOR16": null,
"KOR17": "/korea/KOR17.png",
"KOR18": "/korea/KOR18.png",
"KOR19": "/korea/KOR19.png",
"KOR20": "/korea/KOR20.png",
// KSA — fotos reales validadas por nombre impreso
"KSA1": "/stickers/KSA1.jpg",
"KSA4": "/stickers/KSA8.jpg",
"KSA7": MISSING_STICKER, // KSA7.jpg contiene a Abdullah Alkhaibari, no a Moteb Alharbi
"KSA8": MISSING_STICKER, // KSA8.jpg contiene a Saud Abdulhamid, no a Hassan Altambakti
"KSA9": "/stickers/KSA16.jpg",
"KSA11": "/stickers/KSA7.jpg",
"KSA14": "/stickers/KSA14.jpg",
"KSA15": "/stickers/KSA15.jpg",
"KSA16": "/stickers/KSA20.jpg",
"KSA18": MISSING_STICKER, // KSA18.jpg contiene a Mohamed Amine Tougai (Argelia)
"KSA19": "/stickers/KSA19.jpg",
"KSA20": MISSING_STICKER, // KSA20.jpg contiene a Salem Aldawsari, no a Abdullah Alhamdan
// MAR — sólo tarjetas originales de las fuentes entregadas; null muestra el código
"MAR1": "/morocco-original/MAR1.png",
"MAR2": "/morocco-original/MAR2.png",
"MAR3": null,
"MAR4": "/morocco-original/MAR4.png",
"MAR5": "/morocco-original/MAR5.png",
"MAR6": "/morocco-original/MAR6.png",
"MAR7": "/morocco-original/MAR7.png",
"MAR8": "/morocco-original/MAR8.png",
"MAR9": "/morocco-original/MAR9.png",
"MAR10": "/morocco-original/MAR10.png",
"MAR11": null,
"MAR12": "/morocco-original/MAR12.png",
"MAR13": "/morocco-original/MAR13.png",
"MAR14": "/morocco-original/MAR14.png",
"MAR15": "/morocco-original/MAR15.png",
"MAR16": "/morocco-original/MAR16.png",
"MAR17": "/morocco-original/MAR17.png",
"MAR18": null,
"MAR19": "/morocco-original/MAR19.png",
"MAR20": "/morocco-original/MAR20.png",
"MEX1": "/stickers/MEX01.png",
"MEX2": "/stickers/MEX03.png",
"MEX3": "/stickers/MEX05.png",
"MEX4": "/stickers/MEX08.png",
"MEX5": "/stickers/MEX06.png",
"MEX6": "/stickers/MEX04.png",
"MEX7": "/stickers/MEX07.png",
"MEX8": "/stickers/MEX10.png",
"MEX9": "/stickers/MEX13.png",
"MEX10": "/stickers/MEX11.png",
"MEX11": "/stickers/MEX09.png",
"MEX12": "/stickers/MEX14.png",
"MEX13": "/stickers/MEX02.png",
"MEX14": "/stickers/MEX12.png",
"MEX15": "/stickers/MEX17.png",
"MEX16": "/stickers/MEX16.png",
"MEX17": "/stickers/MEX15.png",
"MEX18": "/stickers/MEX18.png",
"MEX19": "/stickers/MEX20.png",
"MEX20": "/stickers/MEX19.png",
"NED1": "/stickers/NED01.png",
"NED2": "/stickers/NED03.png",
"NED3": "/stickers/NED15.png",
"NED4": "/stickers/NED16.png",
"NED5": "/stickers/NED18.png",
"NED6": "/stickers/NED13.png",
"NED7": "/stickers/NED19.png",
"NED8": "/stickers/NED17.png",
"NED9": "/stickers/NED14.png",
"NED10": "/stickers/NED10.png",
"NED11": "/stickers/NED09.png",
"NED12": "/stickers/NED11.png",
"NED13": "/stickers/NED02.png",
"NED14": "/stickers/NED12.png",
"NED15": "/stickers/NED08.png",
"NED16": "/stickers/NED07.png",
"NED17": "/stickers/NED04.png",
"NED18": "/stickers/NED05.png",
"NED19": "/stickers/NED06.png",
"NED20": "/stickers/NED20.png",
// NOR — fotos reales validadas por nombre impreso
"NOR1": "/stickers/NOR1.jpg",
"NOR2": MISSING_STICKER, // NOR2.jpg contiene a Kristoffer Vassbakk Ajer, no a Ørjan Nyland
"NOR3": "/stickers/NOR20.jpg",
"NOR5": "/stickers/NOR2.jpg",
"NOR6": "/stickers/NOR18.jpg",
"NOR8": "/stickers/NOR19.jpg",
"NOR9": "/stickers/NOR8.jpg",
"NOR11": "/stickers/NOR3.jpg",
"NOR12": "/stickers/NOR12.jpg",
"NOR13": MISSING_STICKER, // NOR13.jpg no pudo identificarse con suficiente confianza
"NOR14": "/stickers/NOR11.jpg",
"NOR15": MISSING_STICKER, // NOR15.jpg no pudo identificarse con suficiente confianza
"NOR17": "/stickers/NOR5.jpg",
"NOR18": MISSING_STICKER, // NOR18.jpg contiene a Marcus Holmgren Pedersen, no a Jørgen Strand Larsen
"NOR19": MISSING_STICKER, // NOR19.jpg contiene a Torbjørn Heggem, no a Antonio Nusa
"NOR20": MISSING_STICKER, // NOR20.jpg contiene a Julian Ryerson, no a Oscar Bobb

// NZL — material real validado
"NZL1": "/stickers/NZL1.jpg",

// PAN — fotos reales validadas por nombre impreso
"PAN1": "/stickers/PAN1.jpg",
"PAN4": "/stickers/PAN7.jpg",
"PAN6": "/stickers/PAN20.jpg",
"PAN7": MISSING_STICKER, // PAN7.jpg contiene a Fidel Escobar, no a Eric Davis
"PAN9": "/stickers/PAN4.jpg",
"PAN10": "/stickers/PAN10.jpg",
"PAN14": "/stickers/PAN14.jpg",
"PAN15": "/stickers/PAN15.jpg",
"PAN18": MISSING_STICKER, // PAN18.jpg contiene a José Luis Rodríguez, no a Cecilio Waterman
"PAN19": "/stickers/PAN18.jpg",
"PAN20": "/stickers/PAN19.jpg",

// PAR — originales validados en los PDF del álbum
"PAR1": "/paraguay-original/PAR1.png",
"PAR2": "/paraguay-original/PAR2.png",
"PAR3": "/paraguay-original/PAR3.png",
"PAR4": "/paraguay-original/PAR4.png",
"PAR5": "/paraguay-original/PAR5.png",
"PAR6": "/paraguay-original/PAR6.png",
"PAR7": "/paraguay-original/PAR7.png",
"PAR8": "/paraguay-original/PAR8.png",
"PAR9": "/paraguay-original/PAR9.png",
"PAR10": "/paraguay-original/PAR10.png",
"PAR11": "/paraguay-original/PAR11.png",
"PAR12": "/paraguay-original/PAR12.png",
"PAR13": MISSING_STICKER,
"PAR14": "/paraguay-original/PAR14.png",
"PAR15": "/paraguay-original/PAR15.png",
"PAR16": MISSING_STICKER,
"PAR17": "/paraguay-original/PAR17.png",
"PAR18": "/paraguay-original/PAR18.png",
"PAR19": "/paraguay-original/PAR19.png",
"PAR20": "/paraguay-original/PAR20.png",
"POR1": "/stickers/POR01.png",
"POR2": "/stickers/POR03.png",
"POR3": "/stickers/POR17.png",
"POR4": "/stickers/POR16.png",
"POR5": "/stickers/POR15.png",
"POR6": "/stickers/POR14.png",
"POR7": "/stickers/POR13.png",
"POR8": "/stickers/POR12.png",
"POR9": "/stickers/POR11.png",
"POR10": "/stickers/POR10.png",
"POR11": "/stickers/POR09.png",
"POR12": "/stickers/POR08.png",
"POR13": "/stickers/POR02.png",
"POR14": "/stickers/POR07.png",
"POR15": "/stickers/POR04.png",
"POR16": "/stickers/POR06.png",
"POR17": "/stickers/POR05.png",
"POR18": "/stickers/POR20.png",
"POR19": "/stickers/POR19.png",
"POR20": "/stickers/POR18.png",
// QAT — PDF oficial Panini 2026, pág. 10. Solo láminas completas; null = sin lámina (tarjeta con código).
"QAT1": "/qatar/QAT1.png", // Qatar Crest (escudo QFA)
"QAT2": "/qatar/QAT2.png", // Meshaal Barsham
"QAT3": "/qatar/QAT3.png", // Sultan Albrake
"QAT4": null, // Lucas Mendes — sin lámina
"QAT5": null, // Homam Ahmed — sin lámina (desmapeado QAT5.jpg de internet)
"QAT6": "/qatar/QAT6.png", // Boualem Khoukhi
"QAT7": "/qatar/QAT7.png", // Pedro Miguel
"QAT8": null, // Tarek Salman — sin lámina
"QAT9": "/qatar/QAT9.png", // Mohammed Mannai
"QAT10": "/qatar/QAT10.png", // Karim Boudiaf
"QAT11": "/qatar/QAT11.png", // Assim Madibo
"QAT12": null, // Hamed Fatehi — sin lámina
"QAT13": null, // Foto selección Qatar — sin lámina
"QAT14": null, // Mohammed Waad — sin lámina
"QAT15": null, // Abdulaziz Hatem — sin lámina
"QAT16": null, // Hassan Al-Haydos — sin lámina
"QAT17": "/qatar/QAT17.png", // Edmílson Junior
"QAT18": "/qatar/QAT18.png", // Akram Hassan Afif
"QAT19": "/qatar/QAT19.png", // Ahmed Al-Ganehi
"QAT20": "/qatar/QAT20.png", // Almoez Ali
// RSA — fotos reales validadas por nombre impreso
"RSA1": "/stickers/RSA01.png",
"RSA2": MISSING_STICKER, // RSA02.png no pudo identificarse con suficiente confianza
"RSA3": "/stickers/RSA03.png",
"RSA4": "/stickers/RSA14.png",
"RSA5": "/stickers/RSA04.png",
"RSA6": "/stickers/RSA15.png",
"RSA7": MISSING_STICKER, // RSA07.png contiene a Thalente Mbatha, no a Khulumani Ndamane
"RSA8": MISSING_STICKER, // RSA08.png contiene a Bathusi Aubaas, no a Siyabonga Ngezana
"RSA9": "/stickers/RSA05.png",
"RSA10": MISSING_STICKER, // RSA10.png contiene a Oswin Appollis, no a Nkosinathi Sibisi
"RSA11": "/stickers/RSA06.png",
"RSA12": "/stickers/RSA07.png",
"RSA13": "/stickers/RSA13.jpg",
"RSA14": "/stickers/RSA08.png",
"RSA15": MISSING_STICKER, // RSA15.png contiene a Mbekezeli Mbokazi, no a Yaya Sithole
"RSA16": "/stickers/RSA12.png",
"RSA17": "/stickers/RSA11.png",
"RSA18": "/stickers/RSA09.png",
"RSA19": "/stickers/RSA13.png",
"RSA20": "/stickers/RSA10.png",
// SCO — 19 láminas originales validadas en los dos PDF entregados.
"SCO1": "/scotland-original/SCO1.png",
"SCO2": "/scotland-original/SCO2.png",
"SCO3": "/scotland-original/SCO3.png",
"SCO4": "/scotland-original/SCO4.png",
"SCO5": "/scotland-original/SCO5.png",
"SCO6": "/scotland-original/SCO6.png",
"SCO7": "/scotland-original/SCO7.png",
"SCO8": "/scotland-original/SCO8.png",
"SCO9": "/scotland-original/SCO9.png",
"SCO10": "/scotland-original/SCO10.png",
"SCO11": "/scotland-original/SCO11.png",
"SCO12": "/scotland-original/SCO12.png",
"SCO13": null,
"SCO14": "/scotland-original/SCO14.png",
"SCO15": "/scotland-original/SCO15.png",
"SCO16": "/scotland-original/SCO16.png",
"SCO17": "/scotland-original/SCO17.png",
"SCO18": "/scotland-original/SCO18.png",
"SCO19": "/scotland-original/SCO19.png",
"SCO20": "/scotland-original/SCO20.png",
"SEN1": "/stickers/SEN01.png",
"SEN2": "/stickers/SEN03.png",
"SEN3": "/stickers/SEN04.png",
"SEN4": "/stickers/SEN05.png",
"SEN5": "/stickers/SEN06.png",
"SEN6": "/stickers/SEN07.png",
"SEN7": "/stickers/SEN08.png",
"SEN8": "/stickers/SEN09.png",
"SEN9": "/stickers/SEN10.png",
"SEN10": "/stickers/SEN11.png",
"SEN11": "/stickers/SEN12.png",
"SEN12": "/stickers/SEN13.png",
"SEN13": "/stickers/SEN02.png",
"SEN14": "/stickers/SEN14.png",
"SEN15": "/stickers/SEN15.png",
"SEN16": "/stickers/SEN16.png",
"SEN17": "/stickers/SEN17.png",
"SEN18": "/stickers/SEN18.png",
"SEN19": "/stickers/SEN19.png",
"SEN20": "/stickers/SEN20.png",
// SUI — fotos reales validadas por nombre impreso (álbum, 16 láminas). null = sin lámina.
"SUI1": "/switzerland/SUI01.jpg", // Switzerland Crest
"SUI2": "/switzerland/SUI02.jpg", // Gregor Kobel
"SUI3": null, // Yvon Mvogo — sin lámina
"SUI4": "/switzerland/SUI10.jpg", // Manuel Akanji
"SUI5": "/switzerland/SUI03.jpg", // Ricardo Rodríguez
"SUI6": "/switzerland/SUI13.jpg", // Nico Elvedi
"SUI7": "/switzerland/SUI08.jpg", // Aurèle Amenda
"SUI8": "/switzerland/SUI16.jpg", // Silvan Widmer
"SUI9": "/switzerland/SUI06.jpg", // Granit Xhaka
"SUI10": "/switzerland/SUI09.jpg", // Denis Zakaria
"SUI11": "/switzerland/SUI14.jpg", // Remo Freuler
"SUI12": "/switzerland/SUI07.jpg", // Fabian Rieder
"SUI13": null, // Switzerland (foto selección) — sin lámina
"SUI14": null, // Ardon Jashari — sin lámina
"SUI15": "/switzerland/SUI12.jpg", // Johan Manzambi
"SUI16": "/switzerland/SUI04.jpg", // Michel Aebischer
"SUI17": null, // Breel Embolo — sin lámina
"SUI18": "/switzerland/SUI05.jpg", // Rubén Vargas
"SUI19": "/switzerland/SUI11.jpg", // Dan Ndoye
"SUI20": "/switzerland/SUI15.jpg", // Zeki Amdouni

// SWE — material real validado
"SWE1": "/stickers/SWE1.jpg",

// TUN — material real validado
"TUN1": "/stickers/TUN1.jpg",

// URU — fotos reales validadas por nombre impreso
"URU1": "/stickers/URU1.jpg",
"URU3": "/stickers/URU3.jpg",
"URU5": "/stickers/URU14.jpg",
"URU6": MISSING_STICKER, // URU6.jpg contiene a Nahitan Nández, no a Sebastián Cáceres
"URU7": MISSING_STICKER, // URU7.jpg contiene a Maxi Araújo, no a Mathías Olivera
"URU8": "/stickers/URU12.jpg",
"URU9": "/stickers/URU6.jpg",
"URU10": "/stickers/URU17.jpg",
"URU12": MISSING_STICKER, // URU12.jpg contiene a Guillermo Varela, no a Rodrigo Bentancur
"URU14": "/stickers/URU15.jpg",
"URU15": MISSING_STICKER, // URU15.jpg contiene a Manuel Ugarte, no a Nicolás de la Cruz
"URU16": "/stickers/URU7.jpg",
"URU17": MISSING_STICKER, // URU17.jpg contiene a Federico Valverde, no a Darwin Núñez
"URU19": MISSING_STICKER, // URU19.jpg no pudo identificarse con suficiente confianza
"URU20": MISSING_STICKER, // URU20.jpg no pudo identificarse con suficiente confianza

// USA — originales validados en los PDF del álbum
"USA1": "/usa-original/USA1.png",
"USA2": "/usa-original/USA2.png",
"USA3": "/usa-original/USA3.png",
"USA4": "/usa-original/USA4.png",
"USA5": "/usa-original/USA5.png",
"USA6": "/usa-original/USA6.png",
"USA7": "/usa-original/USA7.png",
"USA8": "/usa-original/USA8.png",
"USA9": "/usa-original/USA9.png",
"USA10": "/usa-original/USA10.png",
"USA11": "/usa-original/USA11.png",
"USA12": "/usa-original/USA12.png",
"USA13": MISSING_STICKER,
"USA14": "/usa-original/USA14.png",
"USA15": "/usa-original/USA15.png",
"USA16": "/usa-original/USA16.png",
"USA17": "/usa-original/USA17.png",
"USA18": "/usa-original/USA18.png",
"USA19": MISSING_STICKER,
"USA20": "/usa-original/USA20.png",
// UZB — fotos reales validadas por nombre impreso
"UZB1": "/stickers/UZB1.jpg",
"UZB3": "/stickers/UZB20.jpg",
"UZB4": MISSING_STICKER, // UZB4.jpg contiene a Rustam Ashurmatov, no a Sherzod Nasrullaev
"UZB5": "/stickers/UZB5.jpg",
"UZB7": "/stickers/UZB4.jpg",
"UZB8": "/stickers/UZB8.jpg",
"UZB12": "/stickers/UZB16.jpg",
"UZB15": "/stickers/UZB3.jpg",
"UZB16": MISSING_STICKER, // UZB16.jpg contiene a Jamshid Iskanderov, no a Eldor Shomurodov
"UZB17": MISSING_STICKER, // UZB17.jpg contiene a Jaloliddin Masharipov, no a Oston Urunov
"UZB18": "/stickers/UZB17.jpg",
"UZB20": "/stickers/UZB18.jpg"
}
