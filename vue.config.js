// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })

const {resolve} = require("path");
module.exports = {
    /* ---------------- 配置Vue服务器 ----------------
    * 在运行项目之前，请根据注释提示，修改后端服务器的对应地址，否则后端无法接收数据进行计算。
    */

    devServer: {
        //host: '127.0.0.1', // 指定服务器的工作地址
        port: 8080, // 运行端口号，注意后端默认运行在8080端口，假如在同一台机器上运行前端后端请注意端口是否被占用
        // open: true, // vue项目启动时自动打开浏览器，注释这个选项避免在低性能机器上启动项目上打开浏览器占用过多资源

        // 用于向后端发送请求数据的设置
        proxy: {
            '/addDatabase': { // 代理标识，项目中通过这个url向后端发送数据

                //目标地址（指后端服务器地址）
                // 后端地址接受的API是 http://后端服务器地址:端口号/test
                // target: "http://172.30.206.128:5000/addDatabase",
                target: 'http://127.0.0.1:6000/addDatabase',
                changeOrigin: true, // 是否跨域
                pathRewrite: { 
                    // 把实际请求Url中的'/addDatabase'用""代替
                    // 前端发请求匹配到的api替换成空，将请求“http://127.0.0.1:8000/addDatabase”,但真实请求是“http://127.0.0.1:6000/addDatabase””
                    '^/addDatabase': ""
                }
            },
            // 访问腾讯网站跨域
            '/getAddressTencent': { // 代理标识，项目中通过这个url向后端发送数据
                target: 'https://apis.map.qq.com/',
                changeOrigin: true, // 是否跨域
                pathRewrite: { 
                    '^/getAddressTencent': ""
                }
            },
        }
    },

    chainWebpack: config => {

        // 设置@路径
        config.resolve.alias
            .set('@', resolve('src'))
    },
    publicPath: './',
    configureWebpack: { // 用于最开始开发时直接读入geojson样例的loader设置，暂时没用到
        module: {
            rules: [
                {
                    test: /\.geojson$/,
                    loader: 'json-loader'
                }
            ]
        }
    },

}