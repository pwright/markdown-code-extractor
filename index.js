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
var linkMatcher = new RegExp("^\\[.*\\]\\(.*\\)$");
var codeDelimiterMatcher = new RegExp("^```");
lineReader.on('line', function (line) {
    lineNumber++;
    //When testing, my match didn't work if I pegged it to the begging of line
    if (!hasFile && linkMatcher.test(line)) {
         console.log("Link detected. Line Number: " + lineNumber + " Line: " + line);
        //Assume any link right before a code block is a relative path
        hasFile = true;
        //Hack the link out of the markdown. Could be more elegant with a regex probablly. Eh
        var tempArray = line.split("(");
        filePath = tempArray[tempArray.length - 1];
        filePath = filePath.slice(0, filePath.length - 1);
    } else if (hasFile && !parsingCode) {
        //Check if we have a code block right after the link
        if (codeDelimiterMatcher.test(line)) {
            console.log("Code block matched after link detection. Line Number: " + lineNumber);
            //We did start a code block,
            mkdirp(process.cwd() +'/'+ path.dirname(filePath), function (err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log('dir:'+process.cwd() +'/'+ path.dirname(filePath));
                }
            });
            writeStream = fs.createWriteStream(process.cwd() +'/'+ filePath);
            parsingCode = true;
        } else {
            console.log("No code block detected after link detection. Line Number: " + lineNumber);
            //There was no code block right after the link, we don't do anything
            //Start looking for a link again
            hasFile = false;
        }
    } else if (parsingCode && codeDelimiterMatcher.test(line)) {
        console.log("Code block terminated. Line Number: " + lineNumber);
        //we've hit the end of the code block
        //Start looking for a link
        parsingCode = false;
        hasFile = false;
    } else if (parsingCode) {
        //We're inside a code block, write the code to the file
        writeStream.write(line + "\n");
    }
});
