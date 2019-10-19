Ext.define('JobOpenings.view.alljobapplications.AllJobApplicationsToolbar', {
	extend: 'Ext.panel.Panel',
	xtype: 'alljobapplicationstoolbar',
	reference: 'alljobapplicationstoolbarref',
	layout: {
		type: 'hbox',
		width: '100%'
	},
	cls: 'filtertoolbar-cls',
	items: [{
			xtype: 'button',
			width: 6,
			cls: 'karmascore-search-icon-field job-search-icon',
			iconCls: 'x-fa fa-search',
			height: 6
			//padding: '-8 11 14 12'
		}, {

			xtype: 'textfield',
			width: '30%',
			reference: 'alljobapplicationssearchref',
			emptyText:'Search',
			enableKeyEvents: true,
			cls: 'karmascore-search-field searchFields job-search-field',
			listeners: {
				change: 'onKeyUpAllJobSearch'
			}
		}, {
			xtype: 'tbfill'
		}, {
            xtype: 'button',
            text: 'Download Excel Template',
            width: 170,
            height: 35,
            textAlign: 'center',
			cls: 'alljobapplicationsexceltemp-btn-cls',
			href:'/resources/excelfileformat/ExcelUpload.xlsx',
			target:'_blank'
        }, {
			xtype: 'button',
			text: 'Upload Excel',
			width: 100,
			height: 35,
			textAlign: 'center',
			cls: 'create-new-btn-cls',
			listeners: {
				click: 'exceluploadClick'
			}
		
		},{
        	xtype:'tbspacer',
        	width: 19
       }]
});
