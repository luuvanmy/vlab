/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
	 config.language = 'en';
    // config.uiColor = '#AADC6E';
    config.toolbar =  [
        // { name: 'document', items : [ 'Source','-','Save','NewPage','DocProps','Preview','Print','-','Templates' ] },
        { name: 'document', items : [ 'Source','-','Templates' ] },
        { name: 'clipboard', items : [ 'Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo' ] },
        { name: 'editing', items : [ 'Find','Replace','-','SelectAll','-','SpellChecker', 'Scayt' ] },
        { name: 'forms', items : [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton',
            'HiddenField' ] },
        // '/',
        { name: 'basicstyles', items : ['Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat' ] },
        { name: 'paragraph', items : [ 'NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote','CreateDiv',
            '-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','BidiLtr','BidiRtl' ] },
        { name: 'links', items : [ 'Link','Unlink','Anchor' ] },
        { name: 'insert', items : ['Youtube','base64image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak','Iframe'] },
        // '/',
        { name: 'styles', items : [ 'Styles','Format','Font','FontSize' ] },
        { name: 'colors', items : [ 'TextColor','BGColor' ] },
        // { name: 'tools', items : [ 'Maximize', 'ShowBlocks','-','AboutAbout' ] }
        { name: 'tools', items : [ 'Maximize', 'ShowBlocks' ] }
    ];
    
	// Remove some buttons provided by the standard plugins, which are
	// not needed in the Standard(s) toolbar.
	config.extraPlugins = 'tableresize,font,youtube,base64image,imageresize';
    config.youtube_width = '640';
    config.youtube_height = '480';
    config.youtube_responsive = true;
    config.youtube_controls = false;
    config.forcePasteAsPlainText = true;
    config.allowedContent = 'p[*] h3[*] h4[*] span[*] img[*]';

	// Simplify the dialog windows.
	config.removeDialogTabs = 'image:advanced;link:advanced';
	config.extraPlugins='imagepaste'; 
	config.filebrowserUploadUrl  =  "base64";
    config.image_removeLinkByEmptyURL = false;
};
