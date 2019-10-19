Ext.define('JobOpenings.view.jobopeningrequest.filtertoolbar.JobOpeningsFilterView', {
	extend: 'Ext.panel.Panel',
	xtype: 'jobopeningsfilterview',
	requires: [
		'JobOpenings.store.filtertoolbar.FilterbyStatus',
		'JobOpenings.view.jobopeningrequest.filtertoolbar.FilterViewModel'

	],
	viewModel: {
		type: 'filterviewmodel'
	},
	reference: 'filterview',
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
			height: 6,
			padding: '-8 11 14 12'
		}, {

			xtype: 'textfield',
			width: '30%',
			reference: 'jobsearchref',
			emptyText:'Search',
			enableKeyEvents: true,
			cls: 'karmascore-search-field searchFields job-search-field',
			listeners: {
				keyup: 'onKeyUpJobSearch'
			}

		}, {
			xtype: 'button',
			cls: 'filter-btncls',
			listeners: {
				click: 'hideCombobox'
			}
		}, {
			items: [{
				xtype: 'button',
			    reference: 'dateFilterBtn',
			    cls: "filterBtnsCls"
			}, {
				xtype: 'button',
			    reference: 'dateFilterBtnCancel',
			    cls: "filterBtnsClsCancel",
			    text: 'x',
			    listeners: {
			    	click: 'onCloseFilterClk'
			    }
			}],
			hidden: true
		}, {
		    items: [{
				xtype: 'button',
			    reference: 'locationFilterBtn',
			    cls: "filterBtnsCls"
			}, {
				xtype: 'button',
			    reference: 'locationFilterBtnCancel',
			    cls: "filterBtnsClsCancel",
			    text: 'x',
			    listeners: {
			    	click: 'onCloseFilterClk'
			    }
			}],
			hidden: true
		}, {
		    items: [{
				xtype: 'button',
			    reference: 'departmentFilterBtn',
			    cls: "filterBtnsCls"
			}, {
				xtype: 'button',
			    reference: 'departmentFilterBtnCancel',
			    cls: "filterBtnsClsCancel",
			    text: 'x',
			    listeners: {
			    	click: 'onCloseFilterClk'
			    }
			}],
			hidden: true
		}, {
			xtype: 'tbfill'
		}, {
			xtype: 'combobox',
			fieldLabel: 'Status',
			tpl: Ext.create('Ext.XTemplate',
				'<ul class="x-list-plain"><tpl for=".">',
					'<li role="option" class="x-boundlist-item" style="text-align:center;">{name}</li>',
				'</tpl></ul>'
			),
			// template for the content inside text field
			displayTpl: Ext.create('Ext.XTemplate',
				'<tpl for=".">',
					'{name}',
				'</tpl>'
			),
			reference: 'jobstatuscomboref',
			queryMode: 'local',
			displayField: 'name',
			valueField: 'id',
			emptyText: 'All',
			editable:false,
			cls: 'requestCombo-cls',
			store: Ext.create('JobOpenings.store.filtertoolbar.FilterbyStatus',{autoLoad:true}),
			autoLoadOnValue: true,
			listeners: {
				select: 'onStatusSelectionFilter'
			}
		}, {
			xtype: 'button',
			text: 'Create New',
			width: 100,
			height: 35,
			textAlign: 'center',
			cls: 'create-new-btn-cls',
			listeners: {
				click: 'onCreateNewJob'
			}
		
		},{
        	xtype:'tbspacer',
        	width: 19
       }]
});
