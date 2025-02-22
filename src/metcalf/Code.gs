function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function Submit(data) {
  var sheet = SpreadsheetApp.openById("19OiIq7F_LFC7_nznZ-iIp3voSJqRdjwvpJvYPigP57U").getSheetByName("Bookings");

  if (!data || !data.date || !data.startTime || !data.endTime) {
    return "Error: Missing required fields.";
  }

  sheet.appendRow([data.date, data.startTime, data.endTime]);
  SpreadsheetApp.flush();
  return "Successfully booked!";

}