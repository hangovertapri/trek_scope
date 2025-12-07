# Permit & Safety Reference

## Nepal Trekking Permits

### TIMS (Trekkers' Information Management System)

**Purpose:** Track foreign trekkers, manage rescue operations.

**Cost:** 
- Individual trekker: USD $10–20 (depending on duration)
- Group rate: Varies by tour operator

**Duration:** Valid for trek duration; issued per trek
- Same permit covers both walking and accommodation days

**Required for:**
- Nearly all trekking regions in Nepal
- Some lower-altitude treks may be exempt

**How to obtain:**
1. Through registered trekking agency
2. At NMA (Nepal Mountaineering Association) office in Kathmandu
3. Hotels in major trekking towns (Pokhara, Kathmandu)

**Documents needed:**
- Passport copy
- One passport photo
- Filled trekking form

---

### Restricted Area Permits (RAP)

**Regions requiring RAP:**
- Upper Mustang
- Upper Dolpo
- Makalu Base Camp
- Kanchenjunga Base Camp
- Manaslu Circuit
- Other remote/border regions

**Cost:** USD $10–15/day (varies by region)

**Validity:** Specific region & dates; must trek with licensed guide

**License requirements:**
- Licensed guide + porter standard for restricted areas
- Some agencies bundle guide hire with permit

**Approval time:** 3–5 days from application

---

### ACAP (Annapurna Conservation Area Permit)

**Regions:** All Annapurna treks (ABC, Annapurna Circuit, Mardi Himal, etc.)

**Cost:** USD $30–100 (varies)

**Type of fee:** Donation/entry fee; supports local conservation

**Validity:** Entire trek duration

**Obtained through:**
- ACAP office in Kathmandu or Pokhara
- Trekking agencies
- Entry gates to the conservation area

---

### Everest Region Permits

**TIMS Required:** Yes (standard)

**SAGarMATHA Permit:** Some lodges/areas charge small fee (≈ USD $5–10)

**No specific Regional permit:** Most of Everest region is part of SAGARMATHA National Park (covered by normal trekking fees)

---

## Altitude-Related Health & Safety

### Acute Mountain Sickness (AMS)

**Symptoms:**
- Headache
- Nausea / vomiting
- Fatigue / weakness
- Shortness of breath

**Prevention:**
- Gradual acclimatization: ascend slowly (max 300–500m/day above 2500m)
- Stay hydrated: drink 3–4L water daily
- Avoid alcohol first 2 days at altitude
- Get good sleep at each camp

**Management:**
- Descend immediately if symptoms worsen
- Take Diamox (prescription, consult doctor before trek)
- Rest and hydrate if mild

**High-Risk Treks (>4000m):**
- Everest Base Camp (5364m)
- Annapurna Circuit (5416m)
- Manaslu (5160m)
- Kanchenjunga BC (5143m)
- Makalu BC (5200m)

---

### HACE (High Altitude Cerebral Edema) & HAPE (High Altitude Pulmonary Edema)

**Critical: Descend immediately if symptoms present**

**HACE signs:** Confusion, loss of coordination, severe headache → DESCEND
**HAPE signs:** Breathlessness at rest, chest tightness, pink frothy sputum → DESCEND

**Prevention:** Same as AMS; avoid over-exertion

---

## Weather & Seasonal Safety

### Best Trekking Seasons

| Season | Months | Features | Treks |
|--------|--------|----------|-------|
| **Spring** | Mar–May | Clear skies, rhododendrons, warm temps | Most high-altitude treks |
| **Autumn** | Sep–Nov | Best visibility, stable weather, dry trails | Most popular season |
| **Winter** | Dec–Feb | Cold, possible snow on passes, fewer trekkers | Lower-altitude treks (Langtang, ABC) |
| **Monsoon** | Jun–Aug | Wet, leeches, cloud cover | Not recommended for high-altitude |

### Weather Hazards

**Flash Floods:** Possible in monsoon; avoid glacier crossings during warm afternoons
**Rockfall:** Common in exposed sections; move quickly through danger zones
**Glacial Crevasses:** Rope up on glacier treks; hire guides
**Lightning:** Avoid peaks during thunderstorms; descend early if clouds form

---

## Trekking Safety Best Practices

### Before the Trek

- [ ] Get travel insurance covering high-altitude trekking & evacuation
- [ ] Consult doctor; get vaccinations (Hepatitis A, Typhoid, Japanese Encephalitis)
- [ ] Carry prescription medications in original bottles
- [ ] Inform someone of your itinerary
- [ ] Verify guide credentials with agency

### During the Trek

- [ ] "Pole Pole" (slowly, slowly) — avoid rushing ascents
- [ ] Eat regularly; high-calorie foods help with altitude
- [ ] Wear sun protection (SPF 50+, hat, sunglasses)
- [ ] Watch for signs of AMS; communicate with guide
- [ ] Stick to marked trails; hire guides in remote areas
- [ ] Respect local culture & environment

### Emergency Contacts

- **Police:** 100
- **Ambulance:** 102
- **Tourism Police (Kathmandu):** +977-1-4247041
- **SOS (Mountain Rescue):** +977-1-4436873 or call insurance provider

---

## Data Schema Mapping

Trek object should include:

```json
{
  "permit_required": true/false,
  "permit_type": "TIMS" | "RAP" | "ACAP" | "None",
  "permit_cost": 20,
  "altitude": 5364,
  "best_season": ["Spring (Mar-May)", "Autumn (Sep-Nov)"],
  "safety_tips": [
    "Acclimatize properly",
    "Hydrate well",
    "Watch for altitude sickness symptoms"
  ],
  "ams_risk": "Moderate" | "High" | "Low"
}
```

---

## Regional Notes

- **Khumbu (Everest):** High altitude, excellent permits & infrastructure; guides readily available
- **Annapurna:** Popular, well-marked; variable weather; ACAP fee applies
- **Manaslu:** Remote, permit-only; requires licensed guide
- **Mustang:** Very restricted; high permit cost; unique Tibetan culture
- **Dolpo:** Most remote; expert-only; logistics challenging

