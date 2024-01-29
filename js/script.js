var API_Key;
import('/config.js').then(config => {
  API_Key = config.Key.API_Key;
});
var inputBoxValue; //To save user input
var dynamicThumbnail; //To Check if dynamicThumbnail, if (true) enable them  
var result; //To store the api response after user searches
var downloadResponse; //To store the download api response
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

window.onload = (event) => {
  $(".settingsButton").on("click", function () {
    MicroModal.show('settingsModal')
  }); //Shows the setting modal when the triger button is clicked
  var YtMp3Data = localStorage.getItem('YtMp3Data'); //Gets app data from localStorage
  //Check if ther is app data on localStorage
  if (YtMp3Data == null) { setTheme('light') } //If not call setTheme to create app data
  else {
    YtMp3Data = JSON.parse(YtMp3Data); //Convert data from string to json
    applyTheme(YtMp3Data.theme); //Aply theme based on data in localStorage
    var themeInput = document.getElementById('themeChangeInput') //Stores the theme switch input
    if (YtMp3Data.theme === 'dark') { themeInput.checked = true } //If theme in localStorage is dark,turn the input on

    if (YtMp3Data.dynamicThumbnail == false) { dynamicThumbnail = false } //Make the dynamicThumbnail variable false if dynamicThumbnails are false in localStorage
    else if (YtMp3Data.dynamicThumbnail == true) { dynamicThumbnail = true } //Else make it true
    var thumbnailInput = document.getElementById('thumbnailChange'); //Stores the thumbnail switch input
    if (dynamicThumbnail == true) thumbnailInput.checked = true; //If dynamicThumbanil in localStorage is true,turn the input on
  }
};

$('.form').on('submit', function (event) {
  search();
  event.preventDefault();
}); //When form is submited calls search()

async function search() {
  inputBoxValue = $('.inputBox').val() //Make the user input variable equal to search input 
  //Check if user input is null|empty|empty string|white spaces 
  if (inputBoxValue == null || inputBoxValue == undefined || inputBoxValue.trim() == '') {
    Swal.fire(
      'Please type a valid Url or query!',
      '',
      'warning'
    ) // If so propmt an error to user
  }
  else {
    $('.results-box').html(svg) // Displays loader
    document.querySelector('.searchBtn').setAttribute('disabled', true) // Makes search button disabled
    const url = `https://yt-api.p.rapidapi.com/search?query=${encodeURIComponent(inputBoxValue)}`; // Api Url with the user input
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_Key,
        'X-RapidAPI-Host': 'yt-api.p.rapidapi.com'
      }
    }; //Api options

    try {
      const response = await fetch(url, options); //Call Api
      result = await response.json(); //Conver api response to json
      DisplaysResult(); //If evrything went ok, display the results
    } catch (error) {
      Swal.fire(
        'Opss!',
        `Something went wrong! Why don't you try a bit later? Maybe you hit the limit for today.. 😃`,
        'error'
      )
    } // If not promt an error message to user
  }

} //Make the api call to search for songs

function DisplaysResult() {
  document.querySelector('.results-box').innerHTML = '' //Clears the result parent div html
  document.querySelector('.searchBtn').removeAttribute('disabled') //Makes the search button available again
  var resultHtml; //To save the html code of a single result
  // To iteritate in the api response variable
  result.data.forEach(r => {
    //Check if the response is a video or a channel
    if (r.type != 'video') {
      return; //Is so skip the response
    }
    var videoThumbnail = r.thumbnail[0].url; //To store the video thumbnail
    //If dynamicThumbnail is enabled,pass the dynamic url from response to the videoThumbnail variable
    if (dynamicThumbnail && r.richThumbnail != null && r.richThumbnail.length != 0) { videoThumbnail = r.richThumbnail[0].url }
    resultHtml = `
    <div class="result w-75 border border-2 rounded-3 p-3 d-flex gap-4">
      <div class="thumbnail rounded-3 position-relative">
          <img class="w-100 h-100 rounded-3" src="${videoThumbnail}" alt="">
          <div class="position-absolute w-100 h-100 bg-red top-0 rounded-3 toYoutubeParent d-flex ">
          <a href="https://www.youtube.com/watch?v=${r.videoId}" class="btn m-auto text-white border toYoutubeBtn" target="_blank"><i class="fa-brands fa-youtube me-2"></i> Open On YouTube</a>
      </div>
      </div>

      <div class="py-3 w-50 d-flex flex-column justify-content-between">
          <div>
          <h5> ${r.title} </h5>
          <p>  ${r.description} </p>
          </div>
          
          <div class="d-flex w-100 justify-content-between">
              <div class="d-flex align-items-center">
                  <a href="https://www.youtube.com/channel/${r.channelId}" target="_blank" class="m-0 channelLink">
                    <img class="chanleThumbanil h-100 rounded-circle me-2" src="${r.channelThumbnail[0].url}" alt=""> 
                     ${r.channelTitle}
                  </a>
              </div>
              <a id="${r.videoId}" onclick="downloadVid(this.id)" class="downloadBtn btn d-flex align-items-center gap-3">
                  <i class="fa-solid fa-circle-arrow-down"></i>
                  Download</a>
              <a id="${r.videoId}download" hidden></a>
          </div>
      </div>
  </div>`
    document.querySelector('.results-box').innerHTML += resultHtml //To add te result html to its parent div
  })

} //Display search results to user

