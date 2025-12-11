# Atma: A Distributed Ambient Audio Field System

A network of magical "sound jars" that render a shared spatial soundfield using ESP32 nodes, Bluetooth audio, and Wi-Fi synchronization.

---

## 1. Overview

Atma is a modular, forest-deployable audio installation composed of many small speaker "jars," each powered by an ESP32 and a compact amplifier.
Together, they create a living ambient ecosystem of motion, voices, spirits, and environmental textures that move fluidly from jar to jar.

Each Atma node:
  •  Plays audio
  •  Computes its own DSP
  •  Receives spatial control signals
  •  Syncs to all other jars
  •  Emits unique localized sound according to its place in the environment

The result is a distributed, immersive, location-aware sound field.

---

## 2. Hardware Architecture

### 2.1 Node Structure (Per Jar)

Each jar contains:
  •  ESP32 (Classic) — provides Bluetooth A2DP sink, Wi-Fi, and DSP
  •  I²S DAC (PCM5102, ES8388, AC101, etc.)
  •  Audio amplifier (TPA3116, PAM8610, etc.)
  •  1–3 small full-range drivers arranged vertically
  •  12 V power rail (USB-C PD trigger → 12 V)
  •  Local LEDs or IMU sensors (optional)
  •  Rigid internal baffles separating drivers from electronics

The jar uses four M3 threaded rods as both mechanical structure and wiring harness.

### 2.2 Power System
  •  USB-C PD trigger negotiates 12 V
  •  12 V rail powers the amplifier directly
  •  Core ESP32 receives regulated 5 V or 3.3 V
  •  Power distribution and filtering handled by a custom Atma PD module

No M5Stack or ESP32 bus pin carries 12 V.

---

## 3. Audio Pipeline

### 3.1 Input Sources
  1.  Bluetooth A2DP → One "Master" Jar
  •  Phone streams stereo audio over BT
  •  The Master Node decodes SBC and publishes the audio over Wi-Fi
  2.  Wi-Fi Stream (Direct from Controller)
  •  Phone or central computer can broadcast PCM/Opus over LAN
  •  Used for multi-node synchronized playback
  3.  On-Node Sounds
  •  Procedural textures
  •  Triggered effects
  •  Ambient loops stored locally

### 3.2 Spatial Rendering Model

Atma uses First-Order Ambisonics (FOA) to represent the soundfield:
  •  Four channels: W, X, Y, Z
  •  Jars perform local FOA → speaker decoding
  •  Results in spatialized sound emerging from many jars as a single field

Each jar receives:
  •  Shared audio stream (WXYZ or stereo)
  •  Node position
  •  Virtual sound source positions
  •  Per-jar gain, EQ, delay, or movement vectors

Each jar renders its own local stereo (or mono) output via:

Left  = aW + bX + cY + dZ
Right = eW + fX + gY + hZ

This yields:
  •  Coherent, environment-wide spatial textures
  •  Spirits, animals, or ambient objects moving from jar to jar
  •  Smooth diffusion and localized presence

---

## 4. Network Synchronization

### 4.1 Transport Layer
  •  Audio packets transmitted over Wi-Fi UDP multicast
  •  Control packets sent via Wi-Fi unicast or ESP-NOW
  •  Optional RTP-style timestamps

### 4.2 Sync Strategy

Each jar:
  •  Maintains a local sample clock
  •  Buffers 10–30 ms to smooth network jitter
  •  Aligns playback using timestamps

This yields phase-coherent playback across all nodes.

---

## 5. Master Node Responsibilities

The Master Node (any jar or dedicated controller) performs:
  •  Bluetooth audio decoding (if used)
  •  Spatial scene computation
  •  FOA encoding or per-node decoding coefficients
  •  Audio stream distribution
  •  Node management and heartbeat
  •  Clock sync

The system can operate:
  •  With a single master jar
  •  With a phone-based controller
  •  Fully distributed with leader election (future expansion)

---

## 6. DSP Pipeline (Per Node)

Each jar performs:
  1.  Audio receive & buffer
  2.  Spatial decode (FOA matrix multiply)
  3.  Gain staging
  4.  Biquad filters (EQ, compensation for jar enclosure)
  5.  Soft limiter
  6.  I²S output → DAC → amplifier → speakers

This DSP load is comfortably within the capability of a standard ESP32 at 48 kHz.

---

## 7. System Behavior in a Forest or Installation

Atma nodes create a distributed sonic organism:
  •  Ambient textures drift between jars
  •  Voices or fairy sounds "travel"
  •  Harmonics shimmer across multiple points
  •  The field responds to movement or timed sequences
  •  Each jar fades in/out according to proximity or theme

Placed in trees, along paths, or throughout a garden, Atma becomes:
  •  A responsive musical environment
  •  A sound sculpture
  •  An enchanted audio ecosystem

---

## 8. Project Goals
  •  Simple deployment: jars powered by USB-C PD
  •  Modular architecture: add or remove jars freely
  •  Self-contained nodes: no single point of failure
  •  Flexible content engine
  •  Support for ritual, meditation, performance, and ambient installations
  •  Blend of Bluetooth convenience + Wi-Fi distributed audio

---

## 9. Future Extensions
  •  GPS or UWB positioning for dynamic spatial mapping
  •  Light-synchronized effects
  •  Environmental sensing (BME688 VOC, humidity, temp)
  •  AI-generated sound sprites
  •  Higher-order Ambisonics
  •  Solar charging and weatherproof housings

---

## 10. Summary

Atma is a distributed ambisonic audio network using small speaker jars as intelligent nodes.
Each node renders spatialized sound locally while staying synchronized with all other nodes.

By combining:
  •  ESP32 Bluetooth audio decoding,
  •  Wi-Fi-based audio distribution,
  •  Local DSP,
  •  Modular jar hardware,
  •  Lightweight FOA spatial math,

Atma creates a flexible, magical, and scalable audio ecosystem suitable for forests, art installations, and immersive experiences.
