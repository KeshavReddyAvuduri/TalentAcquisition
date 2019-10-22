/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('JobsModule.Application', {
    extend: 'Ext.app.Application',

    name: 'JobsModule',

    quickTips: false,
    platformConfig: {
        desktop: {
            quickTips: true
        }
    },
    requires : [
        'JobOpenings.overrides.data.Connection'
    ],
    stores:[
        'JobsModule.store.jobopenings.JobopeningsActions',
        'JobsModule.store.Login',
        'JobsModule.store.jobopenings.JobRecruiter',
    ],
    onAppUpdate: function () {
     
    }
});
