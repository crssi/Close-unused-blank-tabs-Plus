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
const blankTabTitles = ["New Tab","Nov zavihek","新标签页","新分頁","Nueva pestaña","Nueva Pestanya","नया टैब","لسان جديد","নতুন ট্যাব","Nova aba","Novo separador","Новая вкладка","新しいタブ","ਨਵੀਂ ਟੈਬ","Nouvel onglet","Tab Baru","Neuer Tab","Nuova scheda","Nowa karta","Cliqz Tab" ,"Bagong Tab","Cluaisín Nua","Dirica matidi manyen","Filă nouă","Fitxa berria","Iccer amaynut","Ivinell nevez","Jauna cilne","K'ak'a' ruwi'","Llingüeta nueva","Nauja kortelė","Neuvo feuggio","Nieuw tabblad","Nij ljepblêd","Nov tab","Nová karta","Nova kartica","Nova langeto","Nova lapela","Nove scheda","Novi tab","Nový panel","Nowy rajtark","Nowy rejtark","Ny fane","Ny flik","Nýr flipi","Nyt faneblad","Onglet novèl","Pestanya nova","Rakïj ñanj nakàa","Skedë e Re","Tab Barô","Tab Newydd","Taba ùr","Tabbere hesere","Tendayke Pyahu","Thẻ mới","Új lap","Uus kaart","Uusi välilehti","Yangi ichki oyna","Yañı İlmek","Yeni Sekme","Yeni Vərəq","Νέα καρτέλα","Жаңа бет","Нов раздел","Нова вкладка","Новая картка","Нови језичак","Ново јазиче","ახალი ჩანართი","Նոր ներդիր","לשונית חדשה","زبانه جدید","نیا ٹیب","नयाँ ट्याब","नव टैब","नवीन टॅब","নতুন টেব","નવી ટૅબ","புதிய கீற்று","కొత్త ట్యాబు","ಹೊಸ ಹಾಳೆ","പുതിയ ടാബ്","නව ටැබය","แท็บใหม่","ແທັບໃຫມ່","တပ်ဗ်အသစ်ဖွင့်","ផ្ទាំង​ថ្មី","새 탭"];


function onTabCreated() {
  browser.tabs.query({},
    async function(tabs) {

      for (let tab of tabs) {
        if ((tab.url.startsWith('moz-extension://') || blankTabUrls.includes(tab.url)) &&
          blankTabTitles.includes(tab.title)) {
            var blankTabUrl = tab.url;
            break;
          }
      }
      // console.log("[NEWTAB URL]: " + blankTabUrl);

      let tabsToRemove = new Array();
      for (let tab of tabs) {
        if (! tab.active &&
          (tab.url === blankTabUrl || blankTabUrls.includes(tab.url)) &&
          blankTabTitles.includes(tab.title)) {
            tabsToRemove.push(tab.id);
        }
        // console.log("        [ID]: " + tab.id + " [URL]: " + tab.url + " [T]: " + tab.title + " [S]: " + tab.status + " [A]: " + tab.active);
      }

      for (let tabToRemove of tabsToRemove) {
        await browser.tabs.remove(tabToRemove);
        // console.log("[REMOVE  ID]: " + tabToRemove);
      }

      var sessions = await browser.sessions.getRecentlyClosed({});
      // console.log(JSON.stringify(sessions));
      for (let session of sessions) {
        if (session.tab.url === blankTabUrl || blankTabUrls.includes(session.tab.url)) {
            browser.sessions.forgetClosedTab(session.tab.windowId, session.tab.sessionId);
        }
      }

  });
}

browser.tabs.onCreated.addListener(onTabCreated);
browser.runtime.onInstalled.addListener(onTabCreated);
