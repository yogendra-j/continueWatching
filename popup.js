const showList = document.querySelector("ul");

chrome.history.search(
  {
    text: "watch hotstar",
    startTime: new Date().setFullYear(2010),
    maxResults: 100000,
  },
  (result) => {
    let showsAdded = new Set();
    let pattern = /Watch (.+) Season (\d+) Episode (\d+)/;

    result
      .sort((a, b) => b.lastVisitTime - a.lastVisitTime)
      .filter(
        (historyItem) =>
          isEpisodeStreamingHistory(historyItem)
      )
      .map((historyItem) => {
        console.log(historyItem);
        let [_, showName, seasonNumber, episodeNumber] = historyItem.title.match(pattern);
        return { 
          name: showName,
          showListItemName: getShowListItemName(showName, seasonNumber, episodeNumber), 
          url: historyItem.url 
        };
      })
      .forEach((show) => {
        if (showsAdded.has(show.name)) return;
        showsAdded.add(show.name);
        addShowToList(show.showListItemName, show.url, "show");
      });
  }
);

function isEpisodeStreamingHistory(historyItem) {
  return historyItem.url &&
    historyItem.title &&
    historyItem.title.includes("Watch ") &&
    historyItem.title.includes(" Season ") &&
    historyItem.title.includes(" Episode ") &&
    historyItem.url.includes("/tv/");
}

function addShowToList(showName, url, className) {
  let node = document.createElement("li");
  let link = document.createElement("a");
  node.classList.add(className);
  link.setAttribute("href", url);
  link.setAttribute("target", "__blank");
  link.appendChild(document.createTextNode(showName));
  node.appendChild(link);

  document.querySelector("ul").appendChild(node);
}

function getShowListItemName(showName, seasonNumber, episodeNumber) {
  return `${showName} season ${seasonNumber} episode ${episodeNumber}`;
}
