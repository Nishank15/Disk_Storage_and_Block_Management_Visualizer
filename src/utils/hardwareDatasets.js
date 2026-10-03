// Preloaded Academic Datasets & Schemas for DBMS Storage Simulation

export const PRESET_DATASETS = {
  Students_VIT: {
    name: 'Students_VIT',
    description: '100 undergraduate student registration records',
    schema: [
      { name: 'reg_no', type: 'VARCHAR', bytes: 12 },
      { name: 'name', type: 'VARCHAR', bytes: 32 },
      { name: 'department', type: 'CHAR', bytes: 8 },
      { name: 'cgpa', type: 'FLOAT', bytes: 8 },
      { name: 'hosteller', type: 'INTEGER', bytes: 4 }
    ],
    generateRows: () => {
      const names = ['Aarav Patel', 'Diya Sharma', 'Rohan Iyer', 'Ananya Verma', 'Vikram Singh', 'Pooja Nair', 'Aditya Rao', 'Neha Gupta', 'Karan Mehta', 'Sneha Reddy'];
      const depts = ['CSE', 'ECE', 'MECH', 'CIVIL', 'IT', 'DATA'];
      return Array.from({ length: 100 }).map((_, i) => ({
        reg_no: `25BCE${String(1000 + i + 1)}`,
        name: `${names[i % names.length]}`,
        department: depts[i % depts.length],
        cgpa: Number((7.5 + ((i * 7) % 25) / 10).toFixed(2)),
        hosteller: i % 2 === 0 ? 1 : 0
      }));
    }
  },

  ECommerce_Orders: {
    name: 'ECommerce_Orders',
    description: '250 online retail purchase transactions',
    schema: [
      { name: 'order_id', type: 'INTEGER', bytes: 4 },
      { name: 'customer_id', type: 'INTEGER', bytes: 4 },
      { name: 'amount', type: 'FLOAT', bytes: 8 },
      { name: 'status', type: 'VARCHAR', bytes: 16 },
      { name: 'created_at', type: 'TIMESTAMP', bytes: 8 }
    ],
    generateRows: () => {
      const statuses = ['COMPLETED', 'SHIPPED', 'PROCESSING', 'DELIVERED', 'REFUNDED'];
      return Array.from({ length: 250 }).map((_, i) => ({
        order_id: 100000 + i,
        customer_id: 5000 + (i % 40),
        amount: Number((15.99 + ((i * 13) % 450)).toFixed(2)),
        status: statuses[i % statuses.length],
        created_at: `2026-10-0${(i % 9) + 1}`
      }));
    }
  },

  IoT_Sensor_Logs: {
    name: 'IoT_Sensor_Logs',
    description: '500 industrial IoT environmental sensor telemetry readings',
    schema: [
      { name: 'sensor_id', type: 'CHAR', bytes: 8 },
      { name: 'temperature', type: 'FLOAT', bytes: 8 },
      { name: 'humidity', type: 'FLOAT', bytes: 8 },
      { name: 'battery', type: 'FLOAT', bytes: 8 },
      { name: 'timestamp', type: 'TIMESTAMP', bytes: 8 }
    ],
    generateRows: () => {
      return Array.from({ length: 500 }).map((_, i) => ({
        sensor_id: `SN-${String((i % 25) + 1).padStart(3, '0')}`,
        temperature: Number((22.4 + ((i * 3) % 180) / 10).toFixed(1)),
        humidity: Number((45.0 + ((i * 5) % 400) / 10).toFixed(1)),
        battery: Number((99.5 - (i * 0.15)).toFixed(1)),
        timestamp: `17:3${i % 6}:${String(i % 60).padStart(2, '0')}`
      }));
    }
  }
};
