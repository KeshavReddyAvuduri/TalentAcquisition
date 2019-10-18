Ext.define('JobOpenings.view.alljobapplications.AllJobApplicationsGridView', {
    extend: 'Ext.container.Container',
    xtype: 'alljobapplicationsgridview',
    reference: 'alljobapplicationsgridviewref',
    requires: ['JobOpenings.view.alljobapplications.AllJobApplicationsController',
        'JobOpenings.view.alljobapplications.AllJobApplicationsToolbar'
    ],
    controller: 'alljobapplicationscontroller',
    viewModel: {
        type: 'alljobapplicationsviewmodel'
    },
    margin: '0 0 0 10',
    items: [{
        xtype: 'container',
        html: '<div class="jobtitle-cls">All Job Applications</div>'
    }, {
        xtype: 'alljobapplicationstoolbar'
    }, {
        xtype: 'grid',
        // height:420,
        maxHeight: 420,
        width: '98%',
        loadMask: true,
        margin: '0 0 10 10',
        cls: 'karmalist-cls',
        style: 'border:1px solid #efe8e8; background: black;',
        bind: {
            store: '{allJobAllicationsGridViewStore}'
        },
        columns: [{
                text: 'Candidate Name',
                flex: 0.4,
                dataIndex: 'appfirstname',
                cls: 'grid-cls'
            }, {
                text: 'Job Opening',
                flex: 0.5,
                dataIndex: 'title',
                cls: 'grid-cls'
            }, {
                text: 'Experience',
                flex: 0.3,
                dataIndex: 'minworkexperience',
                cls: 'grid-cls'
            },
            {
                text: 'Skills',
                flex: 0.4,
                dataIndex: 'skillnames',
                cls: 'grid-cls'
            },
            {
                text: 'Email',
                flex: 0.5,
                dataIndex: 'emailid',
                cls: 'grid-cls'
            }, {
                text: 'Mobile',
                flex: 0.4,
                dataIndex: 'mobile',
                cls: 'grid-cls'
            }, {
                text: 'Location',
                flex: 0.3,
                dataIndex: 'currentlocation',
                cls: 'grid-cls'
            }, {
                text: 'Recruiter',
                flex: 0.3,
                dataIndex: 'recruiter',
                cls: 'grid-cls'
            }
        ],
        listeners: {
            itemclick: 'onGridRowClick'

        }

    }]

});