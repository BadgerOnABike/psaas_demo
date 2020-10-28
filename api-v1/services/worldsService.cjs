// ./api-v1/services/worldsService.cjs

let worlds = {
    Earth: {
        name: 'Earth'
    }
};

const worldsService = {
    getWorlds(name) {
        console.log('Executing getWorlds...', name)
        return worlds[name] ? [worlds[name]] : [];
    }
};

export default worldsService;