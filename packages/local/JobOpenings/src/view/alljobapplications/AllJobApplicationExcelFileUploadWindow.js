Ext.define('JobOpenings.view.alljobapplications.AllJobApplicationExcelFileUploadWindow', {
	extend: 'Ext.window.Window',
	xtype: 'allJobApplicationexcelfileuploadwindow',
	requires: [
		'JobOpenings.view.alljobapplications.AllJobApplicationsExcelFileupload',
		// 'JobOpenings.view.alljobapplications.AllJobApplicationsViewModel'
	],
	title: 'Upload Excel File',
	modal: true,
	minHeight:200,
	maxHeight: 300,
	width: 620,
	margin: '5 50 0 0',
	layout: {
		type: 'fit'
	},
	// viewModel: 'alljobapplicationsviewmodel',
	closeAction: 'hide',
	reference:'alljobapplicationexcelfileuploadwinref',
	resizable: false,
	cls: 'ddo-filter-window',
	title: 'Upload Excel File',
	initComponent: function() { /*filter init component*/
		var me = this;
		me.callParent(arguments);
		me.mon(Ext.getBody(), 'click', function (el, e) {
			me.close(me.closeAction);
		}, me, { delegate: '.x-mask' });
	},
	items: [{
		xtype: 'alljobapplicationsexcelfileupload' 
    }]
});