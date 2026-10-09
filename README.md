# StorageOS — Disk Storage & Physical Block Management Visualizer
> A high-precision interactive physical storage simulation engine and educational workbench built for Database Management Systems (DBMS) and Operating Systems curricula.

[![React](https://img.shields.io/badge/React-18.x-23252a?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-23252a?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-23252a?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-e4f222?style=flat-square&labelColor=08090a)](LICENSE)
[![Design System](https://img.shields.io/badge/Design%20System-Linear%20Midnight-08090a?style=flat-square&labelColor=161718&color=e4f222)](https://linear.app)

---

## 🌌 Linear Midnight Design System

StorageOS is styled using the **Linear Midnight** dark precision instrument aesthetic:
- **Void Canvas:** `#08090a` deep obsidian background
- **Surface Panels:** `#0f1011` card surfaces with elevated `#161718` micro-pills
- **Borders & Rules:** Hairline 1px `#23252a` graphite dividers
- **Typography:** Crisp paper white (`#ffffff`) headings with muted `#8a8f98` metadata
- **Accents:** Electric Acid-Lime (`#e4f222`) primary actions, Pulse Green (`#27a644`) for valid states, and Coral Red (`#eb5757`) for error diagnostics.

---

## 🏛️ Multi-Page Module Architecture

### 1. `/allocator` — 100-Block Storage Matrix & State Engine
The primary interactive disk simulator with a $10 \times 10$ block matrix:
- **Contiguous Allocation:** First-Fit, Best-Fit, and Worst-Fit placement heuristics with real-time detection of **External Fragmentation**.
- **Linked (Chained) Allocation:** Dispersed block placement connected via physical address pointers with animated SVG chain overlays on hover.
- **Indexed Allocation:** Inode-style index blocks containing pointer arrays to data blocks.
- **Free-Space Bit Vector:** Dynamic 100-bit binary register ($1 = \text{Free}$, $0 = \text{Allocated}$) with micro-animation updates.
- **Disk Defragmenter:** Live memory compaction algorithm that shifts allocated files forward and merges scattered free extents.
- **Seek Latency Benchmark:** Comparative seek hops simulation plotted via interactive **Recharts** bar graphs.

### 2. `/storage-hardware` — Physical Media & Slotted-Page Architecture
- **Hardware Media Simulation:**
  - **Mechanical HDD:** Spindle RPM, read/write seek arm travel, rotational delay ($4.17\,\text{ms}$ avg at 7200 RPM), and mechanical track sectors.
  - **Semiconductor SSD:** NAND Flash memory cells, fast page reads/writes, and block erase wear-leveling cycles.
- **Dynamic Table Schema Builder:** Create custom schemas with `INT` (4B), `FLOAT` (8B), `CHAR` (16B), and `VARCHAR` (32B) fields with real-time record size ($R$) telemetry.
- **Data Ingestion:** Upload custom CSV/JSON files or load preloaded academic datasets (e.g., *VIT Students*, *E-Commerce Orders*, *Sensor Telemetry*).
- **Interactive Slotted-Page Visualizer:** Explores how DBMS engines pack variable tuples into physical pages using header slot pointers growing downward and tuple payloads growing upward from the block base.

### 3. `/learn` — Academic Storage Knowledge Base
- **Theory-First Curriculum:** In-depth pedagogical modules on physical disk geometry, seek/rotational latency equations, file organization methods, and slotted-page mechanics.
- **3 Embedded YouTube Lecture Hubs:** High-yield lectures covering Contiguous, Indexed, and Linked file placement strategies.
- **One-Click Audit Report Export:** Generates an executive PDF report containing active disk state and FAT tables.

### 4. `/practice` — AI Storage Practice Sandbox
An interactive calculation sandbox with random problem generators, student answer verification, and step-by-step mathematical breakdowns:
- **Disk Scheduling Solver:** FCFS, SSTF, SCAN (Elevator), C-SCAN, LOOK, and C-LOOK with seek trajectory diagrams.
- **UNIX Inode File Capacity Calculator:** Multi-level indirect block indexing derivations ($P = B/S_p$, Direct, Single, Double, Triple Indirect) yielding maximum file capacity.
- **DBMS Blocking Factor ($Bfr$):** Real-time derivation of $Bfr = \lfloor B/R \rfloor$, internal fragmentation per page, required blocks $b = \lceil N/Bfr \rceil$, and total wasted storage bytes.

### 5. `/exams` — Competitive Exams Question Bank
Curated test engine featuring past questions from **GATE CSE** and **ISRO CS**:
- **Topic Coverage:** Disk scheduling seek calculations, multi-level Inode limits, RAID-5 redundancy, rotational latency, free-space bit vectors, and slotted-page pointers.
- **Live Performance HUD:** Tracks Questions Attempted, Correct, Accuracy %, and GATE Net Score (+1.00 for correct, -0.33 negative marking).
- **Instant Evaluation:** Pulse green / coral red highlighting with collapsible **Official Examination Solution** arithmetic.
- **Filters:** Filter by examination body (`GATE CSE`, `ISRO`) or storage domain.

### 6. `/credits` — Project Contributors & Mentorship
- **Nishank Chhipa** (`25BCE1642`): Lead Systems Architect — Core State Engine, Allocation Algorithms, Defragmenter, and PDF Export System.
- **Shourya Sharma** (`25BCE1780`): Lead UI/UX Designer — 10x10 Matrix Visualizer, SVG Chain Overlays, Benchmark Telemetry, and Linear Midnight Interface.
- **Faculty Supervisor:** **Dr. Swaminathan A**, Assistant Professor, School of Computer Science and Engineering (SCOPE).

---

## 📊 Comprehensive PDF Audit Report Generation

StorageOS includes a client-side reporting engine powered by `jspdf` and `jspdf-autotable`:
- **Document Header:** `StorageOS - Physical Storage & File Organization Engine Report`
- **Metadata:** Execution Timestamp, Course (CSE2004 DBMS), Evaluator (Dr. Swaminathan A), Authors.
- **Section 1: Active Disk Simulation Summary & FAT:** Block statistics, storage saturation, external fragmentation diagnostics, and the active File Allocation Table directory.
- **Section 2: Physical Hardware Architecture:** Configured block size ($B$), tuple size ($R$), blocking factor ($Bfr$), internal fragmentation, and slotted-page layout.
- **Section 3: Kernel Execution Audit Trail:** Chronological log of recent operations.
- **Automatic Fallback:** Graceful fallback to a structured `.txt` export if the browser blocks PDF downloads.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/Nishank15/Disk_Storage_and_Block_Management_Visualizer.git

# 2. Navigate to project root
cd Disk_Storage_and_Block_Management_Visualizer

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

### Production Build & Preview
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🛠️ Technology Stack

| Layer | Tools / Libraries |
| :--- | :--- |
| **Core Architecture** | React 18+, Vite, React Router DOM (v7) |
| **Styling & Theme** | Tailwind CSS, Linear Midnight Design System |
| **Animation & Motion** | Framer Motion, Tailwind CSS Transitions |
| **Data Visualization** | Recharts, SVG Dynamic Vectors |
| **Iconography** | Lucide React |
| **Report Generation** | jsPDF, jsPDF-AutoTable |
| **Linter & Code Quality** | Oxlint |

---

## 📜 Academic Integrity & Course Information
- **Course:** Database Management Systems (CSE2004) / Operating Systems
- **Curriculum:** Physical Storage, File Organization, Disk Arm Scheduling & Buffer Pool Management
- **School:** School of Computer Science and Engineering (SCOPE)
