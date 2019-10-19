Ext.define('JobOpenings.view.alljobapplications.AllJobApplicationsExcelFileupload', {
	extend: 'Ext.form.Panel',
	xtype: 'alljobapplicationsexcelfileupload',
	width:'100%',
	layout : {
		type  : 'vbox',
		pack  : 'center',
		align : 'middle'
	},
	requires: [
		'JobOpenings.view.alljobapplications.AllJobApplicationsController',
		'JobOpenings.view.alljobapplications.AllJobApplicationsViewModel'
	],
	viewModel: 'alljobapplicationsviewmodel',
	controller: 'alljobapplicationscontroller',
	cls: 'filter-window-color',
			items: [{
				xtype: 'combobox',
				reference: 'selectjobopeningref',
				name:'title',
				labelAlign: 'top',
				width:300,
				style:'margin-left:190px !important;',
				fieldLabel: 'Select Job Opening',
				allowBlank:false,
				// margin: '10 0 0 190',
				tpl: Ext.create('Ext.XTemplate',
				'<ul class="x-list-plain"><tpl for=".">',
					'<li role="option" class="x-boundlist-item" style="text-align:center;">{title}</li>',
				'</tpl></ul>'
			),
			// template for the content inside text field
			displayTpl: Ext.create('Ext.XTemplate',
				'<tpl for=".">',
					'{title}',
				'</tpl>'
			),
				cls: 'requestCombo-cls selectjob-combo',
				queryMode: 'local',
				displayField: 'title',
				editable :false,
				valueField: 'ddo_jobopening_id',
				// value: 'Select',
				emptyText: 'Select',
				bind:{
					store:'{allJobAllicationsGridViewStore}'
				},
				autoLoadOnValue: true
			}, {
				anchor: '100%',
                xtype: 'filefield',
                opType: 'upload',
				name: 'appResume',
				iconCls: 'upload-cls',
				reference: 'referralfileuploadref',
				buttonOnly: true,
				allowBlank:false,
				listeners: {
					change: 'buttonOnlyChange'
				},
				bind: {
					value: '{resumePath}'
				},
				buttonConfig: {
					cls: 'upload-btn',
					width: 180,
					iconCls: 'x-fa fa-upload',
					iconAlign: 'right',
					reference: 'excelfileuploadbtn',
					text: 'Choose File',
					name: 'uploadid',
					// id: 'uploadid'
					bind: {
						text: '{resumePath2}'
					}
				},
        		fieldLabel: "Upload Excel:"
				// cls: 'requestCombo-cls'
				// margin: '10 0 0 0'
	
		}],


	bbar: [{
		xtype: 'toolbar',
		width: '100%',
		margin: '0 0 30 0',
		dock: 'bottom',
		// fixed: true,
		items: [{
			xtype: 'tbfill'
		},
		{
			xtype: 'button',
			text: 'Upload',
			formBind:true,
			width: 150,
			cls: 'filter-submit-btn',
			listeners: {
				click: 'uploadExcelfile'
			}
		},
		{
			xtype: 'tbfill'
		}]
	}]


});