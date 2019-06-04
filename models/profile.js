module.exports = function(sequelize, DataTypes) {

	var Profile = sequelize.define("Profile", {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
          
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
		age: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: { isNumeric: true }
		},
		gender: {
			type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn:[["male", "female"]]
            } 
        },
        height: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        weight: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        isPregnant: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });
    
    
	return Profile;
};
