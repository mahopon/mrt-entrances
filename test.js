$(document).ready(() => {
    let mrt = "woodlands".toUpperCase();
    
    startRetrieval(mrt);
});

function startRetrieval(mrt) {
    $("#data").append(`<h3>${mrt}</h3><ul id=${mrt}data></ul>`)
    let pageNum = 1;
    getData(mrt, pageNum);
}

async function getData(mrt, pageNum) {
    await sleep(1000);
    let url = `https://developers.onemap.sg/commonapi/search?searchVal=${mrt} mrt station exit&returnGeom=Y&getAddrDetails=Y&pageNum=${pageNum}`;
    $.get(url, (data) => {
        processData(mrt, data);
    })
}

function processData(mrt, data) {
    console.log(data);
    if (data.found < 1) {
        throw (new Error("No data"));
    }   
    
    const re = new RegExp(" MRT STATION EXIT ");
    
    for (let i = 0; i < data.results.length; i++) {
        let currentSelection = data.results[i];
        let searchVAL = currentSelection.SEARCHVAL;
        let searchBefore = searchVAL.search(re);
        let searchAfter = searchVAL.search(re) >= 0 ? searchBefore + 13 : searchBefore;
        if (searchAfter == -1 || searchVAL.slice(0,searchBefore) !== mrt)
            continue;

        $(`#${mrt}data`).append(`<li id="${mrt}item${searchVAL.slice(searchVAL.length -1, searchVAL.length)}">`+searchVAL.slice(searchAfter, searchVAL.length)+"</li> ");
        $(`#${mrt}item${searchVAL.slice(searchVAL.length -1, searchVAL.length)}`).append("<p>"+currentSelection.LATITUDE + ", "+ currentSelection.LONGITUDE+"</p>");
    }

    if (data.totalNumPages > 1 && data.pageNum + 1 <= data.totalNumPages) {
        getData(mrt, data.pageNum + 1)
    }
}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

