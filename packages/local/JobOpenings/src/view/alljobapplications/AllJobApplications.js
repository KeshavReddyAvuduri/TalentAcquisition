Ext.define('JobOpenings.view.alljobapplications.AllJobApplications', {
    extend: 'Ext.container.Container',
    xtype: 'alljobapplications',
    requires: [
        'JobOpenings.view.alljobapplications.AllJobApplicationsGridView',
        'JobOpenings.view.alljobapplications.AllJobApplicationViewMode'
    ],
    layout: {
        type: 'card',
        activeItem: 0
    },
    margin: '10 0 0 10',
    reference: 'alljobapplicationreference',
    items: [{
        xtype:'alljobapplicationsgridview',
        id: 'alljobapplicationsId'
    },{
        xtype: 'alljobapplicationviewmode',
        id: 'alljobapplicationviewmodeId'
    }]
});