Ext.define('JobOpenings.view.interviewrequest.InterviewRequestModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.interviewrequestmodel',
    data: {
        locationName: ''
    },
    stores: {
        interviewRequestListStore: {
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: Api.URL.jobappinterview.getinterviewrequests,
                method: 'GET',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            },
            sorters: [{
                property: "updated",
                direction: "DESC"
            }]
        }, 
        interviewReqFeedBackStore: {
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: Api.URL.jobappinterview.READ,
                method: 'GET',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            }
        }
    }
});
