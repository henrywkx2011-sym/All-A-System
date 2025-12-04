import express, { json } from 'express';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import cors from 'cors';
require('dotenv').config();

const app = express();

// Allow the React frontend to communicate with this server
app.use(cors()); 

app.use(json());

// --- CONFIGURATION ---
// These values come from your .env file (explained in the guide)
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

// Configure Authentication
const serviceAccountAuth = new JWT({
  email: SERVICE_ACCOUNT_EMAIL,
  key: PRIVATE_KEY,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// --- API ROUTES ---

// 1. GET Dashboard Data
app.get('/api/dashboard', async (req, res) => {
  try {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo(); 

    // Fetch Students
    const studentSheet = doc.sheetsByTitle['Students'];
    if (!studentSheet) throw new Error("Sheet 'Students' not found");
    const studentRows = await studentSheet.getRows();
    
    const students = studentRows.map(row => ({
      id: row.get('id'),
      name: row.get('name'),
      level: row.get('level'),
      subject: row.get('subject'),
      status: row.get('status'),
      phone: row.get('phone'),
      lastPayment: row.get('lastPayment')
    }));

    // Fetch Fees
    const feeSheet = doc.sheetsByTitle['Fees'];
    if (!feeSheet) throw new Error("Sheet 'Fees' not found");
    const feeRows = await feeSheet.getRows();
    
    const fees = feeRows.map(row => ({
      id: row.get('id'),
      student: row.get('student'),
      amount: row.get('amount'),
      date: row.get('date'),
      method: row.get('method'),
      status: row.get('status')
    }));

    res.json({ students, fees });

  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ All-A Server is running on  http://localhost:${PORT}`);
});
    
