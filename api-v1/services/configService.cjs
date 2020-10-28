// ./api-v1/services/configService.cjs


import conf from '../../demoApiServerConfig.json'
var psaasConfig
const getPsaasConfig = () => {
    if (typeof conf['psaas'] == 'undefined') {
        return { configMissing: true }
    }
    else {
        return conf['psaas']
    }
}


const configService = {
    getConfig() {
        console.log('Executing getConfig...')
        return getPsaasConfig();
    }
};


export default configService;