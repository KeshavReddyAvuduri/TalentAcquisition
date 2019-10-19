Ext.define('JobOpenings.view.jobapplications.filtertoolbar.JobApplicationsAppliedFilterView', {
    extend: 'Ext.panel.Panel',
    xtype: 'jobapplicationsappliedfilterview',
    requires: [
        'JobOpenings.store.filtertoolbar.FilterbyStatus'
    ],
    reference: 'appliedfilterview',
    viewModel: {
        type: 'jobapplicationsviewmodel'
    },
    layout: {
        type: 'hbox',
        width: '100%'
    },
    cls: 'filtertoolbar-cls',
    dockedItems: [{
        xtype: 'toolbar',
        cls: 'tooltip-cls',
        dock: 'top',
        items: [{
            xtype: 'button',
            scale: 'medium',
            iconCls: 'x-fa fa-arrow-left',
            cls: 'jobback-btn-cls',
            style: {
                border: 0
            },
            listeners: {
                click: 'onBackClick'
            }
        }, {
            xtype: 'label',
            html: 'Back',
            cls: 'backlabel-cls'
        }, {
            xtype: 'label',
            html: 'Intern UI Development/Applications',
            cls: 'titlelabel-cls',
            reference: 'title_applicationViewRef',
            margin: 20
        }]
    }],
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
        reference: 'jobsearchref_job_applied',
        enableKeyEvents: true,
        emptyText: 'Search',
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
                click: 'onCloseFilterClkapplied'
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
                click: 'onCloseFilterClkapplied'
            }
        }],
        hidden: true
    }, {
        items: [{
            xtype: 'button',
            reference: 'departmentFilterBtn',
            cls: "filterBtnsCls"
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
                    click: 'onCloseFilterClkapplied'
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
                    click: 'onCloseFilterClkapplied'
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
                    click: 'onCloseFilterClkapplied'
                }
            }],
            hidden: true
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'combobox',
            height: 25,
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
            reference: 'jobappliedstatuscomboref',
            queryMode: 'local',
            displayField: 'name',
            editable: false,
            valueField: 'ddo_jobapplicationstatus_id',
            emptyText: 'All',
            // cls:  ['requestCombo-cls','requestCombo-clss'],
            cls: 'requestCombo-cls',
            store: Ext.create('JobOpenings.store.filtertoolbar.FilterbyApplicationStatus',{autoLoad:true}),
            autoLoadOnValue: true,
            xtype: 'button',
            reference: 'departmentFilterBtnCancel',
            cls: "filterBtnsClsCancel",
            text: 'x',
            listeners: {
                click: 'onCloseFilterClkapplied'
            }
        }],
        hidden: true
    }, {
        xtype: 'tbfill'
    }, {
        xtype: 'combobox',
        height: 25,
        width:289,
        fieldLabel: 'Status',
        reference: 'jobappliedstatuscomboref',
        queryMode: 'local',
        displayField: 'name',
        editable: false,
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
        valueField: 'ddo_jobapplicationstatus_id',
        emptyText: 'All',
        // cls:  ['requestCombo-cls','requestCombo-clss'],
        cls: 'requestCombo-cls',
        store: Ext.create('JobOpenings.store.filtertoolbar.FilterbyApplicationStatus',{autoLoad:true}),
        autoLoadOnValue: true,
        listeners: {
            select: 'onStatusSelectionFilter'
        }
    }, {
        xtype: 'button',
        text: 'New Application',
        height: 35,
        textAlign: 'center',
        cls: 'create-new-btn-cls',
        // bind: {
        //     hidden: '{showJobAppCreateBtn}' //defind in MainView model
        // },
        listeners: {
            click: function (btn) {/* on new application create selected*/
                var recTitle = window.sessionStorage.newApplicationHead;
                if (recTitle.length > 52) {
                    recTitle = recTitle.substring(0, 49) + "...";
                }
                Ext.ComponentQuery.query('[reference = title_applicationCreationRef]')[0].setHtml(recTitle + '/ ' + 'Add Application');
                Ext.ComponentQuery.query('[reference = jobapplicationreference]')[0].getLayout().setActiveItem("jobapply");

                var btnRef = Ext.ComponentQuery.query('[reference = uploadbuttonref]')[0],
                    fileuploadField = Ext.ComponentQuery.query('[reference = fileuploadref]')[0],
                    uploadHiddenLabel = Ext.ComponentQuery.query('[reference = uploadlabelref]')[0],
                    uploadHiddenBtn = Ext.ComponentQuery.query('[reference = uploadhiddenbtnref]')[0];
                
                               
                uploadHiddenBtn.hide();
                uploadHiddenLabel.hide();
                fileuploadField.show();
                btnRef.setText("Choose File");
                btnRef.setIconCls("x-fa fa-upload");

                Ext.ComponentQuery.query('[reference = applyForm]')[0].getForm().reset();
                window.sessionStorage.ddo_jobapplication = undefined;
                window.sessionStorage.job_app_form = '0';
            }
        }
    }, {
        xtype: 'tbspacer',
        width: 19
    }]
});