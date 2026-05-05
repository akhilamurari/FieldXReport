// services/database.ts
// SQLite local database service for FieldReportX
// Handles offline storage of field reports

import * as SQLite from 'expo-sqlite';

// Open or create the database
const db = SQLite.openDatabaseSync('fieldreportx.db');

// Report interface for SQLite
export interface LocalReport {
  id?: number;
  firebaseId?: string;
  title: string;
  location: string;
  notes: string;
  status: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  synced: number;
}

// Create reports table if it does not exist
export const createTable = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firebaseId TEXT,
      title TEXT NOT NULL,
      location TEXT,
      notes TEXT,
      status TEXT DEFAULT 'draft',
      latitude REAL DEFAULT 0,
      longitude REAL DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      synced INTEGER DEFAULT 0
    );
  `);
};

// Insert a new report into SQLite
export const insertReport = (report: LocalReport): number => {
  const result = db.runSync(
    `INSERT INTO reports 
    (firebaseId, title, location, notes, status, latitude, longitude, synced)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      report.firebaseId || '',
      report.title,
      report.location,
      report.notes,
      report.status,
      report.latitude,
      report.longitude,
      report.synced,
    ]
  );
  return result.lastInsertRowId;
};

// Get all reports from SQLite
export const getAllReports = (): LocalReport[] => {
  const reports = db.getAllSync(
    'SELECT * FROM reports ORDER BY createdAt DESC'
  );
  return reports as LocalReport[];
};

// Get unsynced reports
export const getUnsyncedReports = (): LocalReport[] => {
  const reports = db.getAllSync(
    'SELECT * FROM reports WHERE synced = 0'
  );
  return reports as LocalReport[];
};

// Mark report as synced
export const markAsSynced = (id: number, firebaseId: string) => {
  db.runSync(
    'UPDATE reports SET synced = 1, firebaseId = ? WHERE id = ?',
    [firebaseId, id]
  );
};

// Delete a report
export const deleteReport = (id: number) => {
  db.runSync('DELETE FROM reports WHERE id = ?', [id]);
};

// Initialise database
export const initDatabase = () => {
  createTable();
  console.log('SQLite database initialised successfully');
};