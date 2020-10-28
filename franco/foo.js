

const sayMyName = async name => {
    console.log(name);
}
const whatIsMyName = () => {
    return new Promise((resolve, reject) => {
        resolve("franco")
    });

}

const sayLizsName = () => {
    return new Promise(async (resolve, reject) => {
        await console.log('Liz');

        let status = await 'done'
        if (status == 'done') {
            resolve(true);
        }
    });
}

const DoExecutionLogicAsync = async () => {

    // let didYouSayLiz = await sayLizsName();


    sayLizsName()
        .then(() => {
            whatIsMyName()
                .then(name => {
                    sayMyName(name)
                })
                .catch(err => {
                    console.log(err)
                })
        })
}

DoExecutionLogicAsync()

getWeather()
getignitions()