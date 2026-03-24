function doPost(e) {
  const sheet = SpreadsheetApp.openById("1eq0yWrU47896xQqa5Ps48ORWVYeUAelPEmhXkUj-jQE").getActiveSheet();

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp", "Participant ID", "First Grid Type",
      "Grid 1 Type", "Grid 1 Score", "Grid 1 Time (s)", "Grid 1 Accuracy (%)",
      "Grid 2 Type", "Grid 2 Score", "Grid 2 Time (s)", "Grid 2 Accuracy (%)"
    ]);
  }

  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
    data.participantId,
    data.firstGridType,
    data.grid1_type,
    data.grid1_score,
    data.grid1_time_s,
    data.grid1_accuracy_pct,
    data.grid2_type,
    data.grid2_score,
    data.grid2_time_s,
    data.grid2_accuracy_pct
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}