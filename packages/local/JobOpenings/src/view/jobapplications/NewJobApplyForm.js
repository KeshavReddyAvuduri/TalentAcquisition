Ext.define('JobOpenings.view.jobapplications.NewJobApplyForm',{
	extend: 'Ext.form.Panel',
	alias: 'widget.newjobapplyform',
	cls: 'form-cls apply-form',
	defaults: {
		width: '50%',
		labelAlign: 'right',
		labelWidth: 180,
		padding: 5,
		labelStyle: 'font-size:16px;'
	},
	reference: 'applyForm',
	layout: {
		type: 'vbox',
		align: 'middle',
		pack: 'center'
	},
	title: 'Job Application',
	buttonAlign: 'center',
	items: [{
		xtype: 'textfield',
		name: 'fname',
		required: true,
		fieldLabel: 'First Name:',
		emptyCls:'referrals-empty-text',
		maskRe: /^[A-Za-z]*$/,
		emptyText: 'Name',
		allowBlank: false, // requires a non-empty value
		afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>'
	}, {
		xtype: 'textfield',
		name: 'lname',
		required: true,
		maskRe: /^[A-Za-z]*$/,
		fieldLabel: 'Last Name:',
		emptyCls:'referrals-empty-text',
		emptyText: 'Last Name',
		allowBlank: false, // requires a non-empty value,
		afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>'
	}, {
		xtype: 'textfield',
		name: 'jobtitlename',
		required: true,
		fieldLabel: 'Current Job Title:',
		emptyCls:'referrals-empty-text',
		emptyText: 'Write Job Title Eg: Technical Lead',
		allowBlank: false, // requires a non-empty value
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
			xtype: 'numberfield',
			emptyText: '0',
			emptyCls:'referrals-empty-text',
			allowBlank: false,
			minValue:0,
			required: true,
			fieldLabel: 'Years',
			name: 'yearsname'
		}, {
			xtype: 'numberfield',
			emptyText: '0',
			emptyCls:'referrals-empty-text',
			minValue:0,
			maxValue:12,
			allowBlank: false,
			required: true,
			fieldLabel: 'Months',
			name: 'monthsname'
		}]
 
	}, {
        xtype: 'tagfield',
        fieldLabel: 'Skills:',
		name: 'skillsname',
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
		emptyText: 'Use Words Eg : Angular JS',
		emptyCls:'referrals-empty-text1',
		hideTrigger: true,
        store: Ext.create('JobOpenings.store.filtertoolbar.JobSkillsTypeStore',{autoLoad:true}),
        displayField: 'name',
        valueField: 'ddo_skills_id',
        queryMode: 'local',
        forceSelection: false,
        maskRe: /^[A-Za-z0-9]*$/,
        autoShow: true,
        filterPickList: true,
        blankText: 'This field is required',
        border: 5,
		allowBlank: false,
		collapseOnSelect:true,
		clearFilterOnBlur:false,
        afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>',
        listeners: {
            render: 'onSkillRender',
            select: function(combo, record, eOpts) {
				combo.inputEl.dom.value = '';
				combo.lastMutatedValue ='';
		   }
        },
        autoLoadOnValue: true
    }, {
		xtype: 'textfield',
		name: 'locationname',
		required: true,
		maskRe: /^[A-Za-z]*$/,
		fieldLabel: 'Current Location:',
		emptyText: 'Eg. Mumbai',
		emptyCls:'referrals-empty-text',
		allowBlank: false, // requires a non-empty value
		afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>'
	}, {
        xtype: 'combo',
		fieldLabel: 'Education:',
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
        name: 'educationname',
        emptyText: 'Highest Education:',
        emptyCls:'referrals-empty-text',
        store: Ext.create('JobOpenings.store.filtertoolbar.EducationStore',{autoLoad:true}),
        displayField: 'name',
        valueField: 'ddo_jobeducation_id',
        queryMode: 'local',
        blankText: 'This field is required',
        allowBlank: false,
        afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>',
        editable: false,
        autoLoadOnValue: true
    }, {
		xtype: 'textfield',
		name: 'univname',
		maskRe: /^[A-Za-z0-9]*$/,
		emptyText: 'Eg: Mahatma Gandhi Institute of Technology',
		emptyCls:'referrals-empty-text',
		fieldLabel: 'College / University:',
		required: true,
		allowBlank: false, // requires a non-empty value
		afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>'
	}, {
		xtype: 'textfield',
		name: 'mobilename',
		emptyText: 'Mobile',
		emptyCls:'referrals-empty-text',
		maskRe: /^[0-9]*$/,
		fieldLabel: 'Mobile:',
		required: true,
		minLength:10,
		maxLength: 10,
		enforceMaxLength: true,
		enableKeyEvents:true,
		allowBlank: false, // requires a non-empty value
		afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>',
		listeners:{
			focusleave:'onMobileNumEnter'
		}
	}, {
		xtype: 'textfield',
		name: 'emailname',
		fieldLabel: 'Email ID',
		emptyCls:'referrals-empty-text',
		emptyText: 'Email',
		required: true,
		allowBlank: false,
		vtype: 'email',
		vtypeText:"Enter valid email",
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
			xtype: 'combobox',
			name: 'hiringname',
			emptyText: 'Select',
			emptyCls:'referrals-empty-text',
			labelWidth:110,
			margin: '0 10 0 68',
			required: true,
			allowBlank: false,
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
			fieldLabel: 'Hiring Source:',
			queryMode: 'local',
			displayField: "name",
			editable: false,
			valueField: "ddo_jobhiringsource_id",
			afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>',
			store: Ext.create("JobOpenings.store.filtertoolbar.HiringSourceCombo",{autoLoad:true}),
			autoLoadOnValue: true,
			listeners: {
				select: "onHiringSourceSelection"
			}
		},{
			xtype: 'textfield',
			name:'portalname',
			emptyText: 'Select',
			fieldLabel: 'Job Portal Name:',
			emptyCls:'referrals-empty-text',
			labelAlign: 'right',
			hidden: true,
			maskRe: /^[A-Za-z0-9]*$/
			//required: true,
			//allowBlank: false,
			//afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>'
		}]
	},
	// {
	// 	xtype: 'fieldcontainer',
	// 	cls: 'fieldcontainer-cls',
	// 	layout: 'hbox',
	// 	defaults: {
	// 		msgTarget: 'side',
	// 		flex: 1,
	// 		anchor: '65%',
	// 		labelStyle: 'font-size:16px;'
	// 	},
	// 	items: [{
	// 		xtype: 'combobox',
	// 		name: 'identificationType',
	// 		emptyText: 'Select',
	// 		emptyCls:'referrals-empty-text',
	// 		labelWidth:110,
	// 		labelAlign: 'right',
	// 		margin: '0 10 0 68',
	// 		required: true,
	// 		allowBlank: false,
	// 		tpl: Ext.create('Ext.XTemplate',
	// 			'<ul class="x-list-plain"><tpl for=".">',
	// 				'<li role="option" class="x-boundlist-item" style="text-align:center;">{id_type}</li>',
	// 			'</tpl></ul>'
	// 		),
	// 		// template for the content inside text field
	// 		displayTpl: Ext.create('Ext.XTemplate',
	// 			'<tpl for=".">',
	// 				'{id_type}',
	// 			'</tpl>'
	// 		),
	// 		fieldLabel: 'Id Type:',
	// 		queryMode: 'local',
	// 		displayField: "id_type",
	// 		editable: false,
	// 		valueField: "ddo_jobidentificationtype_id",
	// 		afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>',
	// 		store: Ext.create("JobOpenings.store.filtertoolbar.IdTypeCombo"),
	// 		autoLoadOnValue: true,
	// 		// listeners: {
	// 		// 	select: "onHiringSourceSelection"
	// 		// }
	// 	},{
	// 		xtype: 'textfield',
	// 		name:'identificationNumber',
	// 		emptyText: 'Select',
	// 		fieldLabel: 'Id Number:',
	// 		emptyCls:'referrals-empty-text',
	// 		labelAlign: 'right',
	// 		maskRe: /^[A-Za-z0-9]*$/,
	// 		required: true,
	// 		allowBlank: false,
	// 		afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>'
	// 	}]
	// },
	 {
		// xtype: 'fieldcontainer',
		// defaults: {
		// 	width: '60%',
		// 	labelAlign: 'right',
		// 	labelWidth: 180,
		// 	padding: 5,
		// 	labelStyle: 'font-size:16px;'
		// },
		// items: [{
			xtype: 'fileuploadfield',
			anchor: '100%',
			name:'appResume',
			opType: 'upload',
			iconCls: 'upload-cls',
			reference:'fileuploadref',
			buttonOnly: true,			
			required: true,
			allowBlank: false,
			afterLabelTextTpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>',
			bind:{
				value:'{resumePath}'
			},
			listeners: {
				change: 'buttonOnlyChange'
			},
			//buttonText:'ccccc',

			buttonConfig: {
				cls: 'upload-btn',
				width: "100%",
				iconCls: 'x-fa fa-upload',
				iconAlign: 'right',
				name: 'jobapplicationformid',
				reference:'uploadbuttonref',				
				//text: 'fffff',
				//id:'jobapplicationformid',
				bind:{
					text:'{resumePath2}'
				}
			},
			fieldLabel: "Upload CV:"
		// }]
	},{
		xtype:'fieldcontainer',
		items:[{
			xtype:'label',
			text:'Upload CV:',
			reference:'uploadlabelref',
			hidden:true,
			cls:'uploadhiddenlabel-cls',
			tpl: '<sup><span class="ta-mandatory-field-cls">*</span></sup>'
		},{
			xtype:'button',
			width:250,
			cls:'uploadeditbtn-cls',
			name:'uploadResumeHiddenBtn',
			reference:'uploadhiddenbtnref',
			iconCls: 'x-fa fa-times',
			iconAlign:'right',
			hidden:true,
			//text :'File',
			bind:{
				//hidden:'{uploadBtnForEditShow}',
				text:'{resumePath2}'
			},
			listeners: {
				btnIconEl: {
					click: function(btn) {
						var filefieldref = Ext.ComponentQuery.query('[reference = fileuploadref]')[0],
							uploadBtnLabel = Ext.ComponentQuery.query('[reference = uploadlabelref]')[0],
							uploadHiddenBtn = Ext.ComponentQuery.query('[reference = uploadhiddenbtnref]')[0],
							uploadButton = Ext.ComponentQuery.query('[reference = uploadbuttonref]')[0];
							//filefieldref.show();
							uploadButton.setText('Choose File');
							uploadButton.setIconCls('x-fa fa-upload');						
							uploadHiddenBtn.hide();
							uploadBtnLabel.hide();
							filefieldref.show();
							filefieldref.fileInputEl.dom.value = "";
							filefieldref.value ="";
							filefieldref.rawValue = "";
					}
				}
			}
		}]
	}],
	bbar: {
		cls: 'jobform-cls',
		layout: {
			type: 'hbox',
			align: 'middle',
			pack: 'center'
		},
		items: [{
			xtype: 'button',
			text: 'Save',
			width: 200,
			disabledCls:'disable-btn',
			formBind: true,
			cls: 'jobapplication-margin',
			listeners: {
				click: "onSaveFunc"
			}
		}, {
			xtype: 'button',
			text: 'Cancel',
			cls: ['require-btn','referral-click'],
			handler: 'onCancelBtnClick'
		}]
	}

});