
/**
 * Front JS
 */



// addon type (checkbox)

jQuery('body').on( 'change', '.yith-wapo-addon-type-checkbox input', function() {
	var optionWrapper = jQuery(this).parents('.yith-wapo-option');
	// Proteo check
	// if ( ! optionWrapper.hasClass('yith-wapo-option') ) { optionWrapper = optionWrapper.parent(); }
	if ( jQuery(this).is(':checked') ) {
		optionWrapper.addClass('selected');
		
		// Single selection
		if ( optionWrapper.hasClass('selection-single') ) {
			// Disable all
			optionWrapper.parent().find('input').prop('checked', false);
			optionWrapper.parent().find('.selected').removeClass('selected');
			// Enable only the current option
			optionWrapper.find('input').prop('checked', true);
			optionWrapper.addClass('selected');
		}

		// Replace image
		yith_wapo_replace_image( optionWrapper );

	} else {
		optionWrapper.removeClass('selected');
		yith_wapo_replace_image( optionWrapper, true );
	}
});

// addon type (color)

jQuery('body').on( 'change', '.yith-wapo-addon-type-color input', function() {
	var optionWrapper = jQuery(this).parent();
	// Proteo check
	if ( ! optionWrapper.hasClass('yith-wapo-option') ) { optionWrapper = optionWrapper.parent(); }
	if ( jQuery(this).is(':checked') ) {
		optionWrapper.addClass('selected');

		// Single selection
		if ( optionWrapper.hasClass('selection-single') ) {
			// Disable all
			optionWrapper.parent().find('input').prop('checked', false);
			optionWrapper.parent().find('.selected').removeClass('selected');
			// Enable only the current option
			optionWrapper.find('input').prop('checked', true);
			optionWrapper.addClass('selected');
		}

		// Replace image
		yith_wapo_replace_image( optionWrapper );

	} else {
		optionWrapper.removeClass('selected');
		yith_wapo_replace_image( optionWrapper, true );
	}
});

// addon type (label)

jQuery('body').on( 'change', '.yith-wapo-addon-type-label input', function() {
	var optionWrapper = jQuery(this).parent();
	// Proteo check
	if ( ! optionWrapper.hasClass('yith-wapo-option') ) { optionWrapper = optionWrapper.parent(); }
	if ( jQuery(this).is(':checked') ) {
		optionWrapper.addClass('selected');

		// Single selection
		if ( optionWrapper.hasClass('selection-single') ) {
			// Disable all
			optionWrapper.parent().find('input').prop('checked', false);
			optionWrapper.parent().find('.selected').removeClass('selected');
			// Enable only the current option
			optionWrapper.find('input').prop('checked', true);
			optionWrapper.addClass('selected');
		}

		// Replace image
		yith_wapo_replace_image( optionWrapper );

	} else {
		optionWrapper.removeClass('selected');
		yith_wapo_replace_image( optionWrapper, true );
	}
});

// addon type (product)

jQuery('body').on( 'change', '.yith-wapo-addon-type-product input', function() {
	var optionWrapper = jQuery(this).parent();// Proteo check
	// Proteo check
	if ( ! optionWrapper.hasClass('yith-wapo-option') ) { optionWrapper = optionWrapper.parent(); }
	if ( jQuery(this).is(':checked') ) {
		optionWrapper.addClass('selected');

		// Single selection
		if ( optionWrapper.hasClass('selection-single') ) {
			// Disable all
			optionWrapper.parent().find('input').prop('checked', false);
			optionWrapper.parent().find('.selected').removeClass('selected');
			// Enable only the current option
			optionWrapper.find('input').prop('checked', true);
			optionWrapper.addClass('selected');
		}

		// Replace image
		yith_wapo_replace_image( optionWrapper );

	} else {
		optionWrapper.removeClass('selected');
		yith_wapo_replace_image( optionWrapper, true );
	}
});

// addon type (radio)

jQuery('body').on( 'change', '.yith-wapo-addon-type-radio input', function() {
	var optionWrapper = jQuery(this).parent();
	// Proteo check
	if ( ! optionWrapper.hasClass('yith-wapo-option') ) { optionWrapper = optionWrapper.parent(); }
	if ( jQuery(this).is(':checked') ) {
		optionWrapper.addClass('selected');

		// Replace image
		yith_wapo_replace_image( optionWrapper );

	} else { optionWrapper.removeClass('selected'); }
});

