
requirejs.config({
    baseUrl: 'require',
    paths: {
        app: '../app'
    }
});

requirejs(['app/main']);