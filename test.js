// or:
const { mkdirp } = require('mkdirp')

// return value is a Promise resolving to the first directory created
mkdirp('public/product_images/', (err) => {
    return console.log(err)
})