// addon type (select)

jQuery('body').on( 'change', '.yith-wapo-addon-type-select select', function() {
	var optionWrapper = jQuery(this).parent();
    var selectedOption = jQuery(this).find('option:selected');

	// Proteo check
	if ( ! optionWrapper.hasClass('yith-wapo-option') ) { optionWrapper = optionWrapper.parent(); }

    // Description & Image
    var optionImage = selectedOption.data('image');
    var optionDescription = selectedOption.data('description');
    if ( typeof optionImage !== 'undefined' ) {
        optionImage = '<img src="' + optionImage + '" style="max-width: 100%">';
        optionWrapper.find('div.option-image').html( optionImage );
    }
    console.log(optionDescription);
    optionWrapper.find('p.option-description').html( optionDescription );

	// Replace image
	yith_wapo_replace_image( selectedOption );

});
jQuery('.yith-wapo-addon-type-select select').trigger('change');






// toggle feature

jQuery( document ).on( 'click', '.yith-wapo-addon.wapo-toggle .wapo-addon-title', function(){
	jQuery(this).parent().find('.options').toggle('fast');
	jQuery(document).trigger('yith_proteo_inizialize_html_elements');
});






// function: replace image

function yith_wapo_replace_image( optionWrapper, reset = false ) {
	var defaultPath = '.woocommerce-product-gallery .woocommerce-product-gallery__wrapper .woocommerce-product-gallery__image:first-child img';
    defaultPath += ', .woocommerce-product-gallery .woocommerce-product-gallery__wrapper .woocommerce-product-gallery__image:first-child source';
	defaultPath += ', .yith_magnifier_zoom img, .yith_magnifier_zoom_magnifier';
	defaultPath += ', .owl-carousel .woocommerce-main-image';
	defaultPath += ', .woocommerce-product-gallery__image .wp-post-image';
    defaultPath += ', .dt-sc-product-image-gallery-container .wp-post-image';
	var zoomMagnifier = '.yith_magnifier_zoom_magnifier, .zoomWindowContainer .zoomWindow';

	if ( typeof optionWrapper.data('replace-image') !== 'undefined' && optionWrapper.data('replace-image') != '' ) {
		var replaceImageURL = optionWrapper.data('replace-image');

		// save original image for the reset
		if ( typeof( jQuery(defaultPath).attr('wapo-original-img') ) == 'undefined' ) {
			jQuery(defaultPath).attr( 'wapo-original-img', jQuery(defaultPath).attr('src') );
			if ( jQuery(zoomMagnifier).length ) {
				jQuery(zoomMagnifier).attr( 'wapo-original-img', jQuery(zoomMagnifier).css('background-image').slice(4, -1).replace(/"/g, "") );
			}
		}

		jQuery(defaultPath).attr( 'src', replaceImageURL );
		jQuery(defaultPath).attr( 'srcset', replaceImageURL );
		jQuery(zoomMagnifier).css('background-image', 'url(' + replaceImageURL + ')');
		jQuery('#yith_wapo_product_img').val( replaceImageURL );

	}
	if ( reset && typeof( jQuery(defaultPath).attr('wapo-original-img') ) != 'undefined' ) {

		var originalImage = jQuery(defaultPath).attr('wapo-original-img');
		var originalZoom = jQuery(zoomMagnifier).attr('wapo-original-img');

		jQuery(defaultPath).attr( 'src', originalImage );
		jQuery(defaultPath).attr( 'srcset', originalImage );
		jQuery(zoomMagnifier).css('background-image', 'url(' + originalZoom + ')');

	}
}

// function: check_required_fields

function yith_wapo_check_required_fields( action ) {
	var isRequired = false;
	var hideButton = false;
	var buttonClasses = yith_wapo.dom.single_add_to_cart_button;
	jQuery( 'form.cart .yith-wapo-addon:not(.hidden) input, form.cart .yith-wapo-addon:not(.hidden) select, form.cart .yith-wapo-addon:not(.hidden) textarea' ).each( function() {

        var parent = jQuery(this).parent();

		jQuery(this).css( 'border', '' );
        parent.find( '.required-error' ).css( 'display', 'none' );
		if (
			jQuery(this).attr( 'required' ) && 'checkbox' === jQuery(this).attr('type') && ! jQuery(this).parent( '.yith-wapo-option' ).hasClass( 'selected' )
		||
			jQuery(this).attr('required') && ( jQuery(this).val() == '' || jQuery(this).val() == 'Required' )
		) {
			if ( action == 'highlight' ) {
				jQuery(this).css( 'border', '1px solid #f00' );
                parent.find( '.yith-wapo-ajax-uploader' ).css( 'border', '1px dashed #f00' );
                parent.find( '.yith-wapo-ajax-uploader' ).css( 'background-color', '#fee' );
                parent.find( '.required-error' ).css( 'display', 'block' );
			}
			hideButton = true;
			isRequired = true;
		}
	});
	if ( action == 'hide' ) {
		if ( hideButton ) { jQuery( buttonClasses ).hide(); }
		else { jQuery( buttonClasses ).fadeIn(); }
	}
	return ! isRequired;
}





// conditional logic

window.setInterval( function() { yith_wapo_conditional_logic_check(); }, 1000 );
jQuery('form.cart .yith-wapo-addon').on( 'change', '*', function() { yith_wapo_conditional_logic_check(); });

function yith_wapo_conditional_logic_check() {
	jQuery('form.cart .yith-wapo-addon.conditional_logic').each(function() {

		var matchAll = true;
		var matchAny = false;

		var addonID = jQuery(this).data('addon_id');
		var logicDisplay = jQuery(this).data('conditional_logic_display');					// show / hide
		var logicDisplayIf = jQuery(this).data('conditional_logic_display_if');				// all / any
		var ruleAddon = String( jQuery(this).data('conditional_rule_addon') ).split('|');
		var ruleAddonIs = String( jQuery(this).data('conditional_rule_addon_is') ).split('|');

		for ( var x=0; x<ruleAddon.length; x++ ) {

			var ruleAddonSplit = ruleAddon[x].split('-');
			var anyEmpty = false;
			var anySelected = false;

			// variation check
			if ( ruleAddonSplit[0] == 'v' ) {
				
				if ( jQuery('.variation_id').val() == ruleAddonSplit[2] ) {
					anySelected = true;
				}

			// option check
			} else if ( typeof ruleAddonSplit[1] != 'undefined' ) {

				anySelected = (
					jQuery( '#yith-wapo-' + ruleAddonSplit[0] + '-' + ruleAddonSplit[1] ).is(':checked')
					|| jQuery( 'select#yith-wapo-' + ruleAddonSplit[0] ).val() == ruleAddonSplit[1]
				) && ! jQuery( '#yith-wapo-addon-' + ruleAddonSplit[0] ).hasClass( 'hidden' );

				var typeText = jQuery( 'input#yith-wapo-' + ruleAddonSplit[0] + '-' + ruleAddonSplit[1] ).val();			// text
				var typeTextarea = jQuery( 'textarea#yith-wapo-' + ruleAddonSplit[0] + '-' + ruleAddonSplit[1] ).val();		// textarea
				anyEmpty = (
					( typeof typeText != 'undefined' && typeText !== '' )
					|| ( typeof typeTextarea != 'undefined' && typeTextarea !== '' )
				);

			// addon check
			} else {
				anySelected = (
					jQuery( '#yith-wapo-addon-' + ruleAddon[x] + ' input:checkbox:checked').length > 0
					|| jQuery( '#yith-wapo-addon-' + ruleAddon[x] + ' input:radio:checked').length > 0
					|| jQuery( '#yith-wapo-addon-' + ruleAddon[x] + ' option:selected').length > 0
				);
			}

			if ( ruleAddonIs[x] == 'selected' ) {
				if ( anySelected )	{ matchAny = true; }
				else				{ matchAll = false; }
			} else if ( ruleAddonIs[x] == 'not-selected' ) {
				if ( anySelected )	{ matchAll = false; }
				else				{ matchAny = true; }
			} else if ( ruleAddonIs[x] == 'empty' ) {
				if ( anyEmpty )	{ matchAll = false; }
				else			{ matchAny = true; }
			} else if ( ruleAddonIs[x] == 'not-empty' ) {
				if ( anyEmpty )	{ matchAny = true; }
				else			{ matchAll = false; }
			}

		}

		if ( logicDisplayIf == 'all' && matchAll ) {
			if ( logicDisplay == 'show' ) { jQuery(this).fadeIn().removeClass('hidden'); }
			else { jQuery(this).hide().addClass('hidden'); }
		} else if ( logicDisplayIf == 'any' && matchAny ) {
			if ( logicDisplay == 'show' ) { jQuery(this).fadeIn().removeClass('hidden'); }
			else { jQuery(this).hide().addClass('hidden'); }
		} else {
			if ( logicDisplay == 'show' ) { jQuery(this).hide().addClass('hidden'); }
			else { jQuery(this).fadeIn().removeClass('hidden'); }
		}

	});
}

// ajax reload addons

jQuery('form.cart').on( 'yith-wapo-reload-addons', function( event, productPrice = '' ) {
	jQuery('#yith-wapo-container').css('opacity', '0.5');
	var addons = jQuery('form.cart').serializeArray();
	var data = {
		'action'	: 'live_print_blocks',
		'addons'	: addons,
	};
	if ( productPrice != '' ) {
		data.price = productPrice;
	}
	jQuery.ajax( {
		url : ajaxurl,
		type : 'post',
		data : data,
		success : function( response ) {
			jQuery('#yith-wapo-container').html( response );
			yith_wapo_conditional_logic_check();
			jQuery('#yith-wapo-container').css('opacity', '1');
		}
	});
	return false;
});

// reload after variation change
jQuery('form.cart').on( 'change', '.variations', function() {
	jQuery('form.cart').trigger( 'yith-wapo-reload-addons');
});

// WooCommerce Measurement Price Calculator (compatibility)
jQuery('form.cart').on( 'change', '#price_calculator', function() {
	var price = jQuery('#price_calculator .product_price .amount').text().replace( ',', '.' );
	price = price.replace(/[^0-9\.-]+/g,'');
	jQuery('form.cart').trigger( 'yith-wapo-reload-addons', [ price ] );
});

// YITH ROLE BASED PRICES compatibility
jQuery('form.cart').on('change','.variation_id',function(){

	jQuery('form.cart').trigger( 'yith-wapo-reload-addons');
});

/*
 *	ajax upload file
 */

// preventing page from redirecting
jQuery('html').on('dragover', function(e) {
	e.preventDefault();
	e.stopPropagation();
});
jQuery('html').on('drop', function(e) { e.preventDefault(); e.stopPropagation(); });

// drag enter
jQuery('.yith-wapo-ajax-uploader').on('dragenter', function (e) {
	e.stopPropagation();
	e.preventDefault();
	jQuery(this).css( 'opacity', '0.5' );
});

// drag over
jQuery('.yith-wapo-ajax-uploader').on('dragover', function (e) {
	e.stopPropagation();
	e.preventDefault();
});

// drag leave
jQuery('.yith-wapo-ajax-uploader').on('dragleave', function (e) {
	e.stopPropagation();
	e.preventDefault();
	jQuery(this).css( 'opacity', '1' );
});

// drop
jQuery('.yith-wapo-ajax-uploader').on('drop', function (e) {
	e.stopPropagation();
	e.preventDefault();

	var input = jQuery(this).parent().find('input.file');
	var file = e.originalEvent.dataTransfer.files[0];
	var data = new FormData();
	data.append( 'action', 'upload_file' );
	data.append( 'file', file );

	if ( wapo_upload_allowed_file_types.includes( file.name.split('.').pop() ) ) {
		if ( file.size <= wapo_upload_max_file_size * 1024 * 1024 ) {
			yith_wapo_ajax_upload_file( data, file, input );	
		} else { alert('Error: max file size ' + wapo_upload_max_file_size + ' MB!') }
	} else { alert('Error: not supported extension!') }
});

// click
jQuery('#yith-wapo-container').on('click', '.yith-wapo-ajax-uploader .button, .yith-wapo-ajax-uploader .link', function() {
	jQuery(this).parent().parent().find('input.file').click();
});

// upload on click
jQuery('#yith-wapo-container').on('change', '.yith-wapo-addon-type-file input.file', function() {
	var input = jQuery(this);
	var file = jQuery(this)[0].files[0];		
	var data = new FormData();
	data.append( 'action', 'upload_file' );
	data.append( 'file', file );

	if ( wapo_upload_allowed_file_types.includes( file.name.split('.').pop() ) ) {
		if ( file.size <= wapo_upload_max_file_size * 1024 * 1024 ) {
			yith_wapo_ajax_upload_file( data, file, input );	
		} else { alert('Error: max file size ' + wapo_upload_max_file_size + ' MB!') }
	} else { alert('Error: not supported extension!') }
	
});

// remove
jQuery('#yith-wapo-container').on('click', '.yith-wapo-uploaded-file .remove', function() {
	jQuery(this).parent().hide();
	jQuery(this).parent().parent().find('.yith-wapo-ajax-uploader').fadeIn();
	jQuery(this).parent().parent().find('input').val('');
	jQuery(this).parent().parent().find('input.option').change();
});

function yith_wapo_ajax_upload_file( data, file, input ) {
	jQuery.ajax( {
		url			: ajaxurl,
		type		: 'POST',
		contentType	: false,
		processData	: false,
		data		: data,
		success : function( response ) {

			var wapo_option = input.parent();
			
			wapo_option.find('.yith-wapo-ajax-uploader').hide();
			//jQuery('.yith-wapo-ajax-uploader').html( 'Drop file to upload or <a href="' + response + '" target="_blank">browse</a>' );

			var file_size = parseFloat( file.size / 1024 / 1024 ).toFixed(2) + ' MB';
			var file_name = response.replace(/^.*[\\\/]/, '');

			wapo_option.find('.yith-wapo-uploaded-file .info').html( file_name + '<br />' + file_size );
			wapo_option.find('.yith-wapo-uploaded-file').fadeIn();
			wapo_option.find('input.option').val( response ).change();
		},
		error : function ( response ) {
			// jQuery('.yith-wapo-ajax-uploader').html( 'Error!<br /><br />' + response );
		}
	});
	return false;
}




jQuery('form.cart').on( 'click', 'span.checkboxbutton', function() {
	if ( jQuery(this).find( 'input' ).is( ':checked' ) ) {
		jQuery(this).addClass('checked');
	} else {
		jQuery(this).removeClass('checked');
	}
} );

jQuery('form.cart').on( 'click', 'span.radiobutton', function() {
	if ( jQuery(this).find( 'input' ).is( ':checked' ) ) {
		jQuery(this).parent().parent().parent().find('span.radiobutton.checked').removeClass('checked');
		jQuery(this).addClass('checked');
	}
} );






// min max rules

jQuery( '.yith-wapo-addon-type-checkbox, .yith-wapo-addon-type-color, .yith-wapo-addon-type-label, .yith-wapo-addon-type-product' ).each( function() {
	yith_wapo_check_min_max( jQuery( this ) );
});
jQuery( '.yith-wapo-addon-type-checkbox, .yith-wapo-addon-type-color, .yith-wapo-addon-type-label, .yith-wapo-addon-type-product' ).on( 'change', function() {
	yith_wapo_check_min_max( jQuery( this ) );
});

jQuery('form.cart').on('click', 'button', function() {
// jQuery('form.cart').submit( function() {
	if ( yith_wapo_check_required_min_max() ) {
		jQuery('form.cart .yith-wapo-addon.conditional_logic.hidden').remove();
	} else {
		jQuery('html, body').animate( { scrollTop: jQuery('#yith-wapo-container').offset().top }, 500);
	}
	return yith_wapo_check_required_min_max();
});
jQuery(document).on( 'click', '.add-request-quote-button', function() {
	if ( ! yith_wapo_check_required_min_max() ) {
		yith_wapo_general.do_submit = false;
	}
});

function yith_wapo_check_required_min_max() {
	if ( ! yith_wapo_check_required_fields( 'highlight' ) ) {
		return false;
	}
	var requiredOptions = 0;
	var checkMinMax = '';
	jQuery('form.cart .yith-wapo-addon:not(.hidden)').each( function() {
		checkMinMax = yith_wapo_check_min_max( jQuery( this ), true );
		if ( checkMinMax > 0 ) {
			requiredOptions += checkMinMax;
		}
	});
	if ( requiredOptions > 0 ) {
		return false;
	}
	return true;
}

function yith_wapo_check_min_max( addon, submit = false ) {
	var minValue = addon.data('min');
	var maxValue = addon.data('max');
	var exaValue = addon.data('exa');
	var numberOfChecked = addon.find('input:checkbox:checked, input:radio:checked, option:not([value=""]):selected').length;

	if ( exaValue > 0 ) {

		if ( exaValue == numberOfChecked ) {
			addon.removeClass( 'required-min' );
			addon.find( '.min-error, .min-error span' ).hide();
			// addon.find('input:checkbox').attr( 'required', false );
			addon.find('input:checkbox').not(':checked').attr( 'disabled', true );
		} else {
			var optionsToSelect = 0;
			if ( submit ) {
				optionsToSelect = exaValue - numberOfChecked;
				addon.addClass( 'required-min' );
				addon.find( '.min-error' ).show();
				if ( optionsToSelect == 1 ) {
					addon.find( '.min-error-an, .min-error-option' ).show();
				} else {
					addon.find( '.min-error-qty, .min-error-options' ).show();
					addon.find( '.min-error-qty' ).text( optionsToSelect );
				}
			}
			// addon.find('input:checkbox').attr( 'required', true );
			addon.find('input:checkbox').not(':checked').attr( 'disabled', false );
			return optionsToSelect;
		}

	} else {

		if ( maxValue > 0 ) {
			if ( maxValue > numberOfChecked ) {
				addon.find('input:checkbox').not(':checked').attr( 'disabled', false );
			} else {
				addon.find('input:checkbox').not(':checked').attr( 'disabled', true );
			}
		}

		if ( minValue > 0 ) {
			var optionsToSelect = 0;
			if ( minValue <= numberOfChecked ) {
				addon.removeClass( 'required-min' );
				addon.find( '.min-error, .min-error span' ).hide();
				// addon.find('input:checkbox').attr( 'required', false );
			} else {
				optionsToSelect = minValue - numberOfChecked;
				if ( submit ) {
					addon.addClass( 'required-min' );
					addon.find( '.min-error' ).show();
					if ( optionsToSelect == 1 ) {
						addon.find( '.min-error-an, .min-error-option' ).show();
					} else {
						addon.find( '.min-error-qty, .min-error-options' ).show();
						addon.find( '.min-error-qty' ).text( optionsToSelect );
					}
				}
				// addon.find('input:checkbox').attr( 'required', true );
			}
			return optionsToSelect;
		}

	}
}


// multiplied by value price

jQuery( 'body' ).on( 'keydown', '.yith-wapo-addon-type-number input', function() {
	yith_wapo_check_multiplied_price( jQuery( this ) );
});

function yith_wapo_check_multiplied_price( addon ) {
	var price = addon.data('price');
	var defaultPrice = addon.data('default-price');
	if ( ! defaultPrice > 0 ) {
		defaultPrice = price;
		addon.data('default-price', defaultPrice);
	}
	var priceType = addon.data('price-type');
	var priceMethod = addon.data('price-method');
    if ( priceMethod == 'value_x_product' ) {
        var productPrice = parseFloat( jQuery('#yith-wapo-container').data('product-price') );
        addon.data( 'price', addon.val() * productPrice );
    } else if ( priceType == 'multiplied' ) {
		addon.data( 'price', addon.val() * defaultPrice );
	}
}

// multiplied by length

jQuery( '.yith-wapo-addon-type-text, .yith-wapo-addon-type-textarea' ).on( 'change', 'input, textarea', function() {
	yith_wapo_check_multiplied_length( jQuery( this ) );
});

function yith_wapo_check_multiplied_length( addon ) {
	var price = addon.data('price');
	var defaultPrice = addon.data('default-price');
	if ( ! defaultPrice > 0 ) {
		defaultPrice = price;
		addon.data('default-price', defaultPrice);
	}
	var priceType = addon.data('price-type');
	var priceMethod = addon.data('price-method');
	if ( priceType == 'characters' ) {
		addon.data( 'price', addon.val().length * defaultPrice );
	}
}


// product qty

jQuery('.wapo-product-qty').keyup(function() {
	var productID = jQuery(this).data('product-id');
	var productQTY = jQuery(this).val();
	var productURL = '?add-to-cart=' + productID + '&quantity=' + productQTY;
	jQuery(this).parent().find('a').attr( 'href', productURL );
});

// calendar time selection

jQuery('.single-product').on('change', '#wapo-datepicker-time select', function() {
	var time = jQuery(this).val();
	jQuery('#temp-time').text( time );
	jQuery('.ui-state-active').click();
	// jQuery('#wapo-datepicker-time select').val( time );
	// var input = jQuery('.yith_wapo_date:focus');
	// var selectedDate = input.val();
	// input.val( selectedDate + ' ' + time );
});

// calendar time save

jQuery('.single-product').on('click', '#wapo-datepicker-save button', function() {
	jQuery('.hasDatepicker').datepicker('hide');
	// jQuery('#temp-time').text('');
});



