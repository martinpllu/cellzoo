# See it in action

<a href="https://cellzoo.netlify.com">https://cellzoo.netlify.com</a>

# Try it yourself

Here's one possible development setup. Other editors and tools are available!

* Download [Visual Studio Code](https://code.visualstudio.com)
* Install [node.js](https://nodejs.org/en/download/)
* Install the Typescript compiler:

```
npm install -g typescript
```

* Install lite-server, a little development web server that automatically reloads the browser when code is changed:

```
npm install -g lite-server
```

* Clone the repository and change into its directory:

```
git clone git@github.com:martinpllu/cellzoo.git
cd cellzoo
```

* Launch Visual Studio code:

```
code . 
```

* In vscode, select Tasks->Run Build Task to start the Typescript build running.

* Launch lite-server, which will open the cellzoo UI in your browser.
```
lite-server &       
```
* Now you can make code changes in vscode and see them reflected in the browser.



