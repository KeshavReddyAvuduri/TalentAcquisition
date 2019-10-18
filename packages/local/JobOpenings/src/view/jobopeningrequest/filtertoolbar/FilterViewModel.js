Ext.define('JobOpenings.view.jobopeningrequest.filtertoolbar.FilterViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.filterviewmodel',
    data: {
        locationName: '',
        ddo_jobopening_id:'',
        filtervalue:""
    },
    stores: {
        locationStore: {
            autoLoad: true,
            proxy: {
                type: 'ajax',
               url: Api.URL.joblocation.READ,
            //   url:'jobopeningrequest/getLocationData',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            }
        },
        
        departmentStore: {
            autoLoad: true,
            proxy: {
                type: 'ajax',
               url: Api.URL.jobdepartments.READ,
            //    url:'dashboard/getDepartmentNames',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            }
        },
        interviewrsStore: {
            autoLoad: true,
            proxy: {
                type: 'ajax',
               url: Api.URL.repoprtingstore.READ,
            //    url:'utility/getempbasiclist',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            }
        },
        skillsStore: {
            autoLoad: false,
            storeId: 'skillsstore',
            proxy: {
                type: 'ajax',
                //url: Api.URL.jobskills.READ,
                url:Api.URL.jobskills.READ,
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            }
        },
        jobOpeningDataViewStore: {
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: Api.URL.jobopenings.READ,
                // url:'jobopeningrequest',
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
        jobRecruiterStore: {
            autoLoad: false,
            proxy: {
                type: 'ajax',
                //url:Api.URL.jobOpeningRecruiters.READ,
                url: Api.URL.jobrecruiter.READ,
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            }
        },
        jobReferralsDataViewStore: {
            autoLoad: false,
            proxy: {
                type: 'ajax',
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
        ProjectsClientStore: {
            autoLoad: false,

    proxy: {
        type: 'ajax',
        url: Api.URL.projectsclientstore.READ,

        reader: {
            type: 'json',
            rootProperty: "data"
        }
    }
        },
    }
});
