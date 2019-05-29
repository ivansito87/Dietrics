module.exports = function(sequelize, DataTypes) {

	var Profile = sequelize.define("Profile", {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: { isAlpha: true }
		},
		age: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: { isNumeric: true }
		},
		gender: {
			type: DataTypes.STRING,
			allowNull: false
        },
        height: {
            type: DataTypes.STRING,
            allowNull: false
        },
        weight: {
            type: DataTypes.INTEGER
        },
        isPregnant: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
	});
	return Profile;
};
