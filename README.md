Facebook-Album-Browser
======================

Reponsive jQuery plugin for browsing public albums of a Facebook account.
Plugin is suitable for both desktop and mobile websites.

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
* **account** - Facebook account for which albums and photos will be fetched and displayed. This parameter is mandatory and must be provided in order for plugin to work.
* **accessToken** - Access token for accessing non public content for the facebook account.
* **showAccountInfo** - Show Facebook account name and icon abowe the browser. Default value is _true_
* **showImageCount** - Show number of protos in each album. Default value is _true_
* **showImageText** - Show or hide text associated to photo in image preview (lightbox). Default value is _false_
* **skipEmptyAlbums** - Skip albums for which plugin was unable to fetch at least one photo. Default value is _true_
* **skipAlbums** - List of IDs or names or combined IDs and names of albums which will not be browsed (e.g ["Profile Pictures", "Timeline Photos"]). Default value is _[]_
* **lightbox** - Show full size image in a lightbox style when clicked. Default value is _true_
* **photosCheckbox** - Allows using of plugin as an image multipicker. Default value is _true_
* **likeButton** - Add facebook like button for image on image lightbox preview. Default value if _true_
* **albumsPageSize** - Page size of album browsing. If set to 0, paging is off. Default value if _0_
* **albumsMoreButtonText** - Text value for more button when album paging is on. Default value if _"more albums..."_
* **photosPageSize** - Page size of album photo browsing. If set to 0, paging is off. Default value if _0_
* **photosMoreButtonText** - Text value for more button when photos paging is on. Default value if _"more photos..."_

###Events
The following are events raised by plugin:
* **albumSelected** - Handler function for event raised when album is selecetd in the browser. Default value is _null_
* **photoSelected** - Handler function for event raised when photo is selecetd in the browser. Default value is _null_
* **photoChecked** - Handler function for event raised when photo is checked. Default value is _null_
* **photoUnchecked** - Handler function for event raised when photo is unchecked. Default value is _null_

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
To see the plugin live in action [checkout demo on plunker](http://plnkr.co/edit/bpcaagDgxVClt1lsDH5a?p=preview)

![ScreenShot](http://dejanstojanovic.net/media/31597/facebook-album-browser.png)


![ScreenShot](http://dejanstojanovic.net/media/31657/faceboo-phptp-preview.png)

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


![ScreenShot](http://dejanstojanovic.net/media/31674/fb-photo-picker.png)

###Facebook access tokens (by [@rockyr1](https://github.com/rockyr1))
Facebook always keeps changing the way data can be accessed through their APIs, recent one has been to have an AccessToken to access any Facebook data. Every time Facebook does this, there are plenty of plugins, widgets and certain features within a website which break. That's why its always important to understand the external dependencies and also to have a dedicated Web Admin to manage changes like this on your website.

Here are the steps to create or get an Facebook access token

1. Go to http://www.facebook.com/developers, login to your facebook account, and add the developer app, if requested. It might prompt you to validate your identity by confirming your Phone number or something.
2. Click the ‘add a new app’ button to create a new app.
3. Give the app a name, keeping in mind facebook’s naming policies.
4. After creating the app, You will be redirected to App’s Dashboard.  Note down the AppID and App_Secret (by clicking on show)
5. Go to https://graph.facebook.com/oauth/access_token?grant_type=client_credentials&client_id=APP_ID&client_secret=APP_SECRET replacing APP_ID with your newly created app ID and APP_SECRET with your new app Secret. If the credentials are correct, you will see your authentication token at that location.

It’s as simple as that!

This token can now be used in order to retrieve data from a Facebook feed.  For example:https://www.facebook.com/PAGE_OR_USER_ACCOUNT/feed?access_token=ACCESS_TOKEN, replace PAGE_OR_USER_ACCOUNT with the page id or user account name and ACCESS_TOKEN with the token you retrieved in step 5.

Please note currently there is a 60-day limit on these Access tokens after which they expire. There are ways to dynamically get AccessTokens without having to do this manually.

Read whole article at http://doityaar.com/2015/06/how-to-get-facebook-access-token/

###Notes
In order to make this plugin work with Facebook account photos you need to allow **user_photos** permission in your Facebook App that is used to authenticate and add permissions.
Please read the article on Facebook https://developers.facebook.com/docs/apps/review.

For testing purposes you can use Facebook App test users. More about using test users you can find at https://developers.facebook.com/docs/apps/test-users/.
