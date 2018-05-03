MemeGenerator = (function ($) {
    "use strict";


    var i18n = {
		settings: {
			'text-color': 'Text Color',
			'shadow-color': 'Outline Color',
		}
	};


    var maincontainer   = null,
    	mainimage 	   	= null,
    	mainimage_width	= 0,
		canvas			= null,
		context			= null,
		pick_colors		= {},
		captions		= [],
		img 			= new Image();
    
    // init function, autoload
    (function init() {

        // load the triggers
        $(document).ready(function(){
            maincontainer = $(".mg-container");
            mainimage = maincontainer.find("#meme-generator-main-image");

            triggers();
        });

        fill_up_colors();
    })();
	
	function fill_up_colors()
	{
		pick_colors['#ffffff'] = 'WHITE';
		pick_colors['#1abc9c'] = 'TURQUOISE';
		pick_colors['#2ecc71'] = 'EMERALD';
		pick_colors['#3498db'] = 'PETER RIVER';
		pick_colors['#9b59b6'] = 'AMETHYST';
		pick_colors['#34495e'] = 'WET ASPHALT';
		pick_colors['#16a085'] = 'GREEN SEA';
		pick_colors['#27ae60'] = 'NEPHRITIS';
		pick_colors['#2980b9'] = 'BELIZE HOLE';
		pick_colors['#8e44ad'] = 'WISTERIA';
		pick_colors['#DB0A5B'] = 'RAZZMATAZZ';
		pick_colors['#2c3e50'] = 'MIDNIGHT BLUE';
		pick_colors['#f1c40f'] = 'SUN FLOWER';
		pick_colors['#e67e22'] = 'CARROT';
		pick_colors['#e74c3c'] = 'ALIZARIN';
		pick_colors['#ecf0f1'] = 'CLOUDS';
		pick_colors['#95a5a6'] = 'CONCRETE';
		pick_colors['#f39c12'] = 'ORANGE';
		pick_colors['#d35400'] = 'PUMPKIN';
		pick_colors['#c0392b'] = 'POMEGRANATE';
		pick_colors['#bdc3c7'] = 'SILVER';
		pick_colors['#7f8c8d'] = 'ASBESTOS';
	}

	function build_color_picker( elm, first )
	{
		var colors = $('<ul class="meme-generator-color-picker-list" />');
		$.each(pick_colors, function( key, value ){
			colors.append("<li style='background-color: " + ( key ) + "' title='" + ( value ) + "'></li>")
		});
		
		var picker = $( "<div class='meme-generator-color-picker' />" );
		picker.append( '<input type="hidden" />' );

		var current_color = $('<span class="meme-generator-current-color" />');
		current_color.css( "background-color", first );

		picker.append( current_color );
		
		picker.append(colors);
		elm.append( picker );

		colors.on('click', "li", function(){
			var that = $(this),
				parent = that.parents(".mg-text-box").eq(0),
				the_picker = that.parents("div").eq(0),
				color = that.css('background-color');

			the_picker.find(".meme-generator-current-color").css( "background-color", color );
			the_picker.find("input").val( color );

			var related_id = parent.attr('class').split(" ");
			related_id = related_id[1];
			
			update_caption_text( related_id, parent.find("textarea").val() )

			colors.hide();
		});

		picker.on('click', '.meme-generator-current-color', function(){

			maincontainer.find(".meme-generator-color-picker-list").hide();
			colors.show();
		});
	}

	function fitImageOn( canvas, context ) 
	{
		mainimage_width = mainimage.width();
		var imageAspectRatio = img.width / img.height;

		if( img.width > mainimage_width ){

			var renderableHeight = mainimage_width * img.height / img.width;
			$(canvas).attr( 'width', mainimage_width );
			$(canvas).attr( 'height', renderableHeight );

			mainimage.height( renderableHeight );

			context.drawImage(img, 0, 0, img.width, img.height, 0, 0, mainimage_width, renderableHeight );
		}
	}

	function load_image( the_image )
	{
		img.src = the_image;
		img.onload = function() {
			canvas = mainimage.find("canvas")[0];

			context = canvas.getContext("2d");
			fitImageOn( canvas, context );

			$.each(captions, function(key, value ){
				add_text_caption( value );
			});
		};
	}

	function imageLoader() 
	{
	    var reader = new FileReader();
	    reader.onload = function(event) {
	    	context.clearRect(0,0,canvas.width, canvas.height);
	    	load_image( this.result );
	    }
	    reader.readAsDataURL( maincontainer.find("#meme-generator-file-input")[0].files[0]);
	}

	function get_uniqid()
	{
		var n=Math.floor(Math.random()*11);
		var k = Math.floor(Math.random()* 1000000000);
		return $.trim( 'meme-generator-settings-' + $.trim( k ));
	}

	function add_text_caption( options )
	{
		var uniqid = get_uniqid();
		var settings_box = $("<div />");

		settings_box.addClass('mg-text-box');
		settings_box.addClass( uniqid );

		settings_box.append('<textarea placeholder="' + ( options.placeholder ) + '"></textarea>');

		var _opts_elm = $('<div class="mg-quick-options" />');

		var _font_color = $('<span class="mg-text-color" title="' + ( i18n.settings['text-color'] ) + '" />');
		_opts_elm.append( _font_color );

		var _shadow_color = $('<span class="mg-shadow-color" title="' + ( i18n.settings['shadow-color'] ) + '" />');
		_opts_elm.append( _shadow_color );

		_opts_elm.append( '<input type="number" value="10" name="shadow-spread" min="1" max="20">' );

		settings_box.append( _opts_elm );

		maincontainer.find('.mg-text-boxes').append(settings_box);

		build_color_picker( _font_color, options.colors.font );
		build_color_picker( _shadow_color, options.colors.shadow );


		var text_box = $("<div />");

		text_box.addClass('meme-generator-resizable');

		text_box.addClass( uniqid );

		var handles_pos = [];
		handles_pos.push('nw');
		handles_pos.push('ne');
		handles_pos.push('sw');
		handles_pos.push('se');
		handles_pos.push('n');
		handles_pos.push('s');
		handles_pos.push('e');
		handles_pos.push('w');

		$.each(handles_pos, function(key, val){
			text_box.append( '<div class="ui-resizable-handle ui-resizable-' + ( val ) + '" />' );
		});

		mainimage.append( text_box );
		make_resizable( text_box );

		var offset = 10;
		text_box.css({
			'width': mainimage_width - (offset * 2),
			'left': offset
		});

		var _canvas_holder = $('<div class="meme-generator-text-wrapper" />');

		if( options['pos'] == 'top'  ){
			text_box.css( 'top', offset );

			_canvas_holder.addClass('meme-align-top');
		}
		else if( options['pos'] == 'bottom' ) {
			text_box.css( 'bottom', offset );
			_canvas_holder.addClass('meme-align-bottom');
		}
		else{
			text_box.css( 'top', options['pos'] );
			_canvas_holder.addClass('meme-align-center');
		}

		text_box.append( _canvas_holder );
	}

	function update_caption_text( related_id, value, font_size )
	{
		var holder = maincontainer.find( ".meme-generator-resizable." + related_id );
		var settings = maincontainer.find( ".mg-text-box." + related_id );

		// default font size
		if( typeof(font_size) == "undefined" ){
			font_size = maincontainer.find('input[name="font-size"]').val();
		}

		var _canvas_holder = holder.find(".meme-generator-text-wrapper"),
			_canvas = $('<canvas />');

		var _ctx = _canvas[0].getContext("2d");

		_canvas.attr( 'width', _canvas_holder.width() + 20 );

		_ctx.font = font_size + 'px ' + maincontainer.find(".mg-text-font-family").val();
		_ctx.textBaseline = 'top';

		//ctx.fillStyle = "black";
		//ctx.fillRect(0, 0, 400, 200);

		var blur = parseInt(settings.find("input[type='number']").val());
		var text_width = _ctx.measureText(value).width + blur * 2;

		_ctx.shadowColor = settings.find(".mg-shadow-color .meme-generator-current-color").css("background-color");
		_ctx.shadowOffsetX = text_width;
		_ctx.shadowOffsetY = 0;
		_ctx.shadowBlur = blur;
		
		_ctx.fillText( value, -text_width + blur, 0);
		
		_ctx.fillStyle = settings.find(".mg-text-color .meme-generator-current-color").css("background-color");
		_ctx.shadowOffsetX = 0;
		_ctx.fillText( value, blur, 0 );

		_canvas_holder.css( 'width', text_width );
		_canvas_holder.css( 'height', holder.height() );
		_canvas_holder.html( _canvas );

		holder.data( 'text', value );
		holder.data( 'width', text_width );
	}

	function make_resizable( box )
	{
		box.draggable({
	      containment: mainimage
	    });

		box.resizable({
			containment: mainimage,
		    handles: {
		        'nw': '.ui-resizable-nw',
		        'ne': '.ui-resizable-ne',
		        'sw': '.ui-resizable-sw',
		        'se': '.ui-resizable-se',
		        'n': '.ui-resizable-n',
		        'e': '.ui-resizable-e',
		        's': '.ui-resizable-s',
		        'w': '.ui-resizable-w'
		    },
		    resize: function( event, ui ) {}
		});
	}

	function set_caption( caption )
	{
		captions.push( caption );
	}

	function generate_meme()
	{
		var image = canvas.toDataURL("image/png"),
			save_image = $("#mg-generate-test-img"),
			final_canvas = $("<canvas />");

		final_canvas.attr("width", $(canvas).width());
		final_canvas.attr("height", $(canvas).height());
		save_image.html(final_canvas);

		var final_context = final_canvas[0].getContext('2d');

		final_context.drawImage( canvas, 0, 0 );

		maincontainer.find(".meme-generator-resizable").each(function(){
			var that = $(this),
				_canvas = that.find("canvas"),
				text_wrapper = that.find(".meme-generator-text-wrapper"),
				_pos 	= that.position(),
				__pos = text_wrapper.position();

			var top = _pos.top;
			var left = _pos.left + __pos.left;
			console.log( left, __pos  );
			
			final_context.drawImage( _canvas[0], left, top );
			//context.drawImage(img, 0, 0, img.width, img.height, 0, 0, mainimage_width, renderableHeight );
		});

		// Display generated image
		$("#mg-generate-test-img").attr( 'src', image );
	}

    function triggers() 
    {
		maincontainer.on('click', '#mg-upload-own-image', function(){
			maincontainer.find("#meme-generator-file-input").click();
		});

		maincontainer.on('click', '#mg-action-generate-meme', function(){
			generate_meme();
		});

		maincontainer.on( 'change', "#meme-generator-file-input", imageLoader );

		maincontainer.on("keyup", '.mg-text-box textarea', function(){
			var related_id = $(this).parent().attr('class').split(" ");
			related_id = related_id[1];

			update_caption_text( related_id, $(this).val() );
		});

		maincontainer.on('change', 'input[name="shadow-spread"]', function(){
			var that = $(this),
				parent = that.parents(".mg-text-box").eq(0);

			var related_id = parent.attr('class').split(" ");
			related_id = related_id[1];
			
			update_caption_text( related_id, parent.find("textarea").val() );
		});

		// Initiate Carousel
		$("#mg-carousel").owlCarousel({
			items: 6,
			pagination: false,
			navigation: true,
			navigationText: ["&#xf104","&#xf105"]
		});

		maincontainer.on('change', 'select.mg-text-font-family,input[name="font-size"]', function(){
			var that = $(this);

			var settings_elms = $(".mg-text-boxes .mg-text-box");

			settings_elms.each(function(){
				var parent = $(this),
					related_id = parent.attr('class').split(" ");
				related_id = related_id[1];
					
				update_caption_text( related_id, parent.find("textarea").val() );
			});
		});

		maincontainer.on('click', '#mg-add-another-box', function(){
			var that = $(this);

			add_text_caption({
				'pos'			: '40%',
				'placeholder'	: 'New Text',
				'colors'		: {
					'font'	: '#ffffff',
					'shadow': '#e67e22'
				}
			});
		});
    }

	// external usage
	return {
		"load_image"		: load_image,
		"set_caption"		: set_caption
	}
})(jQuery);