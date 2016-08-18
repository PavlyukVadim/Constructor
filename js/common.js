$(document).ready(function ($) {
  $(".main_head, section,.header-content").css("min-height", $(window).height());
  $(".parallax-window").parallax();
  $(".loader_inner").delay(400).fadeOut();
  $(".loader").delay(600).fadeOut("slow");
});