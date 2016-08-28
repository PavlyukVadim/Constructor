$(document).ready(function ($) {
  $(".main_head, section,.header-content").css("min-height", $(window).height());
  $(".parallax-window").parallax();
  $(".loader_inner").delay(400).fadeOut();
  $(".loader").delay(600).fadeOut("slow");
  $(".review-photo-1").css("height", $(".review").height());
  
  
  $(".section-title").animated("fadeInDown", "fadeOutDown");
  $(".section-explanation").animated("fadeInUp", "fadeOutDown");
  $(".right-side-review").animated("fadeInRight", "fadeOutDown");
  $(".left-side-review").animated("fadeInLeft", "fadeOutDown");
  $(".img_1, .img_2, .img_3, .thumbnail img, .bar").animated("flipInY", "fadeOutDown");
  
  $("a[rel='m_PageScroll2id']").mPageScroll2id();
  $(".photos").css({
    bottom : ($(".photos").height() - $(".img_1").height()) / 1.7
  });
  
});
$(window).resize(function () {
  $(".review-photo-1").css("height", $(".review").height());
  $(".photos").css({
    bottom : ($(".photos").height() - $(".img_1").height()) / 1.7
  });
});
