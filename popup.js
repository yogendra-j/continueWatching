const showList = document.querySelector("ul");

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

chrome.history.search(
  {
    text: "watch hotstar",
    startTime: (new Date()).setFullYear(2010),
    maxResults: 100000
  },
  (result) => {
    let hotStartShows = [];
    let pattern = /Watch (.+) Season (\d+) Episode (\d+)/;
  
    result = result
      .filter(item => item.url && item.url.includes("bookmarkTime") && item.url.includes("/tv/"))
      .map(item => {
        return {name: item.title.match(pattern), url: item.url};
      })
      .forEach(i => {
        let item = i.name;
        let show = hotStartShows.find(val => val.name === item[1]) || 
        {
          name: item[1],
          seasons: {
          },
        };
        show.seasons[item[2]] = show.seasons[item[2]] || [];
        show.seasons[item[2]].push([item[3], i.url]);
        hotStartShows.find(val => val.name === item[1]) || hotStartShows.push(show);
      });
      console.log(hotStartShows);
    hotStartShows
    .map(show => [show.name + " season " + Math.max(...Object.keys(show.seasons)) + " episode " + Math.max(...show.seasons[Math.max(...Object.keys(show.seasons))].map(x => parseInt(x[0]))), show.seasons[Math.max(...Object.keys(show.seasons))].reduce((agg, cur) => agg[0] > cur[0] ? agg : cur)[1]])
    .forEach(show => addShowToList(show[0], show[1], "show"));
  }
);
