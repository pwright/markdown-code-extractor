var fs = require('fs');
var mkdirp  = require('mkdirp');
var path = require('path');

process.stdin.setEncoding('utf8');

var lineReader = require('readline').createInterface({
  input: process.stdin
});

var firstLine = true;
var filePath = '';
var hasFile = false;
var parsingCode = false;
var writeStream;
var lineNumber = 0;
var linkMatcher = new RegExp("(<!--didact.*)");
var codeDelimiterMatcher = new RegExp("^```");
lineReader.on('line', function (line) {
    lineNumber++;
    console.log(line);
    //When testing, my match didn't work if I pegged it to the begging of line
    if (!hasFile && linkMatcher.test(line)) {
         //console.log("Link detected. Line Number: " + lineNumber + " Line: " + line);
        //Assume any link right before a code block is a relative path
        hasFile = true;
        //Hack the name out of the markdown. Could be more elegant with a regex probablly. Eh
        //var tempArray = line.split("(");
        //filePath = tempArray[tempArray.length - 1];
        filePath=ExtractValue(line,"Name"); // Get the "Name" key value
        
        //console.log(filePath);
    } else if (hasFile && !parsingCode) {
        //Check if we have a code block right after the link
        if (codeDelimiterMatcher.test(line)) {
            //console.log("Code block matched after link detection. Line Number: " + lineNumber);
            //We did start a code block,
            mkdirp.sync(process.cwd() +'/'+ path.dirname(filePath));
            writeStream = fs.createWriteStream(process.cwd() +'/'+ filePath);
            parsingCode = true;
        } else {
            //console.log("No code block detected after link detection. Line Number: " + lineNumber);
            //There was no code block right after the link, we don't do anything
            //Start looking for a link again
            hasFile = false;
        }
    } else if (parsingCode && codeDelimiterMatcher.test(line)) {
        //console.log("Code block terminated. Line Number: " + lineNumber);
        //we've hit the end of the code block
        

       
       try {
        text = fs.readFileSync(filePath, "utf-8");
      }
      catch(err) {
        text = 'initialized, run script again'
      }


        var didacturl = encodeURIComponent(text);
        console.log("[Do it](didact://?commandId=vscode.didact.sendNamedTerminalAString&text=setup$$" + didacturl + ")")
        //Start looking for a link
        parsingCode = false;
        hasFile = false;
    } else if (parsingCode) {
        //We're inside a code block, write the code to the file
        writeStream.write(line + "\n");
    }
});

function ExtractValue(data,key){
    var rx = new RegExp(key + ":(.*?)\\s+--");
    var values = rx.exec(data); // or: data.match(rx);
    return values && values[1];
};

