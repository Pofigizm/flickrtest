/* jshint devel:true */
'use strict';

var utils = {
  getFF: function( params, cb ){

    window.jsonFlickrFeed = function( data ){
      window.jsonFlickrFeed = undefined;
      try {
        delete window.jsonFlickrFeed;
      } catch(e) {}

      if (head) {
        head.removeChild(script);
      }
      cb(data);
    };
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.charset = 'UTF-8';
    script.src = utils.addtags( params.url, params.tags );
    head.appendChild(script);
    return true;
  },
  addtags: function( url, tags ){

    if ( tags === '' ) return url;
    // add tag validation here
    return url + '&tags=' + tags ;
  },
  getCompater: function( prop ){

    return function( a, b ){
      if (a[prop] < b[prop]) return -1;
      if (a[prop] > b[prop]) return 1;
      return 0;
    };
  }
};

var myapp = {
  feed: [],
  params: {
    url: 'https://api.flickr.com/services/feeds/photos_public.gne?format=json&lang=en-us',
    filter: 'count',
    tags: ''
  },
  saveFeed: function( data ){

    var count = 0;
    myapp.feed = data.items.map(function( item ){
      item.count = count++;
      return item;
    });
    myapp.drawFeed();
  },
  getItem: function( item ){

    var el = document.createElement('a');
    el.className = 'item';
    el.target = '_blank';
    el.href = item.link; 
    el.innerHTML = ' \
      <div class="img"><img src="' + item.media.m + '"></div> \
      <div class="desc"> \
        <h4>' + item.title + '</h4> \
        <p class="date">' + item.date_taken + '</p> \
        <p class="tags">' +  item.tags + '</p> \
      </div> ';
    return el;
  },
  drawFeed: function() {
    
    var feed = document.createElement('div');
    feed.className = 'feed';

    myapp.feed
      .sort( utils.getCompater( myapp.params.filter ) )
      .map( myapp.getItem )
      .forEach( function( item ){
        feed.appendChild( item );
      });
    feedrplace.replaceChild( feed, feedrplace.childNodes[0] );
  },
  updatefilter: function() {

    myapp.params.filter = feedfilter.value;
    myapp.drawFeed();    
  },
  updatetags: function() {

    myapp.params.tags = feedtags.value;
    myapp.init();    
  },
  init: function() {

    utils.getFF( myapp.params, myapp.saveFeed );
  } 
};

myapp.init();
