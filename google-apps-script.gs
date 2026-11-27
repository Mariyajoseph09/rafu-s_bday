/**
 * Google Apps Script for Rafu Turns One RSVP -> Google Sheets
 *
 * IMPORTANT: Open this script directly from your Google Sheet via:
 *   Extensions -> Apps Script
 * That automatically links it to your "rafu's bday" sheet with no ID needed.
 * (Optional) If created standalone, paste your full Sheet URL below.
 */

var SPREADSHEET_URL = '';

function getTargetSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss && SPREADSHEET_URL) {
    ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  }
  if (!ss) {
    throw new Error('No linked Google Sheet found. Open Extensions -> Apps Script from your sheet, or set SPREADSHEET_URL.');
  }
  return ss.getSheets()[0];
}

function doGet() {
  var sheet = getTargetSheet();
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      sheetName: sheet.getName(),
      rows: sheet.getLastRow()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    var sheet = getTargetSheet();

    // Add header row automatically if the sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Attending', 'Guests', 'Message']);
    }

    var data = {};
    if (e && e.parameter && e.parameter.name) {
      data = e.parameter;
    } else if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    var timestamp = data.timestamp ? new Date(data.timestamp) : new Date();
    var name = data.name || '';
    var attending = data.attending === 'yes' ? 'Yes' : 'No';
    var guests = Number(data.guests || 0);
    var message = data.message || '';

    sheet.appendRow([timestamp, name, attending, guests, message]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
