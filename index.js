const axios = require("axios");
const http = require("http");
const fs = require("fs");

let pokemonesPromesas = [];

async function pokemonesGet() {
    const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=150');
    return data.results
}

async function getFullData(name) {
    const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
    return data
}

http.createServer((req, res) => {

    if (req.url == "/") {
        fs.readFile("index.html", "utf8", (err, data) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });
    };

    if (req.url == "/galeria") {

        pokemonesGet().then((results) => {
            console.log(results.length)
            results.forEach((p) => {
                let pokemonName = p.name
                pokemonesPromesas.push(getFullData(pokemonName))
            })
            Promise.all(pokemonesPromesas).then((data) => {
                let pokemones = [];
                data.forEach((p) => {
                    let imagen = p.sprites.front_default;
                    let nombre = p.name;
                    console.log(nombre)
                    pokemones.push({ img: imagen, nombre: nombre })
                })
                res.end(JSON.stringify(pokemones));

            }).catch((error) => {
                console.log('Algo salio mal :', error)
            })
        })
    };

}).listen(3000, () => console.log('Server on'))