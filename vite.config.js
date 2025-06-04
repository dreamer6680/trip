import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

//unplugin
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite' //图标
import IconsResolver from 'unplugin-icons/resolver'




// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),

    AutoImport({
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: ['vue'],

      resolvers: [
        ElementPlusResolver(),
        // 自动导入图标组件
        IconsResolver(),
      ],
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ['ep'],
        }),
      ],
    }),

    Icons({
      autoInstall: true,
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 你的 JSON Server 运行的地址
        changeOrigin: true, // 对于虚拟托管的站点，这可以避免一些 CORS 问题
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写请求路径
      },//json-server --watch db.json启动服务
      '/place': {
        target: 'http://localhost:8080',
        // target: 'http://172.20.10.10:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/place/, '')
      }
    }
    },
})
