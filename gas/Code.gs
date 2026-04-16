// ===================================================
// Routine Recorder – Google Apps Script
// ===================================================
// デプロイ設定:
//   「ウェブアプリとしてデプロイ」
//   実行ユーザー : 自分
//   アクセス権限 : 全員（匿名を含む）
// デプロイ後に発行される URL を main.html の GAS_URL へ貼り付ける
// ===================================================

const SHEET_NAME   = 'records';
const SECRET_TOKEN = 'yk_routine_2026';

// ブラウザからの fetch(no-cors) は POST で飛んでくる
function doPost(e) {
  try {
    const p = e.parameter;
    if (p.secret !== SECRET_TOKEN) return buildResponse({ result: 'error', message: 'unauthorized' });
    appendRow(p);
    return buildResponse({ result: 'ok' });
  } catch (err) {
    return buildResponse({ result: 'error', message: err.message });
  }
}

// curl など直接 GET でテストしたい場合にも対応
function doGet(e) {
  try {
    const p = e.parameter;
    if (p.secret !== SECRET_TOKEN) return buildResponse({ result: 'error', message: 'unauthorized' });
    appendRow(p);
    return buildResponse({ result: 'ok' });
  } catch (err) {
    return buildResponse({ result: 'error', message: err.message });
  }
}

function appendRow(p) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['日付', '筋トレ', '料理', 'シャワー', '医学の勉強', '日記', '記録日時']);
  }

  sheet.appendRow([
    p.date    || '',
    Number(p.workout || 0),
    Number(p.cooking || 0),
    Number(p.shower  || 0),
    Number(p.study   || 0),
    Number(p.diary   || 0),
    new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
  ]);
}

function buildResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
