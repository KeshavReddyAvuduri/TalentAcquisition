Ext.define('JobOpenings.view.jobapplications.JobApplicationsViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.jobapplicationsviewmodel',

    reference: 'jobappvmref',
    data: {
       // cancelReschedulebtnsHide: true,
        viewHide: false,
        initialInterviewShow: false,
        //addschviewHide: true,
        cancelformshow:true,
        awaitingfeedviewHide:true,
        addSch:false,
        feedbackData:'',
        resumePath :'',
        resumePath2:"Choose File",
        filtervalue:"",
        saveBtnDisable:true,
        uploadBtnForEditShow:true
    },
    stores: {
        jobapplicantStore: {
            autoLoad: false,
            proxy: {
                type: 'ajax',
                //  url: Api.URL.joblocation.READ,
                url: 'resources/data/jobapplications/jobapplicantdetails.json',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            }
        },
        jobApplicationStatus: {
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url:Api.URL.jobAppinterViewAppStatus.READ,
              //  url: 'resources/data/jobapplications/jobapplicationstatus.json',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            }
        },
        interviewrsStore: {
            autoLoad: false,
            proxy: {
                type: 'ajax',
                // url: Api.URL.jobinterviewrs.READ,
               // url: 'utility/getempbasiclist',
               url:Api.URL.jobappinterview.getInterviewPanelMembers,
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            }
        },
        interviewFeedBackStore: {
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url:Api.URL.jobappinterview.READ,
                //url:'resources/data/jobapplications/interviewdetails.json',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            }
        },
        interviewTypeStore:{
            storeId:'interviewtype',
            autoLoad: false,
            proxy: {
                type: 'ajax',
                extraParams:{
                    tablename:'ddo_interviewtype'
                },
                api: {
                    read    : Api.URL.preferenceData.READ//,
                    // create  : '/preference/preferencedata',
                    // update  : '/preference/preferencedata',
                    // destroy : '/preference/preferencedata'
                },
                // url:'resources/data/jobapplications/interviewtype.json',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            }
        },
        interviewModeStore:{
            autoLoad:true,
            storeId:'interviewmode',
            proxy:{
                type:'ajax',
                extraParams:{
                    tablename:'ddo_interviewmode'
                },
                api:{
                    read:Api.URL.preferenceData.READ
                },
                reader:{
                    type:'json',
                    rootProperty:'data'
                }
            }
        },
        jobapplicationsappliedstore:{
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url:Api.URL.jobapplication.READ,
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            },
            sorters: [{
                property: "jobupdateddate",
                direction: "DESC"
            }]
        },
        JobopeningsActions:{
            autoLoad: true,

            proxy: {
                type: 'ajax',
                url:'resources/data/jobopenings/actionslist.json',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            }
        },
        jobApplicationsDataViewStore: {
            autoLoad: true,
            proxy: {
                type: 'ajax',
                // url:'jobopeningrequest',
                url:Api.URL.jobopenings.READ,
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            },
            sorters: [{
                property: "jobupdateddate",
                direction: "DESC"
            }],
            filters: [{
                property: 'ddo_jobopeningstatus_id',
                value: 1
            }]
        },
        allJobAllicationsGridViewStore:{
            autoLoad:true,
            proxy:{
                type:'ajax',
                api:{
                    read:Api.URL.jobapplication.READ
                },
                    reader:{
                        type:'json',
                        rootProperty:'data'
                    }
                }//,
                // sorters:[{
                //     property:'title',
                //     direction:'DESC'
                // }],
                // filters:[{
                //     property:'recruiter',
                //     value:/ea/

                // }]
            }
        
    }
});
