module.exports = function(sequelize, DataTypes) {

	var Food = sequelize.define("Food", {
        name: {
			type: DataTypes.STRING,
			allowNull: false
			
        },
        calories:{
			type: DataTypes.FLOAT,
			defaultValue: 0	
        },
        caloriesFromFat:{
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        
		carbs: {
			type: DataTypes.FLOAT,
			defaultValue: 0	
        },
        dietary_Fiber: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        sugars: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        added_sugars:{
			type: DataTypes.FLOAT,
			defaultValue: 0
		},
		fat: {
			type: DataTypes.FLOAT,
			defaultValue: 0
		},
		saturated: {
			type: DataTypes.FLOAT,
            defaultValue: 0
            
        },
        polyunsaturated: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        monounsaturated: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        protein: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        sodium: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        potassium: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        cholesterol: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        vitamin_A: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        vitamin_C: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        vitamin_D: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        calcium: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        iron: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        }
    });
    
	return Food;
};
