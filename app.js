var request = require('sync-request');
var fs = require('fs');

// http://support.averta.net/envato/knowledgebase/find-facebook-album-id/
var fbAlbumId = '';
// Get access_token from https://developers.facebook.com/tools/explorer
var fbAccessToken = '';

var fbGraphUrl = 'https://graph.facebook.com/v2.3/'
  + fbAlbumId + '/photos?access_token='
  + fbAccessToken + '&format=json&limit=500';

var count = 1;
var hasNext = true;

while(hasNext) {

  var fbGraphRes = request(
    'GET',
    fbGraphUrl
  );
  var jsonString = fbGraphRes.getBody('utf-8');
  var json = JSON.parse(jsonString);

  for(var i=0; i<json.data.length; i++) {
    // Get image
    var item = json.data[i];
    var imageUrl = item.images[0].source.replace("https", "http");
    console.log('count = ' + count + ' = ' + imageUrl);

    // Download image
    var fbImageRes = request(
      'GET',
      imageUrl
    );
    fs.writeFileSync(count + '.jpg', fbImageRes.getBody());
    count++;

  }
  if(!json.paging.next) {
    hasNext = false
  } else {
    url = json.paging.next;
  }
}
