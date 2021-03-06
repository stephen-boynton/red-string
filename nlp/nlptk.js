const _ = require("lodash");
const { getUniqueTags } = require("./tokenizer");
const { returnTagObjs } = require("./regex");

//Python child process
function nlptk(text) {
  let textArr = [];
  let splitText = [];
  let taggedArr = [];
  let filteredArr = [];
  return new Promise((resolve, reject) => {
    const spawn = require("child_process").spawn;
    const py = spawn("python3", [__dirname + "/nlptk.py"]);
    py.stdout.on("data", function(text) {
      textArr.push(text.toString());
      splitText = _.split([textArr], "\n");
      fliptext = _.map(splitText, _.trim);
      // taggedArr = _.filter(splitText, /\(.*\)/g);
      taggedArr = fliptext.filter(stuff => stuff.indexOf("(") > -1);
      // textString += text.toString();
    });
    py.stdout.on("end", function() {
      // console.log("Data! ", textArr);
      resolve((filteredArr = getUniqueTags(taggedArr)));
    });
    py.stderr.on("data", data => {
      console.log(`stderr: ${data}`);
    });
    py.stdin.write(JSON.stringify(text));
    py.stdin.end();
  });
}

function getTagArr(regEx, nlp) {
  const finalArr = nlp.concat(regEx);
  return finalArr;
}

module.exports = { nlptk, getTagArr };
