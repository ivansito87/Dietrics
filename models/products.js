module.exports = function(sequelize, DataTypes) {

	var Food = sequelize.define("Food", {
        name: {
			type: DataTypes.STRING,
			allowNull: false,
			
        },
		Carbs: {
			type: DataTypes.INTEGER,
			defaultValue: 0
			
        },
        Dietary_Fiber: {
            type: DataTypes.INTEGER,
            defaultValue: 0
          
        },
        SugarS: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
		Fat: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			validate: { isNumeric: true }
		},
		Saturated: {
			type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                isIn:[["male", "female"]]
            } 
        },
        Polyunsaturated: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        Monounsaturated: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        Protein: {
            type: DataTypes.INTEGER,
            defaultValue: false
        },
        Sodium: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        Potassium: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        Cholesterol: {
            type: DataTypes.INTEGER,
            defaultValue: false
        },
        Vitamin_A: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        Vitamin_C: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        Calcium: {
            type: DataTypes.INTEGER,
            defaultValue: false
        },
        Iron: {
            type: DataTypes.INTEGER,
            defaultValue: false
        }
    });
    
	return Food;
};
