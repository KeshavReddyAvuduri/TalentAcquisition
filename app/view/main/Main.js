
Ext.define('JobsModule.view.main.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'mainviewport',

    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',

        'JobsModule.view.main.MainController',
        'JobsModule.view.main.MainModel',

        'JobOpenings.view.jobopeningrequest.JobOpeningsRequestView',
        'JobOpenings.view.jobapplications.JobApplications',
        'JobOpenings.view.interviewrequest.InterviewRequest',
        'JobOpenings.view.referrals.JobOpeningsReferralsView',
        'JobOpenings.view.applicationenquiry.ApplicationEnquiry',
        'JobOpenings.view.preferences.PreferencesView',
        'JobOpenings.view.alljobapplications.AllJobApplications',
        'JobsModule.store.Login'
    ],

    controller: 'main',
    viewModel: 'mainviewport',
    ui: 'navigation',

    tabBarHeaderPosition: 1,
    titleRotation: 0,
    tabRotation: 0,
    cls: 'main-viewport-color',
    header: {
        layout: {
            align: 'stretchmax'
        },
        title: {
            bind: {
                text: '{name}'
            },
            flex: 0
        },
        iconCls: 'fa-th-list'
    },

    tabBar: {
        flex: 1,
        layout: {
            align: 'stretch',
            overflowHandler: 'none'
        }
    },

    responsiveConfig: {
        tall: {
            headerPosition: 'top'
        },
        wide: {
            headerPosition: 'left'
        }
    },

    defaults: {
        bodyPadding: '10 20 20 20',
        tabConfig: {
            responsiveConfig: {
                wide: {
                    iconAlign: 'left',
                    textAlign: 'left'
                },
                tall: {
                    iconAlign: 'top',
                    textAlign: 'center',
                    width: 120
                }
            }
        }
    },
    listeners: {
        beforerender: 'checkForLogin',
        tabchange: 'onTabChange'
    },

    tbar: ['->', {
        docked: 'right',
        xtype: 'button',
        text: 'LogOut',
        width: 100,
        reference: 'logoutbtn',
        margin: '10 20 0 10',
        handler: 'onLogoutClick'
    }],

    items: [{
        title: 'Preferences',
        itemId: 'preferences',
        iconCls: 'x-fa fa-user',
        items: [{
            xtype: 'preferencesview'
        }]
    }, {
        title: 'Job Openings',
        itemId: 'job_openings',
        iconCls: 'x-fa fa-user',
        items: [{
            xtype: 'jobopeningsrequestview'
        }]
    }, {
        title: 'Job Applications',
        itemId: 'job_application',
        iconCls: 'x-fa fa-user',
        items: [{
            xtype: 'jobapplications'
        }]
    }, {
        title: 'All Job Applications',
        itemId: 'all_job_applications',
        iconCls: 'x-fa fa-user',

        items: [{
            xtype: 'alljobapplications'
        }]
    }, {
        title: 'Referrals',
        itemId: 'referrals',
        iconCls: 'x-fa fa-user',
        items: [{
            xtype: 'jobopeningsreferralsview'
        }]
    }, {
        title: 'Interview Request',
        itemId: 'intreview_request',
        iconCls: 'x-fa fa-user',
        items: [{
            xtype: 'interviewrequest'
        }]
    }, {
        title: 'Application Enquiry',
        itemId: 'application_enquiry',
        iconCls: 'x-fa fa-user',
        items: [{
            xtype: 'applicationenquiry'
        }]
    }]
});
