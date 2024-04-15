+ fix electron extensions popup
+ fix requestes to open a new window when in reality it should open a new tab
+ add the ability to pick a custom color sceme in the settings so that you can choose your own colors for light and dark theme
+ add better extention api support
+ finish migrating from remote modules to ipc
+ fix any potential memory leaks
+ fully fix the favicon loading system as some websites dont show there respective icons
+ fix something thats causing some websites to say it couldent loaad because you sent to many requests at once
+ start migrating the project to use the new WebContentsView Class instead of the now depricated BrowserView Class

NOTE:
i have downgraded the current version of electron to a still support version of electron which still utalizes the BrowserView Class, i will keep the project on this version untill i finish rewriting the class structure to use the newer WebContentsView Class

--- same applies to the electron-extensions and base-rpc packages.

--- even tho the base-rpc package is capible of utilizing the most up to date version of electron with no issue, i still downgraded it to the support version of electron as well to get rid of any potential compatibility issues