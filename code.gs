function doPost(e) {
  const sheet = SpreadsheetApp.openById("1eq0yWrU47896xQqa5Ps48ORWVYeUAelPEmhXkUj-jQE").getActiveSheet();

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp", "Participant ID",
      "Grid Score", "Grid Time (s)", "Grid Accuracy (%)"
    ]);
  }

  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
    data.participantId,
    data.grid_score,
    data.grid_time_s,
    data.grid_accuracy_pct
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}