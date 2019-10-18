Ext.define('JobOpenings.view.alljobapplications.AllJobApplicationsViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.alljobapplicationsviewmodel',

    reference: 'alljobapplicationsref',//'jobappvmref',
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
        allJobAllicationsGridViewStore:{
            storeId:'allJobAllicationsGridViewStore',
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
                }
            }
        
    }
});
