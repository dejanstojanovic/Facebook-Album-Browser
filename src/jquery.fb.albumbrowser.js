$.fn.FacebookAlbumBrowser = function (options) {
    var defaults = {
        account: "",
        acessToken: "",
        showAccountInfo: true,
        showImageCount: true,
        skipEmptyAlbums: true,
        skipAlbums: []
    }
    var settings = $.extend({}, defaults, options);
    var selector = $(this);
    selector.each(function (index) {
        var container = selector.get(index);
        if (settings.showAccountInfo) {
            addAccountInfo(container);
        }
        $(container).append($('<ul>', {
            class: "fb-albums"
        }));
        var albumList = $(container).find(".fb-albums");
        var invokeUrl = "https://graph.facebook.com/" + settings.account + "/albums";
        if (settings.acessToken != "") {
            invokeUrl += "?access_token=" + settings.acessToken;
        }

        loadAlbums(invokeUrl);
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
                            continue;
                        }
                        else {
                            var invokeUrl = "https://graph.facebook.com/" + $(result.data).get(a).cover_photo;
                            if (settings.acessToken != "") {
                                invokeUrl += "?access_token=" + settings.acessToken;
                            }
                            $.ajax({
                                type: 'GET',
                                url: invokeUrl,
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
                            if (settings.showImageCount) {
                                albumListItem.append($("<div>", { class: "fb-album-count", text: $(result.data).get(a).count }));
                            }
                            $(albumList).append(albumListItem);
                            $(albumListItem).click(function () {
                                var self = $(this);
                                $(selector).append($("<div>", { class: "fb-album-preview" }));
                                var previewContainer = selector.find(".fb-album-preview");
                                previewContainer.append($("<button>", { type: "button", text: "<", class: "fb-albums-list" }));
                                previewContainer.append($("<h3>", { class: "fb-album-heading", text: $(self).find(".fb-album-title").text() }));
                                previewContainer.find("button.fb-albums-list").click(function () {
                                    previewContainer.fadeOut(function () {
                                        $(selector).find(".fb-albums").fadeIn();
                                        previewContainer.remove();
                                    });
                                });
                                $(previewContainer).append($("<ul>", { class: "fb-photos" }));
                                photosContainer = $(previewContainer).find("ul.fb-photos");

                                var invokeUrl = "https://graph.facebook.com/" + $(self).attr("data-id") + "/photos";
                                if (settings.acessToken != "") {
                                    invokeUrl += "?access_token=" + settings.acessToken;
                                }
                                loadPhotos(invokeUrl, photosContainer);
                                $(selector).find("ul.fb-albums").fadeOut(function () {
                                    previewContainer.fadeIn();
                                });
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
                    for (a = 0; a < result.data.length; a++) {
                        var photoListItem = $("<li>", { class: "fb-photo" });
                        var prefWidth = photoListItem.width();
                        var prefHeight = photoListItem.height();
                        var albumImg = $(result.data)[a].images[0];
                        for (i = 0; i < $(result.data)[a].images.length; i++) {
                            if (
                                    ($(result.data)[a].images[i].height >= prefHeight && $(result.data)[a].images[i].width >= prefWidth) &&
                                    ($(result.data)[a].images[i].height <= albumImg.height && $(result.data)[a].images[i].width <= albumImg.width)
                                ) {
                                albumImg = $(result.data)[a].images[i];
                            }
                        }
                        var photoLink = $("<a>", { class: "fb-photo-thumb-link", href: $(result.data)[a].source });
                        photoLink.append($("<img>", { style: "margin-left:" + (prefWidth - albumImg.width) / 2 + "px;", "data-id": $(result.data).get(0).id, class: "fb-photo-thumb", src: albumImg.source }));
                        photoListItem.append(photoLink);
                        container.append(photoListItem);
                    }
                    if (result.paging && result.paging.next && result.paging.next != "") {
                        loadPhotos(result.paging.next, container);
                    }
                    else {
                        initLightboxes();
                    }
                }
            });
        }

        function addAccountInfo(container) {
            var accountInfoContainer = $("<div>", { class: "fb-account-info" });
            accountInfoContainer.append($("<img>", { src: "https://graph.facebook.com/" + settings.account + "/picture?type=square" }));
            accountInfoContainer.append($("<h3>", { class: "fb-account-heading" }));
            $(container).append(accountInfoContainer);
            $.ajax({
                type: 'GET',
                url: "https://graph.facebook.com/" + settings.account,
                cache: false,
                dataType: 'jsonp',
                success: function (result) {
                    $(container).find(".fb-account-info").find(".fb-account-heading").text(result.name);
                }
            });
        }

        function initLightboxes() {
            var overlay = $(".fb-preview-overlay");
            if (overlay.length == 0) {
                overlay = $("<div>", { class: "fb-preview-overlay" });
                overlay.append($("<img>", { class: "fb-preview-img-prev", src: "src/prev-icon.png" }));
                overlay.append($("<img>", { class: "fb-preview-img" }));
                overlay.append($("<img>", { class: "fb-preview-img-next", src: "src/next-icon.png" }));
                $("body").append(overlay);
                overlay = $(".fb-preview-overlay");
                $(overlay).click(function () {
                    $(this).fadeOut();
                });
                $(overlay).find(".fb-preview-img").click(function () {
                    $(this).parent().find("img.fb-preview-img-next").click();
                    return false;
                });
            }
            else {
                overlay = $(".fb-preview-overlay");
            }
            $("a.fb-photo-thumb-link").unbind("click");
            $("a.fb-photo-thumb-link").click(function (event) {
                var overlay = $(".fb-preview-overlay");
                var previewImage = overlay.find("img.fb-preview-img");
                previewImage.hide();
                overlay.find("img.fb-preview-img-prev,img.fb-preview-img-next").hide();


                previewImage.attr("src", $(this).attr("href"));
                previewImage.load(function () {
                    $(this).attr("style", "margin-top:" + (overlay.height() - $(this).height()) / 2 + "px;");
                    overlay.find("img.fb-preview-img-prev,img.fb-preview-img-next").attr("style", "margin-top:" + (overlay.height() - $(this).height()) / 2 + "px;");

                    var prevImg = overlay.find("img.fb-preview-img-prev");
                    prevImg.show();
                    prevImg.unbind("click");
                    prevImg.click(function () {
                        var currentImage = $(this).parent().find(".fb-preview-img");
                        var currentImageLinkItem = $("[href='" + currentImage.attr("src") + "']");
                        if (currentImageLinkItem.length != 0) {
                            var prev = currentImageLinkItem.parent().prev();
                            if (prev.length != 0) {
                                previewImage.attr("src", prev.find(".fb-photo-thumb-link").attr("href"));
                            }
                            else {
                                previewImage.attr("src", currentImageLinkItem.parent().parent().find("li").last().find(".fb-photo-thumb-link").attr("href"));
                            }
                        }
                        return false;
                    });

                    var nextImg = overlay.find("img.fb-preview-img-next");
                    nextImg.show();
                    nextImg.unbind("click");
                    nextImg.click(function () {
                        var currentImage = $(this).parent().find(".fb-preview-img");
                        var currentImageLinkItem = $("[href='" + currentImage.attr("src") + "']");
                        if (currentImageLinkItem.length != 0) {
                            var next = currentImageLinkItem.parent().next();
                            if (next.length != 0) {
                                previewImage.attr("src", next.find(".fb-photo-thumb-link").attr("href"));
                            }
                            else {
                                previewImage.attr("src", currentImageLinkItem.parent().parent().find("li").first().find(".fb-photo-thumb-link").attr("href"));
                            }
                        }
                        return false;
                    });

                    $(this).fadeIn();
                });
                overlay.fadeIn();
                event.preventDefault();
                event.stopPropagation();
                return false;
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