var fs = require('fs');

process.stdin.setEncoding('utf8');

var lineReader = require('readline').createInterface({
  input: process.stdin
});

var firstLine = true;
var filePath = '';
var hasFile = false;
var parsingCode = false;
var writeStream;
lineReader.on('line', function (line) {
    //When testing, my match didn't work if I pegged it to the begging of line
    if (!hasFile && !!line.match("\[.*]\(.*\)$")) {
        //Assume any link right before a code block is a relative path
        hasFile = true;
        //Hack the link out of the markdown. Could be more elegant with a regex probablly. Eh
        var tempArray = line.split("(");
        filePath = tempArray[tempArray.length - 1];
        filePath = filePath.slice(0, filePath.length - 1);
    } else if (hasFile && !parsingCode) {
        //Check if we have a code block right after the link
        if (!!line.match("^```")) {
            //We did start a code block, assume we can create a file for the linked path
            //Any folders must be pre-created or you'll get an error
            writeStream = fs.createWriteStream(process.cwd() +'/'+ filePath);
            parsingCode = true;
        } else {
            //There was no code block right after the link, we don't do anything
            //Start looking for a link again
            hasFile = false;
        }
    } else if (parsingCode && !!line.match("^```")) {
        //we've hit the end of the code block
        //Start looking for a link
        parsingCode = false;
        hasFile = false;
    } else if (parsingCode) {
        //We're inside a code block, write the code to the file
        writeStream.write(line + "\n");
    }
});