async function downloadVid(videoId) {
  const url = `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`; //Download api url with video
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': API_Key,
      'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
    }
  }; //Api options

  try {
    const response = await fetch(url, options); //Call api
    downloadResponse = await response.json(); //Conver response to json
    handleDownload(videoId) //If evrything went ok call download function
  } catch (error) {
    //If not prompt an error message to user
    Swal.fire(
      'Opss!',
      `Something went wrong! Why don't you try a bit later? Maybe you hit the limit for today.. 😃`,
      'error'
    )
  }
} //Calls the download api,an music id is required wich is equal to the id of the button that4 trigerd the function

function handleDownload(btnId) {
  document.getElementById(`${btnId}download`).href = downloadResponse.link; //Sets the href of the link to the download url, from download api response
  document.getElementById(`${btnId}download`).setAttribute('download', true) //Makes the link to download content form href when clicked
  document.getElementById(`${btnId}download`).click() //Perform the click by JS,bc the user already clicked the download link,the click was used to call the download api
} //Downloads the music,requires an button id wich is passed by downloadVid(videoId),

function changeThumbanil() {
  var thumbnailInput = document.getElementById('thumbnailChange'); //The thumbnail switch input
  if (thumbnailInput.checked) {
    var data = JSON.parse(localStorage.getItem('YtMp3Data')); //Gets the data that is stored on local storage
    data.dynamicThumbnail = true; //Changes the thumbnail type
    data = JSON.stringify(data); //Converts from json to string to be stored on local storage
    localStorage.removeItem('YtMp3Data'); //Removes the actual data from local storage (to update its values)
    localStorage.setItem('YtMp3Data', data) //Creates the data again with updated data
    dynamicThumbnail = true; //Makes the local variable true,so dynamicThumbails are showed on next search/refresh
  }
  else {
    var data = JSON.parse(localStorage.getItem('YtMp3Data')); //Gets data from local storage and converts it to json
    data.dynamicThumbnail = false; //Makes dynamic thumbails false
    data = JSON.stringify(data); //Convert data to string (to be stored on local storage)
    localStorage.removeItem('YtMp3Data'); //Removes app data in local storage (to update its values)
    localStorage.setItem('YtMp3Data', data) //Saves the data on local storage (update)
    dynamicThumbnail = false; //Makes the local variable true,so dynamicThumbails are showed on next search/refresh
  } //When user turns off dynamic thumbnails
} //To change thumbnail type


function changeTheme() {
  var themeInput = document.getElementById('themeChangeInput'); //Save the input switch
  if (themeInput.checked) { setTheme('dark'); applyTheme('dark') } //If switch is turned on,call the function to set theme dark
  else { setTheme('light'); applyTheme('light') }  //If switch is turned off,call the function to set theme light
} //When user turns the theme switch off/on

function setTheme(theme) {
  if (localStorage.getItem('YtMp3Data') != null) {
    var data = JSON.parse(localStorage.getItem('YtMp3Data')); //Saves the local storage data
    data.theme = theme; //Sets the theme based on the parameters given
    data = JSON.stringify(data); //Converts data do string (to save on local storage)
    localStorage.removeItem('YtMp3Data'); //Removes app data from local storage (to update its values)
    localStorage.setItem('YtMp3Data', data) //Saves data to local storage with updated values
  } //Check if there is app data on local storage+
  else {
    var data = {
      theme: theme,
      dynamicThumbnail: false,
    } //Create app data
    data = JSON.stringify(data); //Converts data to string,to save them on local storage
    localStorage.setItem('YtMp3Data', data) //Save data on local storage
  }
} //To set/update app data on local storage




function applyTheme(theme) {
  var r = document.querySelector(':root'); //Select :root css
  if (theme === 'dark') {
    //Chane css varible colors based on theme
    r.style.setProperty('--red', '#3f4192');
    r.style.setProperty('--white', '#1a1919');
    r.style.setProperty('--textBlack', 'white');
    r.style.setProperty('--resultWhite', '#2a2a2a');
    document.getElementById('svgPath').style.fill = '#3f4192';
    document.querySelector('.owner').style.color = 'white';
  }
  if (theme === 'light') {
    //Chane css varible colors based on theme
    r.style.setProperty('--red', '#f44336');
    r.style.setProperty('--white', '#eee');
    r.style.setProperty('--textBlack', '#333');
    r.style.setProperty('--resultWhite', '#eee');
    document.getElementById('svgPath').style.fill = '#f44336';
    document.querySelector('.owner').style.color = '#f44336';
  }

} //To apply the theme





