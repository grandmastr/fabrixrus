"use strict";
// product-magnifier var
	var beeta_magnifier_vars;
	var yith_magnifier_options = {
		
		sliderOptions: {
			responsive: beeta_magnifier_vars.responsive,
			circular: beeta_magnifier_vars.circular,
			infinite: beeta_magnifier_vars.infinite,
			direction: 'left',
            debug: false,
            auto: false,
            align: 'left',
            height: 'auto',
            //height: "100%", //turn vertical
            //width: 100,  
			prev    : {
				button  : "#slider-prev",
				key     : "left"
			},
			next    : {
				button  : "#slider-next",
				key     : "right"
			},
			scroll : {
				items     : 1,
				pauseOnHover: true
			},
			items   : {
				visible: Number(beeta_magnifier_vars.visible),
			},
			swipe : {
				onTouch:    true,
				onMouse:    true
			},
			mousewheel : {
				items: 1
			}
		},
		
		showTitle: false,
		zoomWidth: beeta_magnifier_vars.zoomWidth,
		zoomHeight: beeta_magnifier_vars.zoomHeight,
		position: beeta_magnifier_vars.position,
		lensOpacity: beeta_magnifier_vars.lensOpacity,
		softFocus: beeta_magnifier_vars.softFocus,
		adjustY: 0,
		disableRightClick: false,
		phoneBehavior: beeta_magnifier_vars.phoneBehavior,
		loadingLabel: beeta_magnifier_vars.loadingLabel,
	};