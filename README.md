# Visual Grouping Speed Study

A single-page web app for running a human perception study that measures how quickly people can classify images depending on how well-arranged they are in a grid. The goal is to empirically demonstrate that higher grid layout scores (i.e. visually similar images placed near each other) lead to faster human processing times and validate the metric against real user performance.

---

## What It Does

Participants are shown two grids of 100 images and asked to label each image with one of 10 class categories. The time it takes to label all 100 images is recorded for each grid. One grid has a **high layout score** and one has a **low layout score**. Which grid is shown first is randomized per participant to counterbalance learning bias.

---

## App Flow

1. **Welcome screen** — brief explanation of the task
2. **Practice round** — an untimed 4×5 grid of 20 images to familiarize participants with the labeling UI
3. **Grid 1** — a timed 10×10 grid; timer starts the moment the grid renders
4. **Between screen** — shows the time for Grid 1 and prompts the participant to continue
5. **Grid 2** — second timed 10×10 grid with a different layout arrangement
6. **Done screen** — shows a summary of both times and saves results to Google Sheets

---

## Labeling Interaction

- A sidebar lists all 10 class labels, each with a color dot
- The participant clicks a label to select it, then clicks images in the grid to assign that class
- Clicking a labeled image again **removes** the label (toggle behavior)
- A counter next to each label tracks how many images have been assigned to it
- The timer stops automatically the moment the 100th image is labeled

---

## Data Collected

Each submission saves one row to Google Sheets with the following fields:

| Field | Description |
|---|---|
| `Timestamp` | Pacific time when the result was submitted |
| `Participant ID` | Randomly generated 8-character anonymous ID |
| `First Grid Type` | Whether the first grid shown was `high` or `low` score |
| `Grid 1 Type` | Layout type of Grid 1 (`high` or `low`) |
| `Grid 1 Score` | Numerical grid score of Grid 1 |
| `Grid 1 Time (s)` | Seconds taken to label all 100 images in Grid 1 |
| `Grid 2 Type` | Layout type of Grid 2 |
| `Grid 2 Score` | Numerical grid score of Grid 2 |
| `Grid 2 Time (s)` | Seconds taken to label all 100 images in Grid 2 |

---

## Setup

### 1. Add your images

In `index.html`, find the two `buildArrangement()` functions and replace the placeholder items with your actual image arrays:

```js
// Each item: { src: "path/to/image.jpg", classIndex: 0..9 }
// classIndex must match the CLASSES array (0 = Cats, 1 = Dogs, etc.)
```

Update the `CLASSES` array to match your actual categories:

```js
const CLASSES = [
  { name: "Cats",    emoji: "🐱", color: "#ff7f7f" },
  { name: "Dogs",    emoji: "🐶", color: "#ffb347" },
  // ...
];
```

Also update the grid scores to match your actual metric values:

```js
const GRID_SCORE_LOW  = 0.42;
const GRID_SCORE_HIGH = 0.87;
```

### 2. Set up Google Sheets

1. Create a new Google Sheet at [sheets.google.com](https://sheets.google.com) and copy its ID from the URL
2. Go to [script.google.com](https://script.google.com) and create a new project
3. Paste the following code:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.openById("YOUR_SPREADSHEET_ID").getActiveSheet();

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp", "Participant ID", "First Grid Type",
      "Grid 1 Type", "Grid 1 Score", "Grid 1 Time (s)",
      "Grid 2 Type", "Grid 2 Score", "Grid 2 Time (s)"
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
    data.grid2_type,
    data.grid2_score,
    data.grid2_time_s
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Click **Deploy → New deployment**, set type to **Web app**, execute as **Me**, access to **Anyone**
5. Copy the `/exec` URL

### 3. Connect the HTML to your endpoint

In `index.html`, replace the placeholder URL:

```js
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_ID/exec";
```

### 4. Deploy to GitHub Pages

Push `index.html` to a GitHub repository, enable Pages under **Settings → Pages**, and share the URL with participants. The app must be served from a real URL (not opened as a local file) for the Google Sheets connection to work.

---

## Testing Without Doing the Full Study

On the welcome screen, click **"🔧 Test save connection"** to jump straight to the results screen with dummy data and fire a test save. Check your Google Sheet for a row with `Participant ID: TEST_USER` to confirm the connection is working.

---

## Tech Stack

- Vanilla HTML, CSS, JavaScript — no framework, no build step
- [Fraunces](https://fonts.google.com/specimen/Fraunces) + [DM Mono](https://fonts.google.com/specimen/DM+Mono) via Google Fonts
- Google Apps Script as a serverless POST endpoint
- Google Sheets as the data store