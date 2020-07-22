var fs = require('fs');
var xmlData = fs.readFileSync('./settings.xml', 'utf8');
var parser = require('fast-xml-parser');

async function validateAndParse(data){
    var checkFile = parser.validate(data);
    if(checkFile === true) { //optional (it'll return an object in case it's not valid)
        return true;
    } else{
        var xmlDataToChange = data.split("\n")
        xmlDataToChange.splice(checkFile.err.line-1, 1);
        xmlData = xmlDataToChange.join("\n");
        return false;
    }
}
async function validateEachLine(data){
    var regex = /^[a-zA-Z0-9._ 	=<,:/?\/\-">]+$/;
    var xmlDataArray = data.split("\n");
    var finalArray = [];
    xmlDataArray.forEach(function(line){
        if(regex.test(line)){
            finalArray.push(line);
        }
    });
    console.log(finalArray);
    return finalArray.join("\n");
}

(async ()=>{
    while (! await validateAndParse(xmlData)){
        console.log(xmlData);
    }
    xmlData = await validateEachLine(xmlData);
    fs.writeFile('output.xml', xmlData, function(err, data) {
        if (err) {
          console.log(err);
        }
        else {
          console.log('updated!');
        }
      });
})();