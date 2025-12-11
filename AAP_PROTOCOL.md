# Atma Ambisonics Protocol (AAP)

A lightweight, ESP32-class friendly stack for distributing and rendering high-order ambisonic (HOA) fields across Atma Vessels (glowing mason-jar speakers). This document formalizes the conceptual layers, transport, control, discovery, audio encoding, and proprietary differentiators that turn Atma into a deploy-anywhere spatial sound network.

---

## 1. Conceptual Model · Distributed HOA Renderer

Every Atma Vessel subscribes to the same global HOA stream and renders its slice of the field locally.

| Component | Responsibility |
| --- | --- |
| Global HOA source | DAW, phone app, or scene engine generating FOA/SOA stems |
| Atma Vessel | ESP32-S3 brain, local DSP, dual-driver output inside a mason jar |
| Forest/Room topology | Arbitrary placement; vessels know (x, y, z) + yaw/pitch/roll |
| Faerie/spirit layer | Lightweight effect cues traveling between nodes |

**Key advantages**
- Scaling: single HOA stream replaces N mono feeds.
- Adaptability: node-local rotation + rendering modes (`near-field`, `diffuse`, `faerie`).
- Interactivity: OSC/MQTT events trigger per-node gestures without additional audio bandwidth.

---

## 2. Transport Layer · Mix-and-Match Options

### A. AAP-UDP (Default Audio Plane)

- **Medium:** UDP multicast/unicast (IPv4) with optional encryption wrapper.
- **Packet layout:** `| magic:'AAP1' | seq:u32 | timestamp:u64 | frameIndex:u16 | payload |`
- **Payload:** Opus ambisonic frame (preferred) or PCM/ADPCM block.
- **Reliability:** Stateless; vessels maintain jitter buffer (20–60 ms) keyed off `timestamp`.
- **Why:** Lowest latency, tolerant of outdoor mesh Wi-Fi, simple to implement on ESP32-S3.

### B. OSC Control Plane

- **Protocol:** Open Sound Control over UDP (default) or TCP (studio mode).
- **Namespace examples:**
  - `/atma/pos/set f f f` → absolute meters.
  - `/atma/ori/set f f f` → yaw, pitch, roll in radians.
  - `/atma/mode s` → `ambient`, `narrative`, `faerie`, etc.
  - `/atma/effect s f f f` → effect type + parameters.
- **Use cases:** Quick tuning from DAWs, phone app scene changes, spatial event triggers.

### C. MQTT-SN (Optional Mesh Plane)

- **Transport:** MQTT-SN over Wi-Fi mesh, BLE mesh, or LoRa for large forests.
- **Topics:** `atma/announce/<nodeID>`, `atma/state/<nodeID>`, `atma/effects/<zone>`.
- **Role:** Low-bandwidth telemetry + narrative cues (“faerie moves west→east”).

---

## 3. Control & Discovery Layer

### Discovery
- **Mechanism:** mDNS/Bonjour advertisement `_atma._udp.local`.
- **TXT fields:** `nodeID`, `capabilities` (e.g., `hoa2,led,solar`), `fw`, `profile`.
- **Consumers:** Phone app, Core S3-lite hub, provisioning tools.

### Session Negotiation
1. Controller discovers vessels via mDNS.
2. OSC `/atma/hello` exchanges capabilities and desired HOA profile.
3. Vessel replies with MQTT-SN topic hints or direct UDP endpoint.

### Time Sync
- Lightweight PTP-style exchange piggybacks on `AAP1` timestamps.
- Optional GPS/RTC discipline for solar deployments.

---

## 4. Audio Encoding & Rendering

### HOA Profiles

| Profile | Order | Channels | ESP32 load | Deployments |
| --- | --- | --- | --- | --- |
| **Atma-Lite** | FOA (WXYZ) | 4 | Low | Forest trails, mobile pop-ups |
| **Atma-Plus** | SOA | 9 | Medium | Indoor clusters, galleries |
| **Atma-Max** | Custom (future) | ≥16 | High / external DSP | Studios, research |

### Encoding Options

1. **Opus Ambisonics Mode (RFC 8486)** – Recommended baseline. Tuned for low latency, handles FOA/SOA, widely supported libs.
2. **PCM Float32** – Ultra-low latency when bandwidth is plentiful (indoor LAN).
3. **ADPCM / LC3** – Bluetooth ambient mesh or ultra-low bitrate fallback.

### Node-Local DSP Pipeline

1. Opus (or codec) decode → HOA frame.
2. Rotation matrix applied per vessel orientation.
3. Rendering coefficients / HRTF (libambisonics, SPARTA, Resonance Audio snippets).
4. Optional Faerie overlay (local oscillators, short sample cache).
5. I²S → DSP (ESP-DSP or ADAU1701) → TAS5805M amp → dual drivers.

---

## 5. Faerie / Spirit Effects Layer

- **OSC extensions:**
  - `/atma/faerie/create s f f f` – Spawn by type + position.
  - `/atma/faerie/move s f f f` – Animate path or velocity.
  - `/atma/faerie/die s` – Remove effect.
- **Implementation:** Each vessel holds a lightweight wavetable/noise bank to render sparkles, chirps, ritual bells without hitting network audio bandwidth.
- **Narrative engine:** MQTT-SN topics broadcast zone changes; OSC carries precise coordinates for nearby nodes.

---

## 6. Open-Source Building Blocks

| Layer | Candidate Libraries |
| --- | --- |
| Audio | Opus Ambisonics (RFC 8486), AmbiX/HOA libs, SPARTA, Google Resonance Audio, libmysofa (HRTF) |
| Networking | mDNSResponder, liboscpack / CNMAT OSC, Eclipse Paho MQTT-SN gateways |
| DSP / Hardware | ESP-ADF pipelines, esp-dsp, ADAU1701 SigmaDSP, TAS5805M drivers |

Reusing these keeps firmware lean while ensuring we can focus on Atma-only behaviors.

---

## 7. Proprietary Atma Differentiators

- **Atma Object Model:** Spirits, rituals, weather beings, and traveling motifs.
- **Spatial Event Engine:** Forest-scale low-frequency choreography + per-node behaviors.
- **Atma Vessel ID Profile:** Mason jar acoustics, solar lid, waveguide, touch ring.
- **Ambient Modes:** Forest Meditation, Waking Dream, Rain/Hearth/Ritual cycles.
- **Atma-Mesh Sync:** Hybrid BLE/Wi-Fi timing tuned for low-power clusters.

These layers stay closed-source to maintain brand magic while everything else stands on open foundations.

---

## 8. Implementation Notes & Next Steps

- **Firmware roadmap:** Start with FOA Opus decode on ESP32-S3 + OSC control → add MQTT-SN mesh + faerie engine.
- **Tooling:** Provide Atma Scene Pack (Ableton/Unreal templates) exporting HOA stems + OSC macros.
- **Testing:** Build indoor LAN rig (5–9 jars) to validate jitter buffers, then extend to solar mesh with MQTT-SN heartbeat.
- **Security:** Optional DTLS wrapper around AAP-UDP; signed MQTT-SN topics for rituals with guest access.

AAP positions Atma as a practical, extensible ambisonic field kit that leverages the best of open source while keeping the brand’s narrative soul proprietary.
