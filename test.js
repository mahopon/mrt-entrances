$(document).ready(() => {

    $.get("https://developers.onemap.sg/commonapi/search?searchVal=telok blangah mrt station exit&returnGeom=Y&getAddrDetails=Y&pageNum=1", (data) => {
        console.log(data);
    })
    
})