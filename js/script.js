var inputBoxValue;
var svg = `<svg xmlns="http://www.w3.org/2000/svg" width="135" height="140" viewBox="0 0 135 140" fill="#f44336">
<rect y="10" width="15" height="120" rx="6">
    <animate attributeName="height" begin="0.5s" dur="1s" values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear" repeatCount="indefinite"/>
    <animate attributeName="y" begin="0.5s" dur="1s" values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear" repeatCount="indefinite"/>
</rect>
<rect x="30" y="10" width="15" height="120" rx="6">
    <animate attributeName="height" begin="0.25s" dur="1s" values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear" repeatCount="indefinite"/>
    <animate attributeName="y" begin="0.25s" dur="1s" values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear" repeatCount="indefinite"/>
</rect>
<rect x="60" width="15" height="140" rx="6">
    <animate attributeName="height" begin="0s" dur="1s" values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear" repeatCount="indefinite"/>
    <animate attributeName="y" begin="0s" dur="1s" values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear" repeatCount="indefinite"/>
</rect>
<rect x="90" y="10" width="15" height="120" rx="6">
    <animate attributeName="height" begin="0.25s" dur="1s" values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear" repeatCount="indefinite"/>
    <animate attributeName="y" begin="0.25s" dur="1s" values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear" repeatCount="indefinite"/>
</rect>
<rect x="120" y="10" width="15" height="120" rx="6">
    <animate attributeName="height" begin="0.5s" dur="1s" values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear" repeatCount="indefinite"/>
    <animate attributeName="y" begin="0.5s" dur="1s" values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear" repeatCount="indefinite"/>
</rect>
</svg>`
var result;







document.querySelector('.form').addEventListener('submit', function () {
  search()
}
);

async function search() {

  inputBoxValue = $('.inputBox').val()


  if (inputBoxValue == null || inputBoxValue == undefined || inputBoxValue.trim() == '') {
    Swal.fire(
      'Please a Valid Url !',
      '',
      'warning'
    )
  }
  else {
    $('.results-box').html(svg) // Displays loader

    document.querySelector('.searchBtn').setAttribute('disabled', true) // Makes search button disabled

    const url = `https://yt-api.p.rapidapi.com/search?query=${encodeURIComponent(inputBoxValue)}`; // Api Url
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '9f779432a8mshac0e322875fea12p1e7f1bjsnf9453aa627a2',
        'X-RapidAPI-Host': 'yt-api.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      result = await response.json();
      console.log(result)
    } catch (error) {
      Swal.fire(
        'Opss!',
        'Something went wrong! Why dont you try a bit latter? 😃',
        'error'
      )
      console.error(error);
    }
    DisplaysResult()
  }

}
function DisplaysResult() {
  document.querySelector('.results-box').innerHTML = ''
  document.querySelector('.searchBtn').removeAttribute('disabled')
  var resultHtml;
  result.data.forEach(r => {
    if (r.type != 'video') {
      return;
    }
    resultHtml = `
    <div data-aos="fade-up" data-aos-duration="1000" class="result w-75 border border-2 rounded-3 p-3 d-flex gap-4">
      <div class="thumbnail rounded-3">
          <img class="w-100 h-100 rounded-3" src="${r.thumbnail[0].url}" alt="">
      </div>

      <div class="py-3 w-50">

          <h5> ${r.title} </h5>

          <p>  ${r.description} </p>
          <div class="d-flex w-100 justify-content-between">
              <div class=" d-flex gap-2 align-items-center">
                  <img class="chanleThumbanil h-100 rounded-circle" src="${r.channelThumbnail[0].url}" alt=""> 
                  <p class="m-0">${r.channelTitle}</p>
              </div>
              <a id="${r.videoId}" onclick="downloadVid(this.id)" class="downloadBtn btn d-flex align-items-center gap-3">
                  <i class="fa-solid fa-circle-arrow-down"></i>
                  Download</a>
              <a id="${r.videoId}download" hidden></a>
          </div>
      </div>
  </div>`
    document.querySelector('.results-box').innerHTML += resultHtml
  })




}


var downloadResponse;
async function downloadVid(videoId) {

  const url = `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': config.X_RapidAPI_Key,
      'X-RapidAPI-Host': config.X_RapidAPI_Host
    }
  };

  try {
    const response = await fetch(url, options);
    downloadResponse = await response.json();
    handleDownload(videoId)
  } catch (error) {
    Swal.fire(
      'Opss!',
      'Something went wrong! Why dont you try a bit latter? Maybe you hit the limit for today.. 😃',
      'error'
    )
    console.error(error);
  }
}
function handleDownload(btnId) {
  document.getElementById(`${btnId}download`).href = downloadResponse.link
  document.getElementById(`${btnId}download`).setAttribute('download', true)
  document.getElementById(`${btnId}download`).click()
}



function extractVideoId(url) {
  let videoId = null;
  const pattern = /(?<=v=|v\/|vi=|vi\/|youtu.be\/|\/v\/|embed\/|\&v=|\?v=|\&vi=|\?vi=|\/embed\/)[^#\&\?]*/;

  const match = url.match(pattern);
  if (match) {
    videoId = match[0];
  }

  return videoId;
}

