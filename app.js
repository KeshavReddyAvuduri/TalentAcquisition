/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'JobsModule.Application',

    name: 'JobsModule',

    requires: [
        // This will automatically load all classes in the JobsModule namespace
        // so that application classes do not need to require each other.
        'JobsModule.util.Api',
        'JobsModule.*'
    ],

    // The name of the initial view to create.
    mainView: 'JobsModule.view.main.Main'
});
