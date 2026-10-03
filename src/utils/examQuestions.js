// Curated Past-Year Questions from GATE CSE & ISRO CS for Storage & DBMS

export const EXAM_QUESTIONS = [
  {
    id: "GATE-2021-CS-38",
    exam: "GATE CSE",
    year: 2021,
    topic: "Disk Scheduling",
    question: "Consider a disk queue with requests for I/O to blocks on cylinders 98, 183, 37, 122, 14, 124, 65, 67. If the read/write head is initially at cylinder 53, what is the total head movement (in cylinders) using the Shortest Seek Time First (SSTF) scheduling algorithm?",
    options: [
      "236 cylinders",
      "208 cylinders",
      "174 cylinders",
      "240 cylinders"
    ],
    correctIndex: 0,
    solution: `Step-by-step SSTF Breakdown:
Starting position: 53.
Remaining requests: [98, 183, 37, 122, 14, 124, 65, 67].
1. Nearest to 53 is 65: |65 - 53| = 12
2. Nearest to 65 is 67: |67 - 65| = 2
3. Nearest to 67 is 37: |37 - 67| = 30
4. Nearest to 37 is 14: |14 - 37| = 23
5. Nearest to 14 is 98: |98 - 14| = 84
6. Nearest to 98 is 122: |122 - 98| = 24
7. Nearest to 122 is 124: |124 - 122| = 2
8. Nearest to 124 is 183: |183 - 124| = 59

Total Head Movement = 12 + 2 + 30 + 23 + 84 + 24 + 2 + 59 = 236 cylinders.`
  },

  {
    id: "GATE-2015-CS-45",
    exam: "GATE CSE",
    year: 2015,
    topic: "Disk Scheduling",
    question: "Consider a disk system with 100 cylinders numbered 0 to 99. The disk head is currently at cylinder 50 and moving towards higher cylinder numbers. The queue of cylinder requests is: 84, 10, 24, 80, 70. Using the SCAN (Elevator) algorithm, what is the total head movement?",
    options: [
      "138 cylinders",
      "140 cylinders",
      "146 cylinders",
      "128 cylinders"
    ],
    correctIndex: 0,
    solution: `Step-by-step SCAN Breakdown:
Starting position: 50. Moving towards higher cylinders (UP).
Requests: [10, 24, 70, 80, 84], disk range [0, 99].
1. Head moves up serving requests > 50 in increasing order: 70, 80, 84.
2. In SCAN, the head proceeds all the way to the boundary (cylinder 99):
   Distance = |99 - 50| = 49 cylinders.
3. The head reverses direction towards 0 and services requests < 50 in decreasing order: 24, 10:
   Distance from 99 to lowest request (10) = |99 - 10| = 89 cylinders.

Total Head Movement = (99 - 50) + (99 - 10) = 49 + 89 = 138 cylinders.`
  },

  {
    id: "GATE-2007-CS-62",
    exam: "GATE CSE",
    year: 2007,
    topic: "Inodes & File Systems",
    question: "An Inode has 12 direct block pointers, 1 single indirect pointer, 1 double indirect pointer, and 1 triple indirect pointer. Disk block size is 4 KB and each disk block address pointer occupies 4 Bytes. What is the maximum possible file size supported by this file system?",
    options: [
      "Approximately 4 TB",
      "Approximately 16 TB",
      "Approximately 4 GB",
      "Approximately 64 TB"
    ],
    correctIndex: 0,
    solution: `Step-by-step Inode Capacity Derivation:
Block Size (B) = 4 KB = 4096 Bytes.
Pointer Size = 4 Bytes.
Pointers per block (P) = 4096 / 4 = 1024 = 2^10 pointers.

1. Direct blocks: 12 * 4 KB = 48 KB.
2. Single indirect: P * 4 KB = 1024 * 4 KB = 4 MB.
3. Double indirect: P^2 * 4 KB = (1024)^2 * 4 KB = 1,048,576 * 4 KB = 4 GB.
4. Triple indirect: P^3 * 4 KB = (1024)^3 * 4 KB = 2^30 * 4 KB = 4 TB.

Total File Size ≈ 4 TB (dominated by triple indirect pointers = 4096 GB).`
  },

  {
    id: "GATE-2018-CS-29",
    exam: "GATE CSE",
    year: 2018,
    topic: "Inodes & File Systems",
    question: "In a file system with 2 KB block size, an inode contains 8 direct pointers and 1 single indirect pointer. Pointer size is 4 Bytes. If a file has size 18 KB, how many total disk blocks (including data blocks and index/indirect blocks) are allocated to this file?",
    options: [
      "10 disk blocks",
      "9 disk blocks",
      "11 disk blocks",
      "8 disk blocks"
    ],
    correctIndex: 0,
    solution: `Step-by-step Analysis:
File Size = 18 KB.
Block Size = 2 KB.
Number of data blocks needed = ceil(18 KB / 2 KB) = 9 data blocks.

Allocation:
- 8 direct pointers in the inode hold the first 8 data blocks (8 * 2 KB = 16 KB).
- The remaining 1 data block (2 KB) cannot fit in direct pointers, so it requires the single indirect pointer.
- The single indirect pointer allocates 1 indirect index block to hold the pointer to the 9th data block.
Total disk blocks allocated = 9 data blocks + 1 single indirect index block = 10 blocks.`
  },

  {
    id: "GATE-2019-CS-41",
    exam: "GATE CSE",
    year: 2019,
    topic: "Inodes & File Systems",
    question: "A file system uses a block size of 1 KB. A disk has total capacity 1 TB (10^12 bytes, treated as 2^40 bytes in binary binary computing). The disk is tracked using a free-space bitmap where each block is represented by 1 bit. What is the size of the bitmap in memory?",
    options: [
      "128 MB",
      "64 MB",
      "1 GB",
      "32 MB"
    ],
    correctIndex: 0,
    solution: `Step-by-step Bitmap Derivation:
Total Disk Capacity = 1 TB = 2^40 Bytes.
Block Size = 1 KB = 2^10 Bytes.
Total Number of Blocks = 2^40 / 2^10 = 2^30 blocks (approx 1,073,741,824 blocks).

Each block requires 1 bit in the free-space bit vector:
Total Bits required = 2^30 bits.
Converting to Bytes = 2^30 / 8 bytes = 2^30 / 2^3 = 2^27 Bytes.
Converting to Megabytes = 2^27 / 2^20 = 2^7 MB = 128 MB.

Therefore, the bitmap requires 128 MB of memory.`
  },

  {
    id: "GATE-2023-CS-33",
    exam: "GATE CSE",
    year: 2023,
    topic: "Storage Hardware & RAID",
    question: "Consider a hard disk with 16 platters, 1024 cylinders, and 256 sectors per track. Each sector holds 512 Bytes. If the disk rotates at 3600 RPM, what is the maximum transfer rate (bandwidth) of the disk?",
    options: [
      "7.68 MB/sec",
      "15.36 MB/sec",
      "3.84 MB/sec",
      "30.72 MB/sec"
    ],
    correctIndex: 0,
    solution: `Step-by-step Transfer Rate Calculation:
Rotational speed = 3600 RPM = 3600 / 60 = 60 rotations per second (RPS).
Capacity of one single track = (Sectors per track) * (Bytes per sector)
= 256 * 512 Bytes = 131,072 Bytes = 128 KB per track.

In one second, 60 tracks pass under the head:
Maximum Transfer Rate = Track Capacity * RPS
= 128 KB * 60 = 7680 KB/sec = 7.68 MB/sec (or 7.5 MiB/sec).`
  },

  {
    id: "ISRO-2020-CS-18",
    exam: "ISRO",
    year: 2020,
    topic: "Storage Hardware & RAID",
    question: "In a RAID-5 disk array consisting of 5 identical disks of 1 TB each, what is the usable storage capacity available for user data, and how many concurrent disk failures can it tolerate without data loss?",
    options: [
      "4 TB usable capacity, tolerates 1 disk failure",
      "5 TB usable capacity, tolerates 2 disk failures",
      "2.5 TB usable capacity, tolerates 1 disk failure",
      "4 TB usable capacity, tolerates 2 disk failures"
    ],
    correctIndex: 0,
    solution: `Step-by-step RAID-5 Analysis:
RAID-5 uses block-level striping with distributed parity across all N disks.
Given N = 5 disks, Capacity per disk C = 1 TB:
- Usable storage capacity = (N - 1) * C = (5 - 1) * 1 TB = 4 TB.
- 1 disk capacity equivalent is dedicated to distributed parity.
- Fault tolerance: Can reconstruct data if any single disk fails using XOR parity (tolerates 1 disk failure). To tolerate 2 disk failures, RAID-6 with dual parity is required.`
  },

  {
    id: "ISRO-2021-CS-52",
    exam: "ISRO",
    year: 2021,
    topic: "Storage Hardware & RAID",
    question: "A magnetic disk drive has a rotational speed of 7200 RPM. What is the average rotational latency?",
    options: [
      "4.17 milliseconds",
      "8.33 milliseconds",
      "2.08 milliseconds",
      "6.25 milliseconds"
    ],
    correctIndex: 0,
    solution: `Step-by-step Rotational Latency Calculation:
Rotational Speed = 7200 RPM.
Rotations per second (RPS) = 7200 / 60 = 120 rev/sec.
Time for 1 complete revolution = 1 / 120 seconds = 8.333 milliseconds.

Average rotational latency (Tr) is the time for half a revolution (on average, the target sector is half a turn away):
Tr = (1 / 2) * (1 / RPS) = 8.333 ms / 2 = 4.167 ms ≈ 4.17 milliseconds.`
  },

  {
    id: "GATE-2016-CS-42",
    exam: "GATE CSE",
    year: 2016,
    topic: "Disk Scheduling",
    question: "Consider disk requests: 23, 89, 132, 42, 187 on a disk with cylinders 0-199. Initially head is at 100 moving toward 199. What is the total head movement under LOOK algorithm?",
    options: [
      "251 cylinders",
      "201 cylinders",
      "187 cylinders",
      "164 cylinders"
    ],
    correctIndex: 0,
    solution: `Step-by-step LOOK Breakdown:
Unlike SCAN which travels all the way to cylinder 199, LOOK reverses at the highest requested cylinder in that direction.
Initial position: 100. Direction: UP.
Requests: [23, 42, 89, 132, 187].
1. Moving up:
   Head visits 132 (|132 - 100| = 32)
   Head visits 187 (|187 - 132| = 55) -> highest request reached!
   Subtotal up = 32 + 55 = 87 cylinders.
2. Reverses direction and moves down without touching 199:
   Head visits 89 (|89 - 187| = 98)
   Head visits 42 (|42 - 89| = 47)
   Head visits 23 (|23 - 42| = 19)
   Subtotal down = 98 + 47 + 19 = 164 cylinders.

Total Head Movement = 87 + 164 = 251 cylinders (or via direct shortcut: (187 - 100) + (187 - 23) = 87 + 164 = 251 cylinders).`
  },

  {
    id: "GATE-2020-CS-15",
    exam: "GATE CSE",
    year: 2020,
    topic: "Storage Hardware & RAID",
    question: "A relational database table contains 20,000 records. Each record is 100 Bytes. The disk block size is 1024 Bytes. Using unspanned record organization, what is the blocking factor (Bfr) and the total number of blocks needed to store the table?",
    options: [
      "Bfr = 10 records/block, Total Blocks = 2,000",
      "Bfr = 10 records/block, Total Blocks = 2,048",
      "Bfr = 10.24 records/block, Total Blocks = 1,954",
      "Bfr = 9 records/block, Total Blocks = 2,223"
    ],
    correctIndex: 0,
    solution: `Step-by-step DBMS Blocking Factor Calculation:
Block Size (B) = 1024 Bytes.
Record Size (R) = 100 Bytes.
Total Records (N) = 20,000.

1. In unspanned organization, records cannot cross block boundaries:
   Blocking Factor Bfr = floor(B / R) = floor(1024 / 100) = 10 records per block.
2. Internal fragmentation per block = 1024 - (10 * 100) = 24 Bytes wasted per block.
3. Total number of blocks b = ceil(N / Bfr) = ceil(20,000 / 10) = 2,000 blocks.`
  }
];
