Facebook-Album-Browser
======================

Reponsive jQuery plugin for browsing public albums of a Facebook account.
Plugin is suitable for both desktop and mobile websites.

![ScreenShot](http://dejanstojanovic.net/media/31682/fb-albums.gif)

###What can I do with it
The main purpose of this plugin is to enable to embed and customize phot albums in your website without being limited with Facebook styling. It also allows you to use it as picker as it raises events for clicked album/photo.

###How to add to a page
Add a reference to jQuery library, this plugin library and this plugin CSS stylesheet
```html
<link rel="stylesheet" type="text/css" href="../src/jquery.fb.albumbrowser.css" />
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script type="text/javascript" src="../src/jquery.fb.albumbrowser.js"></script>
```
Simply add a container (div or any other element) and apply the plugin to it.
```html
<div class="fb-album-container"></div>

<script type="text/javascript">
    $(document).ready(function () {
        $(".fb-album-container").FacebookAlbumBrowser({
            account: "natgeo"
        });
    });
</script>
```

###What are options for plugin
The following are options for the plugin which are used to congigure the plugin instance:


| Name  		 			| Default value 	| Description				 	|
| ------------------------- | ----------------- | ------------------------------|
| **account**		 		|					| Facebook account for which albums and photos will be fetched and displayed. This parameter is mandatory and must be provided in order for plugin to work |
| **accessToken**	 		|					| Access token for accessing non public content for the Facebook account |
| **showAccountInfo**		| true				| Show Facebook account name and icon above the browser |
| **showImageCount**		| true				| Show number of protos in each album. Default value is |
| **showImageText**			| true				| Show or hide text associated to photo in image preview (lightbox) |
| **skipEmptyAlbums**		| true				| Skip albums for which plugin was unable to fetch at least one photo |
| **skipAlbums**			| []				| List of IDs or names or combined IDs and names of albums which will not be browsed (e.g ["Profile Pictures", "Timeline Photos"]) |
| **thumbnailSize**			| 130				| Size of the thumnails for the album and photos (in pixels) |
| **lightbox**				| true				| Show full size image in a lightbox style when clicked |
| **photosCheckbox**		| true				| Allows using of plugin as an image multipicker |
| **likeButton**			| true				| Adds Facebook like button for image on image lightbox preview |
| **shareButton**			| true				| Adds Facebook share button is like button is enabled. Adds AddThis buttons if addThis is set with AddThis pub-id |
| **albumsPageSize**		| 0					| Page size of album browsing. If set to 0, paging is off |
| **albumsMoreButtonText**	| "more albums..."	| Text value for more button when album paging is on |
| **photosPageSize**		| 0					| Page size of album photo browsing. If set to 0, paging is off |
| **photosMoreButtonText**	| "more photos..."	| Text value for more button when photos paging is on |
| **onlyAlbum**				| null				| Skips album browsing and starts browsing album with specific id |
| **showComments**			| false				| Shows comments of the photo when previewing photo |
| **commentsLimit**			| 5					| Number of comments per page |
| **addThis**				| null				| Enables sharing via AddThis buttons if AddThis pub-id is provided and _shareButton_ is enabled |

###Events
The following are events raised by plugin:

| Name  		 			| Description				 	|
| ------------------------- | ----------------------------- |
| **albumSelected**		 	| Handler function for event raised when album is selecetd in the browser |
| **photoSelected**		 	| Handler function for event raised when photo is selecetd in the browser |
| **photoChecked**		 	| Handler function for event raised when photo is checked |
| **photoUnchecked**		| Handler function for event raised when photo is unchecked |


Every event functin returns an object which holds three properties:
* **id** - image id in Facebook database
* **url** - large image url
* **thumb** - thumbnail image url

###Demo
Test document test.html is contained in the soolution. You can download it for testing or use the following code:

```html
<div class="fb-album-container"></div>

<script type="text/javascript">
 $(document).ready(function() {
      $(".fb-album-container").FacebookAlbumBrowser({
        account: "natgeo",
        skipAlbums: ["Profile Pictures", "Timeline Photos"],
        showAccountInfo: true,
        showImageCount: true,
        lightbox: true,
        photosCheckbox: true,
        photoChecked: function(photo) {
          //Handles photo checkbox checked
        },
        photoUnchecked: function(photo) {
          //Handles photo checkbox unchecked
        },
        albumSelected: function(photo) {
          //Handles album thumbnail clicked event
        },
        photoSelected: function(photo) {
          //Handles photo thumbnail click event
        }
      });
    });
</script>
```
To see the plugin live in action [checkout demo on CodePen](http://codepen.io/dejanstojanovic/full/QjwLZp)
* [Loading all albums from the Facebook page](http://codepen.io/dejanstojanovic/full/QjwLZp)
* [Change thumbnail size](http://codepen.io/dejanstojanovic/full/epmgBL)
* [Skip specific albums from browsing](http://codepen.io/dejanstojanovic/full/VvYPmY)
* [Load single album photos](http://codepen.io/dejanstojanovic/full/epmgdL)
* [Photo picker sample](http://codepen.io/dejanstojanovic/full/NGPdRv)
* [Load only specific photo albums](http://codepen.io/dejanstojanovic/full/qOERNz)
* [Multiple plugin instances on page](http://codepen.io/dejanstojanovic/full/LpExNK)

![ScreenShot](http://dejanstojanovic.net/media/31684/preview-with-share.png)

###AddThis support
Starting from version 1.3.1 plugin supports sharing via AddThis sharing. It allows you to share facebook URL to an image direcly from the image lightbox preview in a plugin.
All that needs to be done is to enable sharing button and provide AddThis pub-id to plugin in initialization settings and you are set to share Facebook photo URL direcly on your website.

```html
<div class="fb-album-container"></div>

<script type="text/javascript">
 $(document).ready(function() {
      $(".fb-album-container").FacebookAlbumBrowser({
        account: "natgeo",
        showAccountInfo: true,
        lightbox: true,
	    shareButton: true,
        addThis:"ra-xxxxxxxxxxxxxxxx"
      });
    });
</script>
```

###Using it as a photo-picker
This plugin has buit in support for multiple picker, wich allows you to browse through albums and photos and pick them. The plugin will store all picked photos in an object array and make them available.

You can either access picked images on your custom page event or you can hook to plugin's photoChecked and photoUnchecked event.
```html
  <div class="fb-album-container">
  </div>
  <script type="text/javascript">
        $(document).ready(function () {
          $(".fb-album-container").FacebookAlbumBrowser({
                account: "natgeo",
                accessToken: "775908159169504|cYEIsh0rs25OQQC8Ex2hXyCOut4",
                skipAlbums: ["Profile Pictures", "Timeline Photos"],
                showAccountInfo: true,
                showImageCount: true,
                showImageText: true,
                lightbox: true,
                photosCheckbox: true,
                photoChecked: function(photo){
                    console.log("PHOTO CHECKED: " + photo.id + " - " + photo.url + " - " + photo.thumb);
                    console.log("CHECKED PHOTOS COUNT: " + this.checkedPhotos.length);
                },
                photoUnchecked: function (photo) {
                    console.log("PHOTO UNCHECKED: " + photo.id + " - " + photo.url + " - " + photo.thumb);
                    console.log("CHECKED PHOTOS COUNT: " + this.checkedPhotos.length);
                },
                albumSelected: function (photo) {
                    console.log("ALBUM CLICK: " + photo.id + " - " + photo.url + " - " + photo.thumb);
                },
                photoSelected: function (photo) {
                    console.log("PHOTO CLICK: " + photo.id + " - " + photo.url + " - " + photo.thumb);
                }
            });
        });
  </script>
```


![ScreenShot](http://dejanstojanovic.net/media/31681/fb-album.png)

###Acquiring the right access token
Follow the steps to get the access token to use the plugin

1. Login to developers.facebook.com with your Facebook developer account
2. Create an App with WWW platform selected
3. Add url of the website where you are about to use this plugin and save the changes
4. In a new browser tab visit https://graph.facebook.com/oauth/access_token?client_id={app-id}&client_secret={app-secret}&grant_type=client_credentials
(values for app-id and app-secret parameters take from the app settings page)
5. After loading the url above you will get the access token in a response. Sopy the access_token value to plugin settings javascript code you use to initialize the plugin.
5. Enjoy using the plugin :)

###Notes
In order to make this plugin work with Facebook account photos you need to allow **user_photos** permission in your Facebook App that is used to authenticate and add permissions.
Please read the article on Facebook https://developers.facebook.com/docs/apps/review.

For testing purposes you can use Facebook App test users. More about using test users you can find at https://developers.facebook.com/docs/apps/test-users/.

###A word of author
So far I developed and mainatined this plugin by myself, so sometime I might not have time to respond to your requests and reported bugs. Feel free to participate. Every line of code, every comment or idea would mean a lot to maintain this free plugin project alive and up to date.

It would mean a lot to me to know where it is used, to see how it works and maybe give me an idea what can be improved in order to better fit in to various websites.

I created an [issue](https://github.com/dejanstojanovic/Facebook-Album-Browser/issues/13) where you can add all your website URL/URLs where you are using this webiste.

Thank you all in advance.


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/dejanstojanovic/facebook-album-browser/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

