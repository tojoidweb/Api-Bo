module.exports = {
    apps: [{
        script: 'app.js',
        watch: '.'
    }, {
        script: './service-worker/',
        watch: ['./service-worker']
    }],

    deploy: {
        production: {
            user: 'app@kenza.re',
            host: '185.22.109.100',
            ref: 'origin/master',
            repo: 'github.com/MarkoWilliam/Back-kenza-nodeJS.git',
            path: '/back_node',
            'pre-deploy-local': '',
            'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
            'pre-setup': ''
        }
    }
};