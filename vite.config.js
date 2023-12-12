import { defineConfig } from 'vite';

const config = () => {
    return defineConfig({
        server: {
            host: 'localhost',
            port: 7500
        },
        base: '/sf/'
    });
};

export default config;
