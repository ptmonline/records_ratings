var request = require('request');
var cheerio = require('cheerio');

request({
  uri: "https://en.wikipedia.org/wiki/Angel_Dust_(Faith_No_More_album)",
}, function(error, response, body) {
  var $ = cheerio.load(body);
  var importt = $('.wikitable.sortable.jquery-tablesorter').html();
  var item = $('.wikitable.infobox').find('th').html();
  var firstHeader = $('.firstHeading').text();
  var title = $('.wikitable.infobox').find('td > a');
  console.log(firstHeader)
  console.log('_______________________________')
  $(title).each(function(){
  	console.log($(this).attr('title') + ' -------> ' + $(this).parent().next().find('span').attr('title'))

  })
});