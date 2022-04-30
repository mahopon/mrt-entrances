$(document).ready(() => {
    var mrt = "woodlands".toUpperCase();
    var pageNum = 1;
    
    console.log(mrt);
    getData(mrt, pageNum);
});

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
        let searchBefore = currentSelection.SEARCHVAL.search(re);
        let searchAfter = currentSelection.SEARCHVAL.search(re) >= 0 ? searchBefore + 13 : searchBefore;
        if (searchAfter == -1)
            throw (new Error("No data"));

        if (currentSelection.SEARCHVAL.slice(0,searchBefore) !== mrt) {
            continue;
        };
        console.log(currentSelection.SEARCHVAL.slice(searchAfter, currentSelection.SEARCHVAL.length));
        console.log(currentSelection.LATITUDE + ", "+ currentSelection.LONGITUDE);
    }

    if (data.totalNumPages > 1) {
        for (let i = data.pageNum+1; i <= data.totalNumPages; i++)
            getData(mrt, i)
    }
}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

