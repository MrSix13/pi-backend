const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('videogame', {
    id:{
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull:false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description:{
      type: DataTypes.STRING,
      allowNull:false
    },
    launch_date:{
      type:DataTypes.STRING,
    },
    image:{
      type: DataTypes.STRING
    },
    rating:{
      type:DataTypes.INTEGER,
    },
    platforms:{
      type:DataTypes.ARRAY(DataTypes.STRING),
      allowNull:false
    },
    createdInDb:{
      type:DataTypes.BOOLEAN,
      defaultValue: true
    }
  },{
    timestamps:false
  });
};



/*- [ ] Videojuego con las siguientes propiedades:
  - ID: * No puede ser un ID de un videojuego ya existente en la API rawg
  - Nombre *
  - Descripción *
  - Fecha de lanzamiento
  - Rating
  - Plataformas *
- [ ] Genero con las siguientes propiedades:
  - ID
  - Nombre 
  */
