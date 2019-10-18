Ext.define( 'JobOpenings.view.alljobapplications.AllJobApplicationsUtil',{
	singleton: true,
	alternateClassName: ['Util'],

	convertFileToJson: function( fileField, callback ){
		var file = fileField.fileInputEl.dom.files[0];
		var fileType = file.name.substr( file.name.lastIndexOf( '.' ) + 1 );
		var reader = new FileReader();
		  reader.onload = function( e ){
		  	var data = e.target.result;
		  	var wb, output;
            var arr = fixdata(data);
			switch( fileType ){
				case 'xlsx':
				case 'xlsm':
				case 'xlsb':
				case 'xls':
					wb = X.read(btoa(arr), {type: 'base64'});
              		output = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
              		console.log(output);
					break;
				default: 
					output = false;
			}
			callback( output );
		  };
		reader.readAsArrayBuffer( file );
	}
	
});