const https = require('https');
const fs = require('fs');

// GET
function fetchData(url) {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            let data = '';

            res.on('data', chunk => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    let json = JSON.parse(data);
                    resolve(json);
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', err => {
            reject(err);
        });
    });
}

function getRandomElements(array, count) {
    let shuffled = array.slice(0);
    for (let i = shuffled.length - 1; i > 0; i--) {
        let index = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[index]] = [shuffled[index], shuffled[i]];
    }
    return shuffled.slice(0, count);
}


async function main() {
    try {

        let breedsData = await fetchData('https://dog.ceo/api/breeds/list/all');
        if (breedsData.status !== 'success') {
            throw new Error('Nu s-a putut obține lista de rase.');
        }

        let breeds = [];

        for (let breed in breedsData.message) {
            if (breedsData.message[breed].length === 0) {
                breeds.push(breed);
            } else {
                for (let subBreed of breedsData.message[breed]) {
                    breeds.push(`${breed}/${subBreed}`);
                }
            }
        }


        let randomBreeds = getRandomElements(breeds, 3);


        let results = [];
        for (let breed of randomBreeds) {

            let imageUrl = `https://dog.ceo/api/breed/${breed}/images/random`;
            let imageData = await fetchData(imageUrl);
            if (imageData.status !== 'success') {
                console.error(`Nu s-a putut obține imaginea pentru rasa ${breed}.`);
                continue;
            }
            let url = imageData.message;
            let breedName = breed.replace('/', ' ');
            results.push(`${url} (${breedName})`);
        }

        let content = results.join('\n');
        fs.writeFileSync('dog_images.txt', content);
        console.log('URL-urile au fost scrise în fișierul dog_images.txt');
    } catch (error) {
        console.error('A apărut o eroare:', error.message);
    }
}


main();
