Ext.define('JobOpenings.model.jobopenings.JobOpenings', {
	extend: 'Ext.data.Model',

	fields: ['career_level', 'jobcode', 'numberofopenpositions', {
		name: 'effective_fromdate',
		convert: function(value, record) {
			value = (value) ? Ext.Date.format(new Date(value), 'd-m-Y') : value;
			return value;
		}
	}, {
		name: 'expiration_date',
		convert: function(value, record) {
			value = (value) ? Ext.Date.format(new Date(value), 'd-m-Y') : value;
			return value;
		}
	}]
});