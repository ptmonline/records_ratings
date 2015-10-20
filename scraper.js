var request = require('request');
var cheerio = require('cheerio');
var colors = require('colors');
var prompt = require('prompt');
var albumTitle,
    albumArtist,
    finishString,
    count = 0
    thealbumarray = [],
    theartistarray = [];

var  properties=[
    {
      name: 'title', 
      validator: /^[a-zA-Z\s\-]+$/,
      warning: 'Title must be only letters, spaces, or dashes'
    },
    {
      name: 'artist',
      hidden: false
    }
  ]
  
 console.reset = function () {
    return process.stdout.write('\033c');
  }
  console.reset();
  prompt.start();

  prompt.get(properties, function (err, result) {
    for (var x = 0; x < result.title.split(' ').length; x++){
      if(result.title.split(' ')[x] == 'and' || result.title.split(' ')[x] == 'of' || result.title.split(' ')[x] == 'to' || result.title.split(' ')[x] == 'in'){
        thealbumarray.push(result.title.split(' ')[x].toLowerCase());
      }else{
        thealbumarray.push(result.title.split(' ')[x][0].toUpperCase() + result.title.split(' ')[x].slice(1).toLowerCase());
      }
    }
    for (var y = 0; y < result.artist.split(' ').length; y++){
      theartistarray.push(result.artist.split(' ')[y][0].toUpperCase() + result.artist.split(' ')[y].slice(1).toLowerCase());
    }
    
    titleAlbum = thealbumarray.toString().replace(/,/g , "_");
    titleArtist = theartistarray.toString().replace(/,/g, "_");
    checkString(titleAlbum, titleArtist)
   });

  function checkString(titleAlbum, titleArtist){
    count;
    // if(titleArtist == undefined || titleArtist == 'undefined' || titleArtist ==null ){
    if(count == 1){
      finishString = titleAlbum + '_(album)';
    }else if(count == 2){
      finishString = titleAlbum
    }else if(count == 3){
      console.log(colors.red('sorry! no match found'));
      return false;
    }else{
      finishString = titleAlbum + '_(' + titleArtist +'_album)';
    }
    searchItems(finishString)
  }
 

function searchItems(finishString){
  console.log("searching... https://en.wikipedia.org/wiki/" + finishString)
  request({
    uri: "https://en.wikipedia.org/wiki/" + finishString,
  }, function(error, response, body) {
    var $ = cheerio.load(body);
    var firstHeader = $('.firstHeading').text();

    var title = $('.wikitable.infobox').find('td > a');
    var ititle = $('.wikitable.infobox').find('td > i > a');
    
    if($('#noarticletext').length == 1){
      count += 1;
      checkString(titleAlbum)
    }else{
      console.log(colors.red.underline(firstHeader))
      $(title).each(function(){
        var punctuation = $(this).parent().next().find('span').attr('title')
        var wordPunctuation = $(this).parent().next().text();
        if(punctuation){
         console.log(colors.green($(this).attr('title')) + ' -------> ' + punctuation)
        }else{
          console.log(colors.green($(this).attr('title')) + ' -------> ' + wordPunctuation)
        }

      })
      $(ititle).each(function(){
        var punctuation = $(this).parent().parent().next().find('span').attr('title')
        var wordPunctuation = $(this).parent().parent().next().text();
        if(punctuation){
         console.log(colors.green($(this).attr('title')) + ' -------> ' + punctuation)
        }else{
          console.log(colors.green($(this).attr('title')) + ' -------> ' + wordPunctuation)
        }

      })
    }
  });

}
