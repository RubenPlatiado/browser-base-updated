<p align="center">
  <a href="https://wexond.net"><img src="static/icons/icon.png" width="256"></a>
</p>

<div align="center">
  <h1>Wexond Browser Base</h1>

[![Actions Status](https://github.com/wexond/desktop/workflows/Build/badge.svg)](https://github.com/wexond/desktop/actions)
[![Downloads](https://img.shields.io/github/downloads/wexond/desktop/total.svg?style=flat-square)](https://wexond.net)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fwexond%2Fwexond.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fwexond%2Fwexond?ref=badge_shield)
[![PayPal](https://img.shields.io/badge/PayPal-Donate-brightgreen?style=flat-square)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VCPPFUAL4R6M6&source=url)
[![Discord](https://discordapp.com/api/guilds/307605794680209409/widget.png?style=shield)](https://discord.gg/P7Vn4VX)

Wexond Base is a modern web browser, built on top of modern web technologies such as `Electron` and `React`, that can also be used as a framework to create a custom web browser (see the [License](#license) section).

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

![Screenshot 2024-03-02 182023](https://github.com/IroniumStudios/browser-base-updated/assets/137374946/a559db62-b518-487b-a0cb-aab181e515eb)

UI normal variant:

![Screenshot 2024-03-02 182618](https://github.com/IroniumStudios/browser-base-updated/assets/137374946/1d0e81bb-2bfb-42f2-b576-e2359fc1f076)

UI compact variant:
![image](https://user-images.githubusercontent.com/11065386/81024222-13099600-8e73-11ea-9fc9-3c63a034403d.png)
![image](https://user-images.githubusercontent.com/11065386/81024252-2ddc0a80-8e73-11ea-9f2f-6c9a4a175c60.png)

# Downloads
- [Stable and beta versions](https://github.com/IroniumStudios/browser-base-updated/releases/tag/7.0.1)
- [Nightlies](https://github.com/IroniumStudios/browser-base-updated/releases/tag/7.0.1)

# To Do List

+ update the node.js version to a newer version (Complete)
+ improve optimization while building
+ improve browsing performance
+ add the zoom feature

### Instructions for setting up your build environment for windows

+ Download nvm (Node Version Manegar) from [`here`](https://github.com/coreybutler/nvm-windows)
  
+ after installing NVM Run your Command Prompt as Admin then type the following command
  
```bash
nvm install 21.6.2 # this installed the compatible version of node.js for this project
```

after installing the correct version of node.js we want the nvm to use this version as its main defalt version slot, you can do this by running

```bash
nvm use 21.6.2 # sets the version you specified as defalt
```

make sure you have the 29.1.0 version of electron installed, you can do so by running this command

```bash
npm install electron@29.1.0
```

+ Next up is installing yarn, which you can find from [`here`](https://classic.yarnpkg.com/en/docs/install/#windows-stable)

Make sure you have build tools installed. You can install them by running this command as **administrator**:

+ if you need to install windows build tools the command is here just in case but in reality newer versionf of node.js have windows build tools built in, this command is here just in case the project pulls from the native install, which happens sometimes

```bash
npm i -g windows-build-tools
```

# Building and Running Commands

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

# Note
+ i am currently working on implamenting steps for linux and mac os users, as of now i am sorry
  Reason being is because i only have a windows system and am working on finding proper instructions

More commands can be found in [`package.json`](package.json).

# Documentation

Guides and the API reference are located in [`docs`](docs) directory.

# License

This Project Uses a MIT License, Which is free.
