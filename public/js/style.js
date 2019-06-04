
$('.contact-form').find('.form-control').focus(function() {
    $(this).parent('.input-block').addClass('focus');
    $(this).parent().find('label').animate({
        'top': '10px',
        'fontSize': '14px'
    }, 300);
});
// $('.contact-form').find('.form-control').blur(function() {
//     if ($(this).val().length == 0) {
//         $(this).parent('.input-block').removeClass('focus');
//         $(this).parent().find('label').animate({
//             'top': '25px',
//             'fontSize': '18px'
//         }, 300);
//     }
// });

