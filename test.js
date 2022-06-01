const PDFDocument = require( 'pdfkit' );
const fs = require( 'fs' );
var doc = new PDFDocument( { autoFirstPage: true, displayTitle: true } );

doc.text( 'aaaa' );

doc.pipe( fs.createWriteStream( 'test.pdf' ) );
doc.end();