# 💾 Disk Storage & Block Management Visualizer
> An interactive physical storage simulation engine and diagnostic visualizer built with **React**, **Tailwind CSS**, and **Framer Motion**.

---

## 📌 Project Overview
In modern Operating Systems and Database Management Systems (DBMS), efficient physical block allocation and free-space tracking are critical to minimizing I/O bottlenecks and disk thrashing. 

This application simulates a 100-block storage matrix ($10 \times 10$ grid) running live file and relational table allocations across three primary allocation strategies, while managing free space using a real-time bit-vector bitmap.

---

## ✨ Key Features

### 1. Core Allocation Strategies
- **Contiguous Allocation:**
  - Implements **First-Fit**, **Best-Fit**, and **Worst-Fit** search heuristics.
  - Detects **External Fragmentation** when free space exists in aggregate but lacks a single continuous segment large enough for allocation.
- **Linked (Chained) Allocation:**
  - Disperses file blocks non-contiguously using physical address pointers (`block.next`).
  - Renders dynamic SVG pointer overlays connecting block chains on hover.
- **Indexed Allocation:**
  - Allocates a dedicated **Index Block** containing an array of direct pointers to allocated data blocks.
  - Accounts for structural pointer overhead during allocation checks.

### 2. Free Space Management (Bitmap / Bit Vector)
- Real-time 100-bit binary strip ($1 = \text{Free}$, $0 = \text{Allocated}$).
- Visual micro-animations reflect instant bit-flipping upon allocation and deallocation.

### 3. Innovation & Diagnostic Add-ons
- **Animated Disk Defragmenter:** Re-indexes and shifts non-contiguous files into contiguous sequences at the front of the disk using layout animations.
- **Disk Head Seek-Time Benchmark:** Simulates sequential and direct read scans, tracking cylinder hops and plotting a comparative performance bar chart via **Recharts**.
- **Automated Audit Report Generator:** Exports execution logs, block allocation tables, and fragmentation statistics directly into a formatted PDF using **jsPDF** and **jspdf-autotable**.
- **Day / Night Mode:** Full theme toggle with persistent state.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | React 18+ (Vite) |
| **Styling** | Tailwind CSS |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Report Export** | jsPDF & jspdf-autotable |

---

## 👥 Academic Credits & Contributor Details

- **Course:** Physical Storage & File Organization (DBMS / OS)
- **Institution:** School of Computer Science and Engineering

### Contributors
* **Nishank Chhipa** — Reg. No: `25BCE1642`
* **Shourya Sharma** — Reg. No: `25BCE1780`

### Faculty Supervisor
* **Guided By:** **Dr. Swaminathan A**  
* **Designation:** Assistant Professor

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### Installation & Run
```bash
# Clone repository
git clone [https://github.com/Nishank15/Disk_Storage_and_Block_Management_Visualizer.git](https://github.com/Nishank15/Disk_Storage_and_Block_Management_Visualizer.git)

# Navigate into directory
cd Disk_Storage_and_Block_Management_Visualizer

# Install dependencies
npm install

# Start development server
npm run dev