# Atma · Ambisonic Vessels

A living field kit of glowing mason jars that decode ambisonic sound locally and bathe forests, domes, and rituals in responsive audio.

---

## Hero Story
**Eyebrow:** Prototype 0.9 · Hand-built in Mendocino · Ambisonic field kit  
**Headline:** Atma Ambisonic Vessels  
**Subhead:** Distributed immersive audio lives inside a mason jar. Map glowing sound to forests, domes, and rituals without scaffolding or cables.

**Supporting bullets:**
- **Distributed:** Each vessel decodes its own slice of the ambisonic field.
- **Sculptable:** Sync AI ambience, FOA stems, or sensor-triggered scenes.
- **Field-ready:** Weather-tolerant lids, USB-C PD power, carry-on cases.

**Primary CTA:** Reserve Prototype – $99 (Stripe Checkout)  
**Secondary CTA:** Download Prototype Brief (links to this file)  
**Tertiary CTA:** Preview concept renders (jumps to gallery)

Hero render notes: glowing jars breathing in a redwood grove at dusk, teal/amber gradients, soft fog, firefly bloom.

---

## What Is Atma?
Atma is a networked ambisonic speaker disguised as a lantern. Each vessel hides a dual-driver isobaric stack, ESP32 brain, and weather-ready enclosure. Multiple jars synchronize wirelessly to paint a living sound field indoors or outdoors.

Key proof points:
- Dual-driver core: opposed 2" 15 W drivers deliver low-end within a jar footprint.
- Isomorphic scenes: author once and deploy to trails, domes, or rituals with zone-aware fades.
- Open toolkit: Wi-Fi/UDP sync, sensor hooks, and scene templates in a single Pelican case.

---

## Why Ambisonics?
FOA (First-Order Ambisonics) encodes the entire 3D soundfield into WXYZ channels so a single stream can power dozens of jars without a central speaker array.

Benefits:
- Phase-coherent drift as textures move jar to jar.
- Swap scenes without rewiring the layout.
- Ready for higher-order or AR overlays.

**Signal Chain:** Encode (DAW/phone/AI) → Distribute (Wi-Fi UDP multicast + timestamps) → Render (per-jar DSP to dual drivers).

---

## Why a Mason Jar?
The wide-mouth mason jar is iconic, airtight, and acoustically predictable. It protects electronics, diffuses LEDs, and belongs naturally in forests or sanctuaries.

- **Lantern lineage:** Tea lanterns, fireflies, and ritual vessels inspire the glowing aesthetic.
- **Durable shell:** Gasketed lid, stainless hardware, and internal baffles defend against weather and curious hands.
- **Acoustic benefit:** Cylindrical volume supports opposing drivers for noise cancellation and deep bass.

---

## How It Works — Three Steps
1. **Capture or generate.** Field recordings, DAW stems, or AI engines produce an ambisonic or stereo source.
2. **Transmit across the mesh.** Wi-Fi UDP multicast (or ESP-NOW) moves the FOA stream and control packets to every jar.
3. **Render inside each vessel.** ESP32-S3 decodes coefficients, applies EQ/limiting, and outputs through the dual drivers.

Supporting details:
- Network layer: UDP multicast audio + timestamps, control plane via ESP-NOW/unicast, 10–30 ms jitter buffer.
- DSP per node: FOA decode → biquad EQ → limiter, sensors (BME688/IMU), I²S into TAS5805M.
- Creative tools: scene packs for forest/gallery/ritual, scheduling, zone-aware fades, map editor.

---

## Key Features
1. **Forest deployable.** Stake, hang, or hide jars; mesh lid + gasket keep them weather ready.
2. **Ambisonic spatial audio.** FOA decoding per jar keeps voices/textures drifting naturally.
3. **Wi-Fi synchronization.** UDP multicast with timestamps ensures phase-coherent playback.
4. **Bluetooth + app input.** Stream from phone or route stems from Ableton/Unreal.
5. **Local DSP + sensing.** EQ, limiter, LEDs, and sensors react to weather, breath, or touch.
6. **USB-C PD power.** Standard PD triggers negotiate 12 V for the amp and regulate MCU rails.

---

## Scenarios
**Indoors**
- Meditation domes with breathing cues orbiting the room.
- Ambient AI-generated sound layered with live instruments.
- Spatial music residencies and gallery corridors.
- Dynamic lighting + audio rituals for hospitality suites.

**Outdoors**
- Forest installations mapped across multi-acre trails.
- Map-based storytelling that guides guests via sound sprites.
- Weather-reactive soundscapes using BME688 + wind cues.
- “Spirits” hopping from jar to jar during rituals/night walks.

---

## Bill of Materials
### Prototype BOM (M5Stack-based)
| Subsystem      | Components |
| -------------- | ---------- |
| Core controller | M5Stack Core S3 Lite |
| Audio IO | M5 audio module + I²S amplifier |
| Drivers | Dual 2" 15 W isobaric drivers |
| DSP (optional) | ADAU1701 breakout |
| Sensing | BME688 air + forest sensing |
| Enclosure | Mesh lid, wide-mouth jar, gasket, stainless hardware |
| Power | USB-C PD trigger → 12 V rail |

### Production BOM (custom PCB)
| Subsystem | Components |
| --------- | ---------- |
| MCU | ESP32-S3 |
| Amplifier | TAS5805M Class-D |
| DSP tier | ADAU1701 or firmware-only mode |
| Power | USB-C PD trigger (12 V) + regulation |
| Interaction | Custom flex with touch ring + LED halo |
| Protection | Waterproof cage + tuned acoustic chamber |
| Connectivity | Wi-Fi mesh, UDP sync, optional LTE uplink |

---

## Development Roadmap
- **0.9 Prototype (now):** M5Stack electronics, isobaric speaker, outdoor-safe lid, basic Wi-Fi streaming.
- **1.0 Production:** Custom PCB, ESP32-S3 + TAS5805M, USB-C PD 12 V, integrated DSP, waterproofing, LED ambiance, multi-speaker mesh networking.
- **1.1+ Future:** Phone-based spatial positioning, weather-reactive audio, AR placement (WorkAdventure), wandering “spirit” sound FX between nodes.

---

## Gallery Prompts
1. **Forest dusk render:** Five jars glowing teal/amber under redwoods, foggy light, thin mandala overlay.
2. **Living room lifestyle:** Circular arrangement in a loft or wellness studio with soft gradients and textile textures.
3. **Desk vignette / exploded view:** Components hovering above the jar lid showing isobaric drivers, PCB, PD trigger.

Include subtle mandala line art, circular motifs, and gradients (indigo → gold → teal).

---

## Interest CTA
“Want an Atma vessel for your home, studio, or forest? Join the early list.”  
Collect email + optional use case; share updates 2–3 times per month; offer alternate contact via hello@atma.audio.
