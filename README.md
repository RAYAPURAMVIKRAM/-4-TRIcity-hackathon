# 👑 ProxyGrid: The Digital Joint Family Network

> **TriCity AI Hackathon (Room B-4-216 | Team TRI26420)**  
> **Team VQ**:  
> • **Rayapuram Vikram** (Team Lead — CSE AI)  
> • **Haseeba Mahanaz** (Team Member — IT)  
> **GitHub Remote**: [https://github.com/RAYAPURAMVIKRAM/-4-TRIcity-hackathon](https://github.com/RAYAPURAMVIKRAM/-4-TRIcity-hackathon)

---

## 🎯 Locked Problem Statement
> **"Missing a trusted on-demand assistant for physical errands."**

### 💡 Core Vision: Traditional Joint Family Trust ✕ Next-Gen AI Technology
In traditional Indian joint families, you always had a trusted relative or cousin you could rely on to inspect an offline market price, verify a municipal office counter, hire a vetted neighborhood electrician, or pick up a street errand. In modern fragmented cities, that trusted network is missing.

**ProxyGrid is the Digital Joint Family Network.** We combine a modern **Radiant Blue & Vibrant Orange** aesthetic with a **WhatsApp-Style Floating Dispatch Widget (25%–30% Desktop Width / Mobile Bottom Sheet)** powered by a **3-Role AI Dispatch Engine (Gemini 2.5 Flash)** to solve real-world physical errands that quick-commerce apps cannot touch.

---

## 🎨 Radiant Blue & Vibrant Orange Design System

- **Background Palette**: Deep radiant blue gradient (`bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-950 via-[#071938] to-slate-950`) with atmospheric cyan/blue glowing light orbs (`bg-blue-600/15`).
- **High-Energy Accents**: Radiant Orange (`bg-orange-500`, `hover:bg-orange-600`, `text-orange-400`, `shadow-orange-500/25`) for maximum contrast and call-to-action visibility.
- **Glassmorphic 3D Physics**: Framer Motion 3D tilt physics (`whileHover={{ scale: 1.03, rotateX: 2, rotateY: -2 }}`) on container perspective (`[perspective:1000px]`) so cards pop realistically off the screen.

---

## 🏛️ The 4 Visual Service Tracks (3D Glassmorphic Cards)

```
┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│  📍 Need Local Information      │   │  🛍️ Buy Custom Product          │
│  Municipal desk check, token    │   │  Unorganized street retail,     │
│  line velocity, tax receipts    │   │  electronics corridor, mandis   │
└─────────────────────────────────┘   └─────────────────────────────────┘
┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│  🛠️ Hire Skilled Worker         │   │  🏍️ Book a Ride                 │
│  Electrician, plumber, handyman │   │  Immediate two-wheeler transit  │
│  fair diagnostic guarantee      │   │  Warangal & Kazipet corridors   │
└─────────────────────────────────┘   └─────────────────────────────────┘
```

1. **📍 Need Local Information**  
   - Desk verification, government counter operating hours, token queue status, and photo proof notices.  
   - *Example*: *"Visit the municipal office counter 2, verify if property tax receipts are being issued offline today."*
   - *Pricing*: Flat **₹25** (Base: ₹20, Platform: ₹5). Zero distance markup.

2. **🛍️ Buy Custom Product (Offline Retail Proxy)**  
   - Servicing unlisted street vendors, weekly mandis, and hardware/electronics spare parts corridors that lack digital seller portals.  
   - *Example*: *"Go to electronics lane in Nakkalagutta, find ESP32 board under ₹450."*  
   - *Pricing*: Flat **₹40** advance (Base: ₹20, Delivery: ₹15, Platform: ₹5). **Product charge ₹0 upfront — settled directly at stall via UPI! Zero waiting fees.**

3. **🛠️ Hire Skilled Worker**  
   - On-demand trusted technician deployment for domestic repairs with fair diagnostic lock.  
   - *Example*: *"Send an experienced electrician to inspect circuit breaker trip in Subedari."*  
   - *Pricing*: **₹65** (Diagnostic Base: ₹40, Inspection: ₹20, Platform: ₹5).

4. **🏍️ Book a Ride**  
   - Rapid point-to-point two-wheeler city transit with vetted drivers and sanitized helmets.  
   - *Example*: *"Need an immediate bike ride from Hanamkonda Chowrasta to Kazipet Railway Station."*  
   - *Pricing*: **₹45** (Base: ₹25, Distance: ₹15, Platform: ₹5). No surge inflation.

---

## 💬 WhatsApp-Style Floating Chat Widget (25%–30% Screen Size)

Clicking any track card launches an ergonomic floating WhatsApp-style dispatch widget in the bottom-right corner:
- **Non-Intrusive**: Keeps the 4 main tracks visible in the background on desktop (`w-[400px]` / `28vw`, `h-[72vh]`).
- **Mobile Bottom Sheet**: Slides up ergonomically (`100% width, 82vh height`) on smartphones.
- **WhatsApp Header**: Deep blue header with **ProxyGrid AI** avatar, a pulsing green `🟢 Online` status indicator, the active track name, and a quick minimize `✕` button.
- **Continuous Conversation Thread**:
  - **User Messages**: Right-aligned, radiant orange bubbles (`bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-tr-none`).
  - **AI Messages**: Left-aligned, dark frosted glass bubbles (`bg-slate-900/90 border border-blue-500/30 text-white rounded-tl-none`).
  - **1-Tap Quick Replies**: Pre-populated sample requests for the active track.
  - **Persistent Floating Pill**: Reopens the chat anytime with a live ping badge.

---

## 🤖 3-Role AI Dispatch Engine (Gemini API + Zero-Crash Fallback)

1. **ROLE 1: Safety & Legal Guardrail**  
   - Checks every request against security policy (weapons, narcotics, contraband, bribes, illegal tasks).  
   - *System Guard Response*:  
     `🚨 [UNSAFE REQUEST] For the safety of our partners, we cannot process this request.`

2. **ROLE 2: Category Routing & Objective Decomposition**  
   - Automatically parses natural language, extracts target landmarks, sets mission deliverables, and determines the exact proxy protocol.

3. **ROLE 3: Dynamic Ultra-Budget Pricing**  
   - Calculates transparent pricing with strict consumer protection: **Zero advance on goods** and **strictly ₹0 waiting fees on purchases**.

---

## 🛡️ Smart Budget Card & Live Stepper Inside Chat

Every validated errand produces a Smart Contract Card **directly inside the WhatsApp thread**:
- **Category Badge**: e.g. `🛍️ Street Retail & Products`
- **Security Check**: `✅ Safe & Legal`
- **Price Guard Lock**: *"🛡️ Price Cap Enforced: Proxy will not buy if quoted price exceeds budget limit."*
- **Itemized Fee Breakdown**: Clear transparency down to every rupee.
- **Radiant Orange Action Button**: **`[Confirm & Deploy Proxy]`**.
- **Live In-Chat Stepper**: Once deployed, the message updates with Ramesh K.'s mission progress (`Assigned` $\rightarrow$ `At Site` $\rightarrow$ `Delivered`).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 15 (App Router, Turbopack) |
| **Styling & Theme** | Tailwind CSS (Radiant Blue & Vibrant Orange Glassmorphism) |
| **3D Motion Physics** | Framer Motion 12 (`whileHover`, `[perspective:1000px]`, `AnimatePresence`) |
| **Icons** | Lucide React |
| **Language** | TypeScript 5 (Strict Mode, 100% typechecked, zero compile errors) |
| **AI Integration** | Google Gemini 2.5 Flash API with deterministic offline fallback |

---

## 🏁 Running the Project Locally

```bash
# 1. Clone the repository
git clone https://github.com/RAYAPURAMVIKRAM/-4-TRIcity-hackathon.git
cd -4-TRIcity-hackathon

# 2. Install dependencies
npm install

# 3. Start development server with Turbopack
npm run dev

# 4. Open in browser
http://localhost:3000
```

---

## 👥 Hackathon Attribution

- **Hackathon**: TriCity AI Hackathon
- **Classroom / Room**: Room B-4-216
- **Team ID**: TRI26420
- **Team Name**: Team VQ
- **Members**:
  - **Rayapuram Vikram** (Team Lead — CSE AI)
  - **Haseeba Mahanaz** (Team Member — IT)
- **Repository Remote**: [https://github.com/RAYAPURAMVIKRAM/-4-TRIcity-hackathon](https://github.com/RAYAPURAMVIKRAM/-4-TRIcity-hackathon)
