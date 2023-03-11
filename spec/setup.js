const reporters = require('jasmine-reporters');

// var terminalReporter = new reporters.TerminalReporter({
//   verbosity: 3,
//   color: true,
//   showStack: true
// });

// var junitReporter = new reporters.JUnitXmlReporter({
//   savePath: path.join(__dirname, "..", "reports"),
//   filePrefix: "nodejs",
//   consolidateAll: true
// });

var tapReporter = new reporters.TapReporter();
jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(tapReporter);
