const { createObjectCsvWriter } = require('csv-writer');

async function writeReport(issues, outputPath) {
  const writer = createObjectCsvWriter({
    path: outputPath,
    header: [
      { id: 'url', title: 'URL' },
      { id: 'wrong', title: 'Wrong Text' },
      { id: 'suggestion', title: 'Suggestion' },
      { id: 'context', title: 'Sentence' },
    ],
  });
  await writer.writeRecords(issues);
}

module.exports = { writeReport };
