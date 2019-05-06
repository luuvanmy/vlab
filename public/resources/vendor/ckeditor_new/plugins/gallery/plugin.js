// CKEDITOR.plugins.add( 'vuegallery', {

// 	// Register the icons. They must match command names.
// 	icons: 'vuegallery',

// 	// The plugin initialization logic goes inside this method.
// 	init: function( editor ) {
// 		console.log(editor);
// 		// Define the editor command that inserts a timestamp.
// 		editor.addCommand( 'insertVuegallery', {

// 			// Define the function that will be fired when the command is executed.
// 			exec: function( editor ) {
// 				var now = new Date();

// 				// Insert the timestamp into the document.
// 				editor.insertHtml( 'The current date and time is: <em>' + now.toString() + '</em>' );
// 			}
// 		});

// 		// Create the toolbar button that executes the above command.
// 		editor.ui.addButton( 'Vuegallery', {
// 			label: 'Insert Vuegallery',
// 			command: 'insertVuegallery',
// 			toolbar: 'insert'
// 		});
// 	}
// });