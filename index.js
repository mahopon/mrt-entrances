$(document).ready(() => {
    $("#submitlist").click(() => {
        if ($("#mrtlist").get(0).files.length !== 0) {
            let file = $("#mrtlist").prop('files')[0];
            file.text()
            .then((data) => {
                let stations = data.split("\r\n");
                startRetrieval(stations);
            });
        } else 
            alert("ho");
    })
    
});

async function startRetrieval(stations) {
    let pageNum = 1;
    let timer = 2000;
    for (let i = 0; i < stations.length; i++) {
        console.log(stations[i]);
        getData(stations[i].toUpperCase(), pageNum);
        await sleep(timer);
    }
}

function getData(mrt, pageNum) {
    const mrtNoWs = mrt.replaceAll(" ", "").toLowerCase();
    let url = `https://developers.onemap.sg/commonapi/search?searchVal=${mrt} mrt station exit&returnGeom=Y&getAddrDetails=Y&pageNum=${pageNum}`;
    $.get(url, (data) => {
        if (data.found < 1) {
            $("#ndata").append(`<p>${mrt}</p><br>`)
            $("#data").append(`<h3>${mrt}</h3>`)
            return;
        }
        if (pageNum === 1)
            $("#data").append(`<h3>${mrt}</h3><ul id=${mrtNoWs}data></ul>`)
        processData(mrt, data);
    })
}

function processData(mrt, data) {
    console.log(data);
    const re = new RegExp(" MRT STATION EXIT ");
    const mrtNoWs = mrt.replaceAll(" ", "").toLowerCase();
    
    for (let i = 0; i < data.results.length; i++) {
        let currentSelection = data.results[i];
        let searchVAL = currentSelection.SEARCHVAL;
        let searchBefore = searchVAL.search(re);
        let searchAfter = searchBefore >= 0 ? searchBefore + 13 : searchBefore;
        if (searchAfter == -1 || searchVAL.slice(0,searchBefore) !== mrt)
            continue;

        $(`#${mrtNoWs}data`).append(`<li id="${mrtNoWs}item${searchVAL.slice(searchVAL.length -1, searchVAL.length)}">`+"<p>"+searchVAL.slice(searchAfter, searchVAL.length)+"</p></li>");
        $(`#${mrtNoWs}item${searchVAL.slice(searchVAL.length -1, searchVAL.length)}`).append("<p>"+ parseFloat(currentSelection.LATITUDE).toFixed(7) + ", "+ parseFloat(currentSelection.LONGITUDE).toFixed(7)+"</p><br>");
    }

    if (data.totalNumPages > 1 && data.pageNum + 1 <= data.totalNumPages) {
        getData(mrt, data.pageNum + 1)
    }
}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

