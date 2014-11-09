$.fn.FacebookAlbumBrowser = function (options) {
    var defaults = {
        account: "",
        skipEmptyAlbums: true,
        skipAlbums: []
    }
    var settings = $.extend({}, defaults, options);
    var selector = $(this);
    selector.each(function (index) {
        var container = selector.get(index);
        $(container).append($('<ul>', {
            class: "fb-albums"
        }));
        var albumList = $(container).find(".fb-albums");
        loadAlbums("http://graph.facebook.com/" + settings.account + "/albums");
        function loadAlbums(url) {
            $.ajax({
                type: 'GET',
                url: url,
                cache: false,
                dataType: 'jsonp',
                success: function (result) {
                    for (a = 0; a < $(result.data).length; a++) {

                        if (settings.skipAlbums.indexOf($(result.data).get(a).name) > -1 || settings.skipAlbums.indexOf($(result.data).get(a).id.toString()) > -1) {
                            continue;
                        }
                        var albumListItem = $("<li>", { class: "fb-album", "data-id": $(result.data).get(a).id });

                        if ($(result.data).get(a).count == null && settings.skipEmptyAlbums) {
                            //console.log("REMOVE: " + $(result.data).get(a).id + " - " + $(result.data).get(a).name);
                            continue;
                        }
                        else {
                            $.ajax({
                                type: 'GET',
                                url: "https://graph.facebook.com/" + $(result.data).get(a).cover_photo,
                                cache: false,
                                data: { album: $(result.data).get(a).id },
                                dataType: 'jsonp',
                                success: function (cover) {
                                    var listItem = $("li.fb-album[data-id='" + getParameterByName("album", $(this).get(0).url) + "'] ");
                                    if (!$(cover).get(0).error && $(cover).get(0).images) {
                                        var prefWidth = listItem.width();
                                        var prefHeight = listItem.height();
                                        var albumImg = $(cover.images)[0]
                                        for (i = 0; i < $(cover.images).length; i++) {
                                            if (
                                                    ($(cover.images)[i].height >= prefHeight && $(cover.images)[i].width >= prefWidth) &&
                                                    ($(cover.images)[i].height <= albumImg.height && $(cover.images)[i].width <= albumImg.width)
                                                ) {
                                                albumImg = $(cover.images)[i];
                                            }
                                        }

                                        //$("<img>", { "data-id": $(cover).get(0).id, class: "fb-album-thumb", src: albumImg.source }).insertBefore(listItem.find(".fb-album-title"));
                                        listItem.append($("<img>", { style: "margin-left:" + (prefWidth - albumImg.width) / 2 + "px;", "data-id": $(cover).get(0).id, class: "fb-album-thumb", src: albumImg.source }));
                                        listItem.find("img").load(function () {
                                            $(this).fadeIn(300);
                                        });
                                    }
                                    else {
                                        listItem.remove();
                                    }
                                }
                            });

                            albumListItem.append($("<div>", { class: "fb-album-title", text: $(result.data).get(a).name }));
                            albumListItem.append($("<div>", { class: "fb-album-count", text: $(result.data).get(a).count }));

                            $(albumList).append(albumListItem);

                            //attach handlers
                            $(albumListItem).click(function () {
                                var self = $(this);
                                $(self).parent().slideUp(function () {
                                    $(self).parent().slideDown();
                                });
                                //alert("click");
                                //return;
                                var self = $(this);
                                var photosContainer = $(self).find("ul.fb-photos");
                                if (photosContainer.length > 0) {
                                    //photosContainer.slideToggle(300);
                                }
                                else {
                                    $(self).append($("<ul>", { class: "fb-photos" }));
                                    photosContainer = $(self).find("ul.fb-photos");
                                    loadPhotos("https://graph.facebook.com/" + $(result.data).get(a).id + "/photos", photosContainer);
                                }
                            });
                            $(albumListItem).hover(function () {
                                var self = $(this);
                                self.find("div.fb-album-title").slideToggle(300);
                            });
                        }




                    }
                    if (result.paging && result.paging.next && result.paging.next != "") {
                        loadAlbums(result.paging.next);
                    }
                }
            });
        }

        function loadPhotos(url, container) {
            $.ajax({
                type: 'GET',
                url: url,
                cache: false,
                dataType: 'jsonp',
                success: function (result) {

                    //alert($(result.data).length);

                    for (a = 0; a < $(result).length; a++) {
                        var photoListItem = $("<li>", { class: "fb-photo" });//.append($("<img>", { src: $(result.data).get(a).picture }));


                        //var listItem = $("li.fb-photo");
                        //if (!$(result).get(0).error && $(result).get(0).images) {
                        var prefWidth = photoListItem.width();
                        var prefHeight = photoListItem.height();
                        var albumImg = $(result.images)[0]
                        for (i = 0; i < $(cover.images).length; i++) {
                            if (
                                    ($(result.images)[i].height >= prefHeight && $(cover.images)[i].width >= prefWidth) &&
                                    ($(result.images)[i].height <= albumImg.height && $(cover.images)[i].width <= albumImg.width)
                                ) {
                                albumImg = $(cover.images)[i];
                            }
                        }

                        //$("<img>", { "data-id": $(cover).get(0).id, class: "fb-album-thumb", src: albumImg.source }).insertBefore(listItem.find(".fb-album-title"));
                        photoListItem.append($("<img>", { style: "margin-left:" + (prefWidth - albumImg.width) / 2 + "px;", "data-id": $(cover).get(0).id, class: "fb-photo-thumb", src: albumImg.source }));
                        //photoListItem.find("img").load(function () {
                        //    $(this).fadeIn(300);
                        //});
                        //}
                        //else {
                        //    listItem.remove();
                        //}



                        container.append(photoListItem);



                        //console.log(a + " - " + $(result.data).get(a).picture);
                    }
                    if (result.paging && result.paging.next && result.paging.next != "") {
                        loadPhotos(result.paging.next, container);
                    }
                }
            });
        }

        function getParameterByName(name, url) {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(url);
            return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

    });
}


