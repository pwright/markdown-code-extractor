# Test Mark Down

[Test Link!](http://notarealurl.com)
The above link should not do anything


<!--didact-requirementCheck, Name:req-ls.sh -->
```bash
ls
```
[Do it](didact://?commandId=vscode.didact.sendNamedTerminalAString&text=setup$$ls%0A)


<!--didact-command, Name:00-start.sh -->
```bash
ls -al
```
[Do it](didact://?commandId=vscode.didact.sendNamedTerminalAString&text=setup$$ls%20-al%0A)

<!--didact-command, Name:01-verify.sh -->
```bash
more ../README.md
```
[Do it](didact://?commandId=vscode.didact.sendNamedTerminalAString&text=setup$$more%20..%2FREADME.md%0A)

end
