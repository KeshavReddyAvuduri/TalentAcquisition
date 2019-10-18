Ext.define('JobOpenings.view.jobapplications.filtertoolbar.JobApplicationsAppliedFilterComboboxes', {
	extend: 'Ext.form.Panel',
	xtype: 'jobapplicationsappliedfiltercomboboxes',
	requires: [
		'JobOpenings.store.filtertoolbar.JobOpeningsDateStore',
		'JobOpenings.store.form.LocationStore',
		'JobOpenings.view.jobapplications.filtertoolbar.JobApplicationsAppliedFilterController',
		'JobOpenings.view.jobopeningrequest.filtertoolbar.FilterViewModel'
	],
	viewModel: 'filterviewmodel',
	controller: 'jobapplicationsappliedfiltercontroller',
	reference:'jaFiltersForm',
	layout: 'column',
	items: [{
		//xtype: 'toolbar',
		columnWidth: 0.5,
		items: [{
			layout: {
				type: "vbox"
			},
			items: [{
				xtype: 'combobox',
				reference: 'filterdate',
				name: 'filterDateName',
				labelAlign: 'top',
				fieldLabel: 'Filter by Date',
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
				margin: '10 0 0 90',
				cls: 'requestCombo-cls',
				queryMode: 'local',
				displayField: 'name',
				valueField: 'name',
				value: 'All',
				editable: false,
				store: Ext.create('JobOpenings.store.filtertoolbar.JobOpeningsDateStore'),
				autoLoadOnValue: true,
				listeners: {
					select: 'onFilterDateSelect'
				}
			}, {

				// xtype: 'combobox',
				// labelAlign: 'top',
				// name: 'filterdepartment',
				// reference: 'deptcomboref',
				// fieldLabel: 'Filter by Department',
				// tpl: Ext.create('Ext.XTemplate',
				// 	'<ul class="x-list-plain"><tpl for=".">',
				// 	'<li role="option" class="x-boundlist-item" style="text-align:center;">{name}</li>',
				// 	'</tpl></ul>'
				// ),
				// // template for the content inside text field
				// displayTpl: Ext.create('Ext.XTemplate',
				// 	'<tpl for=".">',
				// 	'{name}',
				// 	'</tpl>'
				// ),
				// cls: 'requestCombo-cls',
				// margin: '10 0 0 90',
				// queryMode: 'local',
				// displayField: 'name',
				// editable: false,
				// valueField: 'ddo_department_id',
				// value: 'All',
				// bind: {
				// 	store: '{departmentStore}'
				// },
				// //store: Ext.create('JobOpenings.store.form.DepartmentStore'),
				// autoLoadOnValue: true
				items: [{
					xtype: 'fieldcontainer',
					fieldLabel: 'Filter by Experience',
					cls: 'fieldcontainer-cls',
					//allowBlank: false,
					labelWidth: 100,
					//width:500,
					layout: 'hbox',
					//afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>',
					msgTarget: 'side',
					labelAlign: 'top',
					//labelWidth: 178,
					margin: '10 0 0 90',
					labelStyle: 'text-align:right;',
					items: [{
						xtype: 'numberfield',
						emptyText: 'Min',
						cls:'requestCombo-cls',
						emptyCls:'referrals-empty-text',
						reference: 'fminref',
						name: 'minworkexperience',
						minValue: 0,
						width:65,
						enableKeyEvents: true,
						//allowBlank: false,
						mouseWheelEnabled: false,
						listeners: {
							blur: 'onMinValueSelect'
						}
					}, {
						xtype: 'label',
						text: 'To',
						margin: '10 10'
	
					}, {
						xtype: 'numberfield',
						emptyText: 'Max',
						emptyCls:'referrals-empty-text',
						cls:'requestCombo-cls',
						allowBlank: false,
						mouseWheelEnabled: false,
						reference: 'fmaxref',
						minValue: 0,
						enableKeyEvents: true,
						name: 'maxworkexperience',
						width: 65,
						listeners: {
							blur: 'onMaxValueSelect'
						}
					}]
				}]
			}]
		}]
	}, {
		columnWidth: 0.5,
		items: [{
			layout: {
				type: "vbox"
			},
			items: [{
				fieldLabel: 'Custom Date',
				labelAlign: 'top',
				xtype: 'datefield',
				cls: 'requestCombo-cls',
				name: 'filterCustomDate',
				reference: 'customDateRef',
				margin: '10 90 0 0',
				editable: false,
				allowBlank: false,
				maxValue: new Date(),
				hidden: true
			}, {
				xtype: 'combobox',
				labelAlign: 'top',
				cls: 'requestCombo-cls',
				name: 'filterlocation',
				reference: 'filtercomboref',
				fieldLabel: 'Filter by Location',
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
				margin: '10 90 0 0',
				queryMode: 'local',
				displayField: 'name',
				valueField: 'ddo_joblocation_id',
				value: 'All',
				editable: false,
				autoLoadOnValue: true,
				bind: {
					store: '{locationStore}'
				}
			}]
		}]
	}],

	dockedItems: [{
		xtype: 'toolbar',
		width: '100%',
		margin: '0 0 30 0',
		dock: 'bottom',
		items: [{
				xtype: 'tbfill'
			},
			{
				xtype: 'button',
				text: 'Apply',
				width: 150,
				cls: 'filter-submit-btn',
				listeners: {
					click: 'onApplyBtnClick'
				}
			},
			{
				xtype: 'tbfill'
			}
		]
	}]


});