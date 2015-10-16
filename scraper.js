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
        warning: 'Username must be only letters, spaces, or dashes'
      },
      {
        name: 'artist',
        hidden: false
      }
    ]
  
 
  prompt.start();
 
  prompt.get(properties, function (err, result) {
    titleAlbum = result.title.replace(/ /g , "_");
    // titleAlbum = result.title.split(' ').toUppercase();
    titleArtist = result.artist.replace(/ /g , "_");
    // console.log(titleAlbum);
    // console.log(titleAlbum.join('@'))
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
