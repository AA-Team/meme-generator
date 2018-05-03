$(document).ready(function(){

	// Initiate Carousel
	$('#mg-carousel').owlCarousel({
		items: 6,
		pagination: false,
		navigation: true,
		navigationText: ['&#xf104','&#xf105']
	});

	// Toggle Text Options
	$( '#mg-options' ).click(function() {
		$( '.mg-text-options' ).slideToggle('fast');
	});

	// Reset page
	$('.mg-b-invert').click(function(){
		location.reload();
	});
	
});