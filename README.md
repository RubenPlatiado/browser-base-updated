<p align="center">
  <a href="https://wexond.net"><img src="static/icons/icon.png" width="256"></a>
</p>

<div align="center">
  <h1>Wexond Browser Base</h1>

[![Actions Status](https://github.com/IroniumStudios /desktop/workflows/Build/badge.svg)](https://github.com/IroniumStudios /desktop/actions)
[![Downloads](https://img.shields.io/github/downloads/wexond/desktop/total.svg?style=flat-square)](https://wexond.net)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fwexond%2Fwexond.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fwexond%2Fwexond?ref=badge_shield)

if you consider supporting me, please donate to my cashapp
<CashApp><https://cash.app/$smithy920>

Wexond Base is a modern web browser, built on top of modern web technologies such as `Electron` and `React`, that can also be used as a framework to create a custom web browser (see the [License](#license) section).

[NOTE: the base-rpc project is a fork of the wexond rpc project, my fork can be found by clicking this text if you wish to only use rpc](https://github.com/IroniumStudios/base-rpc)

</div>

# Table of Contents:
- [Motivation](#motivation)
- [Features](#features)
- [Screenshots](#screenshots)
- [Downloads](#downloads)
- [Contributing](#contributing)
- [Development](#development)
  - [Running](#running)
- [Documentation](#documentation)
- [License](#license)

# Motivation

this project was a very good one, it brought intresting things to the table for wexond, and they discontenued the original project, so i did the honers of forking it and reviving it for years to come.

--From The Wexond Devs--
Compiling and editing Chromium directly may be challenging and time consuming, so we decided to build Wexond with modern web technologies. Hence, the development effort and time is greatly reduced. Either way Firefox is based on Web Components and Chrome implements new dialogs in WebUI (which essentially is hosted in WebContents).

# Features

- **Wexond Shield** - Browse the web without any ads and don't let websites to track you. Thanks to the Wexond Shield powered by [Cliqz](https://github.com/cliqz-oss/adblocker), websites can load even 8 times faster!
- **Chromium without Google services and low resources usage** - Since Wexond uses Electron under the hood which is based on only several and the most important Chromium components, it's not bloated with redundant Google tracking services and others.
- **Fast and fluent UI** - The animations are really smooth and their timings are perfectly balanced.
- **Highly customizable new tab page** - Customize almost an every aspect of the new tab page!
- **Customizable browser UI** - Choose whether Wexond should have compact or normal UI.
- **Tab groups** - Easily group tabs, so it's hard to get lost.
- **Scrollable tabs**
- **Partial support for Chrome extensions** - Install some extensions directly from Chrome Web Store\* (see [#110](https://github.com/wexond/wexond/issues/110)) (WIP)

## Other basic features

- Downloads popup with currently downloaded items (download manager WebUI page is WIP)
- History manager
- Bookmarks bar & manager
- Settings
- Find in page
- Dark and light theme
- Omnibox with autocomplete algorithm similar to Chromium
- State of the art tab system

# Screenshots

![Screenshot 2024-03-02 182023](https://github.com/IroniumStudios/browser-base-updated/assets/137374946/5311a01f-8fe2-45cd-b770-15d9515816fd)

UI normal variant:

![Screenshot 2024-03-02 182618](https://github.com/IroniumStudios/browser-base-updated/assets/137374946/1d0e81bb-2bfb-42f2-b576-e2359fc1f076)

UI compact variant:

![Screenshot 2024-03-02 182544](https://github.com/IroniumStudios/browser-base-updated/assets/137374946/dab7707e-1b37-4183-95bb-172027b50f73)

![Screenshot 2024-03-02 182544](https://github.com/IroniumStudios/browser-base-updated/assets/137374946/38092ab3-1081-4f20-bd26-a9ebd84bc342)


# Downloads
- [Stable and beta versions]([https://github.com/IroniumStudios/browser-base-updated/releases/tag/7.0.1](https://github.com/IroniumStudios/browser-base-updated/releases/tag/7.2.0))
- [Nightlies](https://github.com/IroniumStudios/browser-base-updated/releases/tag/7.2.0)

# To Do List
+ Fix Bugs

### Instructions for setting up your build environment for windows, Linux and mac os

+ if your starting on linux or mac os this is the following command below before installing npm


```bash
sudo apt update # Checks for the latest version
```


+ Now for installing npm on mac os and linux run the following command in your terminal


```bash
sudo apt install npm # this command will install npm for linux and mac os
```


+ To Help you keep track of all your versions and make things a little easier for you, Download nvm (Node Version Manegar) from [`here`](https://github.com/coreybutler/nvm-windows)

  
+ after installing NVM Run your terminal or Command Prompt, then type the following command

  
```bash
nvm install 21.7.1 # this installed the compatible version of node.js for this project
```


after installing the correct version of node.js we want the nvm to use this version as its main defalt version slot, you can do this by running


```bash
nvm use 21.7.1 # sets the version you specified as defalt if your on windows but this command is also required to be ran on linux and mac os as well
```


and if your using linux or mac os run this command alongsize the other one


```bash
nvm alias default 21.7.2 # Sets the node version as the main defalt alias on linux and mac os
```


make sure you have the 29.1.6 version of electron installed, you can do so by running this command in your terminal or command prompt


```bash
npm install -g electron@29.1.6
```


+ Next up is installing yarn, which you can find from [`here`](https://classic.yarnpkg.com/en/docs/install/#windows-stable)


#### Note: New Versions of Node.js No Longer Need Windows Build Tools Alongside it but the command is here just in case


Make sure you have build tools installed. You can install them by running this command as **administrator**:


+ if you need to install windows build tools the command is below


```bash
npm i -g windows-build-tools
```


### Building and Running Commands for Linux, mac os, and windows

#### open the base-rpc folder and run this command

```bash
yarn install # Install needed depedencies for base-rpc.
```
#### open the embedded-packages-electron-extentions folder and run this command

```bash
yarn install # Install needed depedencies for electron-extentions
```

#### Now go back to the main browser-base-updated folder and run the commands below

```bash
 yarn install # Install needed depedencies.
 yarn run build # Builds native modules using Electron headers.
 yarn run rebuild # Rebuilds native modules using Electron headers.
 yarn run start # Starts the Wexond App
```

### Compiling and yarn lint Commands for Windows


```bash
 yarn compile-win32 # Package Wexond for Windows
 yarn lint # Runs linter
 yarn lint-fix # Runs linter and automatically applies fixes
```


### Compiling and yarn lint Commands for Linux and mac os


```bash
$ yarn compile-linux # Package Wexond for Linux
$ yarn compile-darwin # Package Wexond for macOS
```

### Note
even tho this project will work on linux and mac os, i dont officially post it in the releases section of the repo quit yet but it is confermed to work on linux and mac os perfect as i have tested, so if you use linux and mac os for now you will haf to build the project before you start web browsing.

More commands can be found in [`package.json`](package.json).

# Documentation

Guides and the API reference are located in [`docs`](docs) directory.

# License

This Project Uses a MIT License, Which is free.
