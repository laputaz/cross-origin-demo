const Koa = require('koa')
const app = new Koa()
// router.js
const Router = require('koa-router')
const router = new Router()
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

router.get('/jsonp', (ctx, next) => {
    // 取得 callback 函数名
    const callbackFunc = ctx.request.query.callback
    // 需要返回的结果
    const res = { name: 'river' }
    // 返回
    ctx.response.body = `${callbackFunc}(${JSON.stringify(res)})`
    // 设置为javascript类型的返回
    ctx.response.headers['content-type'] = 'text/javascript;charset=UTF-8'
    next()
})

router.options('/cors', (ctx, next) => {
    console.log('This is a response, methods: options')
    ctx.response.body = 1
    ctx.status = 200
    // 允许的源
    ctx.set('Access-Control-Allow-Origin', '*')
    // 允许的请求头
    ctx.set('Access-Control-Allow-Headers', 'custom')
    next()
})

router.get('/cors', (ctx, next) => {
    console.log('This is a response, methods: get')
    ctx.response.body = 1
    next()
})

router.get('/nginx-api', (ctx, next) => {
    console.log('This is a response, methods: get')
    ctx.response.body = '转发成功'
    next()
})

app.use(router.routes())
app.use(function (ctx) {
    ctx.set('Access-Control-Allow-Origin', '*')
})
// socket连接
io.on('connection', (socket) => {
    socket.on('message', (msg) => {
        console.log('message: ' + msg);
        io.emit('message', msg);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000)
console.log('Server is running at port 3000...');

