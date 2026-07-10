# Auditoría final de fotografías

Fecha: 9 de julio de 2026

## Resumen

- Códigos con foto pendiente confirmada: **59**
- Imágenes descartadas por correspondencia incorrecta o no verificable: **41**
- Archivos nunca incorporados al mapeo: **18**

## 1. Imágenes descartadas o no verificables (41)

### COD
COD5, COD7

### CRO
CRO3, CRO5, CRO9

### GHA
GHA13, GHA17, GHA20

### IRQ
IRQ2, IRQ9, IRQ17

### JOR
JOR14, JOR15, JOR20

### KSA
KSA7, KSA8, KSA18, KSA20

### NOR
NOR2, NOR13, NOR15, NOR18, NOR19, NOR20

### PAN
PAN7, PAN18

### RSA
RSA2, RSA7, RSA8, RSA10, RSA15

### URU
URU6, URU7, URU12, URU15, URU17, URU19, URU20

### UZB
UZB4, UZB16, UZB17

## 2. Archivos no incorporados al mapeo (18)

### ENG
ENG17

### GER
GER4, GER7, GER10, GER13, GER18, GER19

### KOR
KOR4, KOR8, KOR11, KOR13, KOR16, KOR17

### MAR
MAR3, MAR4, MAR5, MAR11, MAR18

## Criterio de cierre

Cada código puede pasar a estado terminado únicamente cuando se confirme:

1. Código oficial de la figurita.
2. Nombre impreso correcto.
3. Selección correcta.
4. Archivo de imagen cargado en `public/stickers`.
5. Entrada correcta en `src/stickerAssets.js`.
6. Compilación Vercel en estado `READY`.

No se debe reutilizar una imagen solo porque el nombre del archivo coincide con el código si el jugador impreso no corresponde.
