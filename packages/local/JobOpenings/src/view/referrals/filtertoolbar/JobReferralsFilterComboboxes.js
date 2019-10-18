Ext.define('JobOpenings.view.referrals.filtertoolbar.JobReferralsFilterComboboxes', {
	extend: 'Ext.form.Panel',
	xtype: 'jobreferralsfiltercomboboxes',
	requires: [
		'JobOpenings.store.filtertoolbar.JobOpeningsDateStore',
		'JobOpenings.store.form.LocationStore',
		'JobOpenings.view.referrals.filtertoolbar.JobReferralsFilterController',
		'JobOpenings.view.jobopeningrequest.filtertoolbar.FilterViewModel'
	],
	viewModel: 'filterviewmodel',
	controller: 'jobreferralsfiltercontroller',
	layout:'column',
	items: [{
		columnWidth: 0.5,
		items: [{
			layout: {
				type: "vbox"
			},
			items: [{
				xtype: 'combobox',
				reference: 'filterdate',
				name:'filterDateName',
				labelAlign: 'top',
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
				fieldLabel: 'Filter by Date',
				margin: '10 0 0 90',
				cls: 'requestCombo-cls',
				queryMode: 'local',
				displayField: 'name',
				valueField: 'name',
				value: 'All',
				editable :false,
				store: Ext.create('JobOpenings.store.filtertoolbar.JobOpeningsDateStore'),
				autoLoadOnValue: true,
				listeners: {
					select: 'onFilterDateSelect'
				}
			}, {
				xtype: 'combobox',
				labelAlign: 'top',
				name: 'filterdepartment',
				reference: 'deptcomboref',
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
				fieldLabel: 'Filter by Department',
				cls: 'requestCombo-cls',
				margin: '10 0 0 90',
				editable :false,
				queryMode: 'local',
				displayField: 'name',
				valueField: 'ddo_department_id',
				value: 'All',
				bind: {
					store: '{departmentStore}'
				},
				autoLoadOnValue: true
			}]
		}]
	},{
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
                editable :false,
                allowBlank: false,
                maxValue: new Date(),
                hidden: true
            }, {
				xtype: 'combobox',
				labelAlign: 'top',
				cls: 'requestCombo-cls',
				name: 'filterlocation',
				reference: 'filtercomboref',
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
				fieldLabel: 'Filter by Location',
				margin: '10 90 0 0',
				queryMode: 'local',
				displayField: 'name',
				editable :false,
				valueField: 'ddo_joblocation_id',
				value: 'All',
				autoLoadOnValue: true,
				listeners: {
					select: 'onLocationSelect'
				},
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
		}, {
			xtype: 'button',
			text: 'Apply',
			width: 150,
			cls: 'filter-submit-btn',
			listeners: {
				click: 'onApplyBtnClick'
			}
		}, {
			xtype: 'tbfill'
		}]
	}]
});