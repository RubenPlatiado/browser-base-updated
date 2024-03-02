@ -1,5 +1,5 @@
<p align="center">
    <a href="https://wexond.net"><img src="static/icons/icon.png" width="256"></a>
  <a href="https://wexond.net"><img src="static/icons/icon.png" width="256"></a>
</p>

<div align="center">
@ -52,13 +52,6 @@ Compiling and editing Chromium directly may be challenging and time consuming, s
- Omnibox with autocomplete algorithm similar to Chromium
- State of the art tab system

## To Do List

 + update the node.js version to a newer version
 + improve optimization while building
 + improve browsing performance
 + add the zoom feature

# Screenshots

![image](https://user-images.githubusercontent.com/11065386/81024159-d9388f80-8e72-11ea-85e7-6c30e3b66554.png)
@ -71,14 +64,16 @@ UI compact variant:
![image](https://user-images.githubusercontent.com/11065386/81024252-2ddc0a80-8e73-11ea-9f2f-6c9a4a175c60.png)

# Downloads
- [Stable and beta versions](https://github.com/IroniumStudios/browser-base-updated/releases)
- [Nightlies](https://github.com/IroniumStudios/browser-base-updated/releases)
- 
# [Roadmap](https://github.com/wexond/wexond/projects)

# Contributing

if you want to be added as a part of the github repo please email me at cleverdamontoutube@gmail.com
If you have found any bugs or just want to see some new features in Wexond, feel free to open an issue. Every suggestion is very valuable for us, as they help us improve the browsing experience. Also, please don't hesitate to open a pull request. This is really important to us and for the further development of this project.

By opening a pull request, you agree to the conditions of the [Contributor License Agreement](cla.md).

# Development

@ -118,10 +113,9 @@ $ npm i -g windows-build-tools
```

```bash
$ yarn install # Install needed depedencies.
$ yarn run build  # build native modules using Electron headers.
$ yarn run rebuild # this command rebuilds the headers using yarn
$ yarn run start # Starts the Wexond App
```

i do not have any access to the yarn building commands for linux or mac os
@ -152,4 +146,4 @@ Guides and the API reference are located in [`docs`](docs) directory.
This Project Uses a MIT License, which is free.

By sending a Pull Request, you agree that your code may be relicensed or sublicensed.
