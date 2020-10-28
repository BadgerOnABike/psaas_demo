// ./api-v1/services/worldsService.js

let worlds = {
    Earth: {
        name: 'Earth'
    }
};

const worldsService = {
    getWorlds(name) {
        return worlds[name] ? [worlds[name]] : [];
    }
};

export default worldsService;