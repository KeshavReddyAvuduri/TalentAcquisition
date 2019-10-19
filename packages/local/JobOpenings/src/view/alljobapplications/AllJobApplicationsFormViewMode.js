Ext.define('JobOpenings.view.alljobapplications.AllJobApplicationsFormViewMode',{
	extend: 'Ext.form.Panel',
	alias: 'widget.alljobapplicationsformviewmode',
	cls: 'form-cls apply-form',
	defaults: {
		width: '50%',
		labelAlign: 'right',
		labelWidth: 180,
		padding: 5,
		labelStyle: 'font-size:16px;'
	},
	height:600,
	scrollable:true,
	reference: 'alljobApplicationFormViewModeRef',
	layout: {
		type: 'vbox',
		align: 'middle',
		pack: 'center'
	},
	title: 'Job Application',
	buttonAlign: 'center',
	items: [{
		xtype: 'textfield',
		name: 'fnameView',
		fieldLabel: 'First Name:',
		readOnly: true,
		afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>'
	}, {
		xtype: 'textfield',
		name: 'lnameView',
		readOnly: true,
		fieldLabel: 'Last Name:',
		afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>'
	}, {
		xtype: 'textfield',
		name: 'jobtitlenameView',
		readOnly: true,
		fieldLabel: 'Current Job Title:',
		afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>'
	}, {
		xtype: 'fieldcontainer',
		fieldLabel: 'Work Experience',
		cls: 'fieldcontainer-cls',
		layout: 'hbox',
		afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>',
		combineErrors: true,
		defaults: {
			padding: 10,
			msgTarget: 'side',
			flex: 1,
			labelWidth:50,
			anchor: '70%'
		},
		items: [{
			xtype: 'textfield',
			readOnly: true,
			fieldLabel: 'Years',
			name: 'yearsnameView'
		}, {
			xtype: 'textfield',
			readOnly: true,
			fieldLabel: 'Months',
			name: 'monthsnameView'
		}]
 
	}, {
        xtype: 'textfield',
        fieldLabel: 'Skills:',
        name: 'skillsnameView',
        border: 5,
        afterLabelTextTpl: '<span class="ta-mandatory-field-cls">*</span>',
        readOnly: true
    }, {
		xtype: 'textfield',
		name: 'locationnameView',
		readOnly: true,
		fieldLabel: 'Current Location:',
		afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>'
	}, {
        xtype: 'textfield',
        fieldLabel: 'Education:',
        name: 'educationnameView',
        readOnly: true,
        afterLabelTextTpl: '<span class="ta-mandatory-field-cls">*</span>'
    }, {
		xtype: 'textfield',
		name: 'univnameView',
		readOnly: true,
		fieldLabel: 'College / University:',
		afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>'
	}, {
		xtype: 'textfield',
		name: 'mobilenameView',
		fieldLabel: 'Mobile:',
		readOnly: true,
		afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>'
	}, {
		xtype: 'textfield',
		name: 'emailnameView',
		readOnly: true,
		fieldLabel: 'Email Address',
		afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>'
	}, {
		xtype: 'fieldcontainer',
		cls: 'fieldcontainer-cls',
		layout: 'hbox',
		defaults: {
			msgTarget: 'side',
			flex: 1,
			anchor: '65%',
			labelStyle: 'font-size:16px;'
		},
		items: [{
			xtype: 'textfield',
			name: 'hiringnameView',
			readOnly: true,
			labelWidth:110,
			margin: '0 10 0 68',
			fieldLabel: 'Hiring Source:',
			afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>'
		},{
			xtype: 'textfield',
			name:'portalnameView',
			reference:'portalref',
			readOnly: true,
			fieldLabel: 'Job Portal Name:',
			labelAlign: 'right',
			afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>'
		}]
	}, {
		xtype: 'fieldcontainer',
		cls: 'fieldcontainer-cls',
		layout: 'hbox',
		defaults: {
			msgTarget: 'side',
			flex: 1,
			anchor: '65%',
			labelStyle: 'font-size:16px;'
		},
		items: [{
			xtype: 'combobox',
			name: 'identificationType',
			emptyText: 'Select',
			emptyCls:'referrals-empty-text',
			labelWidth:110,
			labelAlign: 'right',
			margin: '0 10 0 68',			
			fieldLabel: 'Id Type:',
			readOnly: true,
			afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>'			
		},{
			xtype: 'textfield',
			name:'identificationNumber',
			emptyText: 'Select',
			fieldLabel: 'Id Number:',
			emptyCls:'referrals-empty-text',
			readOnly: true,
			labelAlign: 'right',
			maskRe: /^[A-Za-z0-9]*$/,			
			afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>'
		}]
	},{
		xtype: 'fieldcontainer',
		defaults: {
			width: '100%',
			labelAlign: 'right',
			labelWidth: 180,
			padding: 5,
			labelStyle: 'font-size:16px;'
		},
		items: [{
			xtype: 'textfield',
			anchor: '100%',
			name:'appResumeView',
			opType: 'upload',
			iconCls: 'upload-cls',
			afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>',
			fieldLabel: "Upload CV :",
			readOnly: true
		}]
	}]//,
	// bbar: {
	// 	cls: 'jobform-cls',
	// 	layout: {
	// 		type: 'hbox',
	// 		align: 'middle',
	// 		pack: 'center'
	// 	},
	// 	items: [{
	// 		xtype: 'button',
	// 		text: 'Save',
	// 		width: 200,
	// 		disabledCls:'disable-btn',
	// 		//formBind: true,
	// 		cls: 'jobapplication-margin',
	// 		disabled: true
	// 	}, {
	// 		xtype: 'button',
	// 		text: 'Cancel',
	// 		cls: ['require-btn','referral-click'],
	// 		disabled: true
	// 	}]
	// }

});