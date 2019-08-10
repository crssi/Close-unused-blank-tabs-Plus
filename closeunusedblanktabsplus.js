/*
Close unused blank tabs Plus - A Firefox extension to close blank tabs that are not used

This extension was inspired by "Close unused blank tabs" created by Dustin Luck.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

Icon got from https://www.iconfinder.com/icons/2030/remove_tab_icon (issued under LGPL).
*/

const blankTabUrls = ['about:blank', 'about:home', 'about:newtab', 'about:privatebrowsing'];
const blankTabTitles = ['တပ်ဗ်အသစ်ဖွင့်', '新标签页', '新分頁', '新しいタブ', 'ផ្ទាំងថ្មី', 'ແທັບໃຫມ່', 'แท็บใหม่'];

function handleCreated() {
    chrome.tabs.query({},
      function(tabs) {
        for (let tab of tabs) {

          if (tab.active &&
            tab.status === 'loading' &&
            tab.url.startsWith('moz-extension://') &&
            ((tab.title.split(' ').length - 1) === 1 || blankTabTitles.includes(tab.title))) {
              var newTab = tab.url;
              break;
            }

          if (tab.status === 'complete' &&
            tab.url.startsWith('moz-extension://') &&
            tab.url.endsWith('/modules/freshtab/home.html') &&
            tab.title.startsWith('Cliqz ')) {
              var newTab = tab.url;
              break;
            }
        }

        var tabsToRemove = new Array();
        for (let tab of tabs) {
          if ((blankTabUrls.includes(tab.url) || tab.url === newTab) &&
            ((tab.title.split(' ').length - 1) === 1 || blankTabTitles.includes(tab.title))) {
              tabsToRemove.push(tab.id);
            }
        }

        tabsToRemove.pop();
        for (let tabToRemove of tabsToRemove) {
          chrome.tabs.remove(tabToRemove);
        }
    });
}

chrome.tabs.onCreated.addListener(handleCreated);
chrome.runtime.onInstalled.addListener(handleCreated);
