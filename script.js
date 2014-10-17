document.addEventListener("DOMContentLoaded", function(e) {

	/**
	 * Get a somewhat random color name
	 *
	 * @returns {string}
	 */
	function getRandomColor() {
		var colors = ['aqua', 'black', 'blue', 'brown', 'fuchsia', 'gold', 'gray', 'green', 'indigo', 'maroon', 'navy', 'olive', 'orange', 'peru', 'red', 'teal'];
		return colors[ Math.floor( Math.random() * colors.length ) ];
	}

	var stage = new Kinetic.Stage({
		container: 'container',
		width: 854,
		height: 480
	});

	var back = new Kinetic.Layer(),
		middle = new Kinetic.Layer(),
		front = new Kinetic.Layer();

	// Add layers to stage in order of back to front
	stage.add(back);
	stage.add(middle);
	stage.add(front);

	var background = new Kinetic.Rect({
		fill: 'white',
		width: stage.width(),
		height: stage.height()
	});

	// Add to the layer at the very back of the stage
	back.add(background);

	// Triangle will serve as a cursor while over the stage
	var triangle = new Kinetic.RegularPolygon({
		sides: 3,
		fill: 'GreenYellow',
		stroke: 'LawnGreen ',
		strokeWidth: 1,
		radius: 10,
		listening: false,
		rotation: -25
	});

	// Make sure tip of triangle is at end of cursor
	triangle.offset({
		y: -10
	});

	// Add to the layer at the very front of the stage
	front.add(triangle);

	// Every time the mouse goes over the stage, enters, or leaves
	stage.on('mousemove dragmove mouseleave mouseenter', function(e) {

		// Set triangle position to match the cursor
		triangle.setAttrs({
			x: e.evt.layerX,
			y: e.evt.layerY
		});

		// Hide cursor on mouseleave
		if (e.type === 'mouseleave') {
			triangle.setVisible(false);
		}
		// Show cursor on mouseenter
		else if (e.type === 'mouseenter') {
			triangle.setVisible(true);
		}

		// Draw this layer
		this.batchDraw();
	});

	// When stage is clicked (remember, events bubble!)
	stage.on('click tap', function(e) {

		// If the background was clicked
		if (e.target === background) {

			// If there are more than 10 dots
			if (middle.getChildren().length > 10) {
				var firstDot = middle.getChildren()[0], // Get the oldest dot (Kinetic.Group)
					firstCircle = firstDot.find('Circle')[0], // Get the oldest dot circle (Kinetic.Circle)
					firstText = firstDot.find('Text')[0]; // Get the oldest dot text (Kinetic.Text)

				// Animate dot radius to 0, then destroy dot
				var tweenCircle = new Kinetic.Tween({
					node: firstCircle,
					duration: 1,
					radius: 0,
					easing: Kinetic.Easings.BounceEaseOut,
					onFinish: function() {
						firstDot.destroy();
					}
				});

				// Animate dot text to become invisible
				var tweenText = new Kinetic.Tween({
					node: firstText,
					duration: .5,
					opacity: 0,
					easing: Kinetic.Easings.BounceEaseOut
				});

				tweenCircle.play();
				tweenText.play();
			}

			// New dot group
			var dot = new Kinetic.Group({
				name: 'dot',
				x: e.evt.layerX,
				y: e.evt.layerY,
				draggable: true // Allow dots to be dragged around stage
			});

			// New dot text
			var text = new Kinetic.Text({
				text: '1',
				fontFamily: 'cursive',
				fontSize: 13,
				fill: 'white',
				listening: false // No need for this to listen for events
			});

			// New dot circle
			var circle = new Kinetic.Circle({
				radius: 10,
				fill: getRandomColor()
			});

			var arc = new Kinetic.Arc({
				innerRadius: 0,
				outerRadius: 5,
				fill: getRandomColor(),
				angle: 36,
				rotationDeg: -90,
				listening: false // No need for this to listen for events
			});

			// Make sure dot text is centered
			text.offset({
				x: Math.round(text.width() / 2),
				y: Math.round(text.height() / 2)
			});

			dot.add(circle); // Add dot circle to dot group
			dot.add(arc);
			dot.add(text); // Add dot text to dot group

			middle.add(dot); // Add dot group to middle layer
		}
		// If we did not click on the background layer (we must have clicked on a dot then)
		else {
			var dot = e.target.getParent(), // Dot group
				text = dot.find('Text')[0], // Dot text
				circle = dot.find('Circle')[0], // Dot circle
				arc = dot.find('Arc')[0], // Dot arc
				number = parseInt( text.getText() ) + 1; // Calculate how many times this dot has been clicked

			// If this dot has been clicked more than 10 times
			if (number > 10) {
				var dots = stage.find('.dot'); // Find all dots

				// Loop through each dot
				dots.each(function(dot) {
					// Tween this dot, fall to bottom of stage, fade out, then destroy
					var tween = new Kinetic.Tween({
						node: dot,
						duration: .5, // Duration of tween in seconds
						opacity: 0,
						y: stage.height(),
						easing: Kinetic.Easings.BounceEaseOut,
						onFinish: function() {
							dot.destroy();
						}
					});

					tween.play();
				});
			}
			// If this dot has not been clicked more than 10 times
			else {
				dot.moveToTop(); // Place this dot above all other shapes in this layer

				// Update dot text with the number of times this dot has been clicked
				text.setAttrs({
					text: number
				});

				// Make sure text is centered on dot
				text.offset({
					x: Math.round(text.width() / 2),
					y: Math.round(text.height() / 2)
				});

				//circle.setAttrs({
				//	radius: circle.getAttr('radius') + 5
				//});

				//front.draw();

				// Make dot bigger
				var tweenCircle = new Kinetic.Tween({
					node: circle,
					duration: .5, // Duration of tween in seconds
					radius: circle.getAttr('radius') + 5, // Any numeric property such as x, y, rotation, width, height, radius, etc...
					easing: Kinetic.Easings.BackEaseOut // @url http://kineticjs.com/docs/Kinetic.Easings.html
				});

				// Rotate text in dot
				var tweenText = new Kinetic.Tween({
					node: text,
					duration: .5, // Duration of tween in seconds
					rotation: circle.getAttr('rotation') + 45,
					easing: Kinetic.Easings.Linear // @url http://kineticjs.com/docs/Kinetic.Easings.html
				});

				var tweenArc = new Kinetic.Tween({
					node: arc,
					duration: .5, // Duration of tween in seconds
					angle: arc.getAttr('angle') + 36,
					outerRadius: circle.getAttr('radius') - 5,
					easing: Kinetic.Easings.BackEaseOut // @url http://kineticjs.com/docs/Kinetic.Easings.html
				})

				tweenCircle.play();
				tweenText.play();
				tweenArc.play();
			}
		}
	});

	stage.draw();
});