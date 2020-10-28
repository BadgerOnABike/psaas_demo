// ./api-v1/services/configService.cjs

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