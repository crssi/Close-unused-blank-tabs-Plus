/*
Close unused blank tabs Plus - A Firefox extension to close blank tabs that are not used

This is a fork of "Close unused blank tabs" created by Dustin Luck, due to the author of the original web exension is not reacheable.
I have decided to make a small changes, since the original web extension have problems opening multiple links at once.

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
var blankTab = null;

function handleCreated(sourceTab) {
  chrome.tabs.query({active: true},
    function(tabs) {
      for (var tab of tabs) {
        if (tab.id === sourceTab.id &&
          tab.status === 'loading' &&
          tab.url.startsWith('moz-extension://') &&
          (tab.title.indexOf(' ') !== -1 || blankTabTitles.includes(tab.title))) {
            // console.log("Active [URL] " + tab.url + " [TITLE] " + tab.title + " [STATUS] " + tab.status + " [ID]" + tab.id + " [SourceID]" + sourceTab.id);
            blankTab = tab.url;
        }
      }
  });

  chrome.tabs.query({active: false, windowId: sourceTab.windowId},
    function(tabs) {
      for (var tab of tabs) {
        // console.log("        [URL] " + tab.url + " [TITLE] " + tab.title + " [STATUS] " + tab.status + " [ID]" + tab.id + " [SourceID]" + sourceTab.id);
        if (tab.id !== sourceTab.id &&
          tab.status === 'complete' &&
          (blankTabUrls.includes(tab.url) || tab.url === blankTab) &&
          (tab.title.indexOf(' ') !== -1 || blankTabTitles.includes(tab.title))) {
            chrome.tabs.remove(tab.id);
            // console.log("Remove [URL] " + tab.url + " [TITLE] " + tab.title + " [STATUS] " + tab.status + " [ID]" + tab.id + " [SourceID]" + sourceTab.id);
        }
      }
  });
}

chrome.tabs.onCreated.addListener(handleCreated);
