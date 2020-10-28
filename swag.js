const express = require('express')
const app = express()
const swaggerUiAssetPath = require("swagger-ui-dist").getAbsoluteFSPath()
app.use('/', express.static(swaggerUiAssetPath))

app.listen(3080, () => {
    console.clear();
    console.log("========================================================================")
    console.log(`SWAGGER UI running on PORT 3080`)


}
);