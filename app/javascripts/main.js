// Consts.
var LOADER_FADE_TIME = 200;

// Data members.
var _articleTextSwiper;

// Occures when ready.
$(document).ready(function () {
    console.log('ready');

    // Sliders.
    RegisterSliders();


    // mobile nav
    $('.close-btn').click(function () {
        $('.menu-content').removeClass('active');
    });

    $('.menu-button').click(function () {
        //console.log("open menu");
        $('.menu-content').addClass('active');
    });

});



// Registers the sliders.
function RegisterSliders() {
    if ($(window).width() > 1024) {
        var swiper = new Swiper('.questions-menu .swiper-container', {
            pagination: '.swiper-pagination',
            slidesPerView: 2,
            slidesPerColumn: 3,
            //slidesPerGroup: 3,
            //slidesPerColumnFill: 'row',
            paginationClickable: true,
            spaceBetween: 15,
            nextButton: '.swiper-button-prev',
            prevButton: '.swiper-button-next',
            onSlideChangeStart: function(swiper) {
                dataLayer.push({ 'Category': 'מה תרצו לדעת', 'Action': 'דפדוף', 'Label': '', 'event': 'auto_event' });
            }
        });
    }

}
