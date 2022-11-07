const axios = require('axios');
const { Genres } = require('../db')

const getAllGenres = async(req,res)=>{
    try {
        const {data} = await axios.get('https://api.rawg.io/api/genres?key=151cc59a405c4874953e5f007d57c201')
        const apiGenres = await data.results.map(({id,name})=>{
            return{
                name
            }
        })
        apiGenres.map(({name})=>Genres.findOrCreate({
            where:{name:name}
        }))
        
        const allGenres = await Genres.findAll()
        res.status(200).json(allGenres)
        
   } catch (error) {
        res.status(400).json({message:error})
   }
}



module.exports = {
    getAllGenres
}