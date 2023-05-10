import path from 'path'

export default {
    mode:'development',
    entry:{
        map:'./src/js/map.js',
        addImg:'./src/js/addImg.js',
        showMap:'./src/js/showMap.js',
        homeMap:'./src/js/homeMap.js',
        changeStatus:'./src/js/changeStatus.js',
    },
    output:{
        filename:'[name].js',
        path:path.resolve('public/js')
    },
}