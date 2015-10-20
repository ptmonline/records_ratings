var request = require('request');
var cheerio = require('cheerio');
var colors = require('colors');
var prompt = require('prompt');
// console.log(process.argv.length)
// var theme = process.argv;
// console.log(theme)
// var theme2 = theme.slice(2, process.argv.length)
// var theme3 = theme2.toString().replace(',', '_');
// console.log('title is: ' + theme3);
var albumTitle,
    albumArtist,
    finishString;
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
  
 
  prompt.start();
 
  prompt.get(properties, function (err, result) {
    console.log(result.title.split(' ').length)
    var thealbumarray = [];
    var theartistarray = []
    for (var x = 0; x < result.title.split(' ').length; x++){
      if(result.title.split(' ')[x] == 'and' || result.title.split(' ')[x] == 'of' || result.title.split(' ')[x] == 'to'){
        thealbumarray.push(result.title.split(' ')[x].toLowerCase());
      }else{
        thealbumarray.push(result.title.split(' ')[x][0].toUpperCase() + result.title.split(' ')[x].slice(1).toLowerCase());
      }
    }
    for (var y = 0; y < result.artist.split(' ').length; y++){
      theartistarray.push(result.artist.split(' ')[y][0].toUpperCase() + result.artist.split(' ')[y].slice(1).toLowerCase());
    }
    

    console.log(thealbumarray);
    console.log(theartistarray);
    titleAlbum = thealbumarray.toString().replace(/,/g , "_");
    titleArtist = theartistarray.toString().replace(/,/g, "_");
    console.log(titleAlbum);
    console.log(titleArtist)
    searchItems(titleAlbum,titleArtist)
  });

function searchItems(titleAlbum,titleArtist){
  // console.log(titleAlbum + ' ' + titleArtist)
  
  if(titleArtist == undefined || titleArtist == 'undefined' || titleArtist ==null ){
    finishString = titleAlbum + '_(album)';
  // console.log('this is undefined, artist:  ' +titleArtist )
  

  }else{
    finishString = titleAlbum + '_(' + titleArtist +'_album)';
   // console.log('this is NOT undefined')
   
  }

  // console.log('finishString: ' + finishString)
  request({
    uri: "https://en.wikipedia.org/wiki/" + finishString,
  }, function(error, response, body) {
    // console.log(response)
    
    var $ = cheerio.load(body);
    var firstHeader = $('.firstHeading').text();

    var title = $('.wikitable.infobox').find('td > a');
    var ititle = $('.wikitable.infobox').find('td > i > a');
    
    if($('#noarticletext').length == 1){
      searchItems(titleAlbum)
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
    }
  });

}
