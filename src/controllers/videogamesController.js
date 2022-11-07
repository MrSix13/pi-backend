require('dotenv').config();
const axios = require('axios');
const { Videogame, Genres } = require('../db');
const API_URL = 'https://api.rawg.io/api/games';
const API_KEY = process.env.API_KEY

const getApiInfo = async () =>{
    let pageOne = []
    let pageTwo = []
    let pageThree = []
    try {
        pageOne = await axios.get(`${API_URL}?key=${API_KEY}&page_size=40`)
        let uri = pageOne.data.next
        pageOne = [...pageOne.data.results]
        
        pageTwo = await axios.get(uri)
        uri = pageTwo.data.next
        pageTwo = [...pageTwo.data.results]

        pageThree = await axios.get(uri)
        pageThree = [...pageThree.data.results]
        
        const apiInfo = [...pageOne, ...pageTwo, ...pageThree]
        
        const allVideogames = apiInfo.map(({id,name,released,rating,background_image: image, genres, platforms})=>{
            //console.log(platforms.map(({platform})=>platform.name))
            return{
                id,
                name,
                released,
                rating,
                image,
                platforms:platforms?.map(({platform})=>platform.name),
                genres: genres?.map(({name})=>name)
            }
        })
    
        return allVideogames
    } catch (error) {
        console.log(error)
    }   
}

const getDbInfo = async()=>{
    try {
        const myGames =  await Videogame.findAll({
            include:[{
                model:Genres,
                attributes:['name'],
                through:{
                    attributes:[]
                }
            }]
        })

        return myGames.map((game)=>game.dataValues)
        
    } catch (error) {
        console.log(error)
    }
}

const getAllInfo = async()=>{
    try {
        const apiInfo = await getApiInfo();
        const dbInfo = await getDbInfo()
        //const allInfo = dbInfo.concat(apiInfo)

        return [...dbInfo, ...apiInfo]
    } catch (error) {
        console.log(error)
    }
}

const getAllVideogames = async(req,res)=>{
    const name = req.query.name;
    let totalVideogames = await getAllInfo()
    
    try {
        if(name){
            let videogameName = totalVideogames.filter((videogame)=>videogame.name.toLowerCase().includes(name.toLowerCase())).slice(0,15)
            console.log(videogameName.length)
            videogameName.length ? 
                res.status(201).send(videogameName)
                :
                res.status(404).json({message:"Videogame not found"})
        }else{
            res.status(200).send(totalVideogames)
        }
    } catch (error) {
        res.status(400).json({message:error})
    }
}   


const getVideogameById = async(req,res)=>{
    const {id} = req.params
    if(id.length> 8){
        const findvideogame = await Videogame.findByPk(id,{
            include: [{
                model: Genres,
                attributes: ['name'],
                through: {
                    attributes: [],
                }
            }]
        })

        res.status(200).json(findvideogame.dataValues)
    }else{
        try {
            const {data} = await axios.get(`${API_URL}/${id}?key=${API_KEY}`)
            const {name, description_raw:description, background_image: image, platforms, rating, genres} = data
            const videogame = {
                name,
                description,
                image,
                rating,
                genres: genres?.map(({name})=>name),
                platforms: platforms.map(({platform, released_at})=>{
                    let name = platform.name
                    return{
                        name,
                        released_at
                    }
                }),
            }
            res.status(201).json(videogame)
        } catch (error) {
            res.status(404).json({message:error})
        }
    }
}


const createVideogame = async(req,res)=>{
    const {
        name,
        description,
        released,
        image,
        rating,
        platforms,
        genres
    } = req.body
    
    if(!name || !description || !released || !image || !rating || !platforms || !genres) return res.status(400).json({message:"Faltan parametros"})

    try {
        const videogame = await Videogame.create({
            name,
            description,
            launch_date:released,
            platforms,
            image,
            rating,
        });
        genres.map(async(genre)=>{
            const findGenre = await Genres.findAll({
                where:{name:genre}
            })

            const filterGenre = findGenre.map(({dataValues})=>dataValues)
            await videogame.addGenres(filterGenre.id)
        })
        res.status(200).json({message:"Videogame created succesfully"})
    } catch (error) {
        res.status(400).json({message:error})
    }

}

module.exports = {
    getAllVideogames,
    getVideogameById,
    createVideogame
}