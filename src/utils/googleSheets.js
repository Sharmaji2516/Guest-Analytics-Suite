import Papa from 'papaparse';
import axios from 'axios';

/**
 * Extracts the spreadsheet ID from a Google Sheets URL
 * @param {string} url 
 * @returns {string|null}
 */
export const extractSheetId = (url) => {
  const match = url.match(/\/d\/(.*?)(\/|$)/);
  return match ? match[1] : null;
};

/**
 * Fetches data from a Google Sheet and parses it as JSON
 * @param {string} url 
 * @returns {Promise<Array>}
 */
export const fetchSheetData = async (url) => {
  const id = extractSheetId(url);
  if (!id) throw new Error('Invalid Google Sheets URL');

  const csvUrl = `https://docs.google.com/spreadsheets/d/${id}/export?format=csv`;
  
  try {
    const response = await axios.get(csvUrl);
    const results = Papa.parse(response.data, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true
    });

    return results.data;
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    throw new Error('Failed to fetch data from the spreadsheet. Make sure it is shared with "Anyone with the link".');
  }
};

/**
 * Maps the raw sheet data to our expected field names
 * This handles cases where column names might slightly vary
 */
/**
 * Calculates the number of days between two dates
 */
const calculateDays = (start, end) => {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  if (isNaN(s) || isNaN(e)) return 0;
  const diffTime = Math.abs(e - s);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Robustly parses numbers from spreadsheet strings
 */
const parseNum = (val) => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const num = parseInt(val.toString().replace(/[^0-9.-]/g, ''));
  return isNaN(num) ? 0 : num;
};

/**
 * Maps common Indian cities to their respective states
 */
const cityToStateMap = {
  'jaipur': 'Rajasthan', 'jodhpur': 'Rajasthan', 'udaipur': 'Rajasthan', 'kota': 'Rajasthan', 'ajmer': 'Rajasthan', 'bikaner': 'Rajasthan', 'alwar': 'Rajasthan', 'bhilwara': 'Rajasthan', 'sojat': 'Rajasthan', 'pali': 'Rajasthan', 'chittorgarh': 'Rajasthan', 'medata': 'Rajasthan', 'mountabhu': 'Rajasthan',
  'delhi': 'Delhi', 'new delhi': 'Delhi',
  'mumbai': 'Maharashtra', 'pune': 'Maharashtra', 'nagpur': 'Maharashtra', 'thane': 'Maharashtra', 'nashik': 'Maharashtra',
  'ahmedabad': 'Gujarat', 'surat': 'Gujarat', 'vadodara': 'Gujarat', 'rajkot': 'Gujarat',
  'bengaluru': 'Karnataka', 'bangalore': 'Karnataka', 'mysuru': 'Karnataka',
  'chennai': 'Tamil Nadu', 'coimbatore': 'Tamil Nadu', 'madurai': 'Tamil Nadu',
  'hyderabad': 'Telangana',
  'kolkata': 'West Bengal',
  'lucknow': 'Uttar Pradesh', 'kanpur': 'Uttar Pradesh', 'agra': 'Uttar Pradesh', 'varanasi': 'Uttar Pradesh', 'noida': 'Uttar Pradesh', 'ghaziabad': 'Uttar Pradesh',
  'patna': 'Bihar',
  'bhopal': 'Madhya Pradesh', 'indore': 'Madhya Pradesh', 'gwalior': 'Madhya Pradesh',
  'chandigarh': 'Chandigarh',
  'amritsar': 'Punjab', 'ludhiana': 'Punjab', 'jalandhar': 'Punjab',
  'guwahati': 'Assam',
  'kochi': 'Kerala', 'thiruvananthapuram': 'Kerala',
  'bhubaneswar': 'Odisha',
  'ranchi': 'Jharkhand',
  'raipur': 'Chhattisgarh',
  'dehradun': 'Uttarakhand',
  'shimla': 'Himachal Pradesh'
};

const inferState = (city) => {
  if (!city) return '';
  const c = city.toString().toLowerCase().trim();
  // Try exact match or partial match
  for (const [key, value] of Object.entries(cityToStateMap)) {
    if (c.includes(key)) return value;
  }
  return '';
};

export const mapGuestData = (rawData) => {
  return rawData.map(row => {
    // Helper to find value by multiple possible header names (case-insensitive)
    const getVal = (aliases) => {
      const found = Object.keys(row).find(key => 
        aliases.some(alias => key.trim().toLowerCase() === alias.trim().toLowerCase())
      );
      return found ? row[found] : undefined;
    };

    const arrivingDate = getVal(['Arriving Date', 'Arrival Date', 'Arrival', 'Check In', 'Date Arrive']) || '';
    const departureDate = getVal(['Departure Date', 'Departure', 'Check Out', 'Date Depart']) || '';
    const durationFromSheet = parseNum(getVal(['Duration Of Stay (Days)', 'Stay Duration', 'Days', 'No of Days']));
    const calculatedDuration = calculateDays(arrivingDate, departureDate);
    
    const cityFrom = getVal(['City From Which You Arrive', 'From', 'Origin', 'City From', 'Coming From']) || '';
    const providedState = getVal(['State', 'Province', 'Region', 'State/UT']) || '';
    const state = providedState || inferState(cityFrom);

    return {
      email: getVal(['Email Address', 'Email']) || '',
      name: getVal(['Guest Name', 'Name', 'Full Name', 'Guest']) || '',
      address: getVal(['Full Address', 'Address', 'Current Address']) || '',
      nativePlace: getVal(['Mul Niwas', 'Native Place', 'Mool Niwas', 'Home Town']) || '',
      mobile: getVal(['Mobile Number', 'Mobile', 'Phone', 'Contact']) || '',
      arrivalDate: arrivingDate,
      departureDate: departureDate,
      arrivalReason: getVal(['Arrival Reason', 'Reason', 'Purpose']) || '',
      from: cityFrom,
      state: state,
      to: getVal(['Where You Want To Go', 'To', 'Destination', 'Going To']) || '',
      males: parseNum(getVal(['[Male]', 'Male', 'Males', 'Boys', 'No of Males'])),
      females: parseNum(getVal(['[Female]', 'Female', 'Females', 'Girls', 'No of Females'])),
      children: parseNum(getVal(['[Child]', 'Child', 'Children', 'No of Children', 'Kids'])),
      totalPersons: parseNum(getVal(['Total Person', 'Total Persons', 'Total People'])),
      vehicleType: getVal(['Vehicle Type', 'Vehicle', 'Mode']) || '',
      duration: calculatedDuration || durationFromSheet || 1,
      depositedAmount: parseNum(getVal(['Total Amount Deposited', 'Deposited Amount', 'Deposit'])),
      normalAmount: parseNum(getVal(['Normal Account', 'Normal Amount', 'Account'])),
      amountSpent: parseNum(getVal(['Total Amount Deposited', 'Deposited Amount', 'Deposit'])) + 
                   parseNum(getVal(['Normal Account', 'Normal Amount', 'Account'])),
      roomStatus: getVal(['Room Status', 'Status']) || '',
      caste: getVal(['Caste', 'Jaati', 'Category']) || ''
    };
  });
};
