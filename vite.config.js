import {dataToEsm} from '@rollup/pluginutils'
import { readFileSync } from 'fs';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import wasm from 'vite-plugin-wasm'
import path from 'path';
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    {
      name: 'vite-plugin-base64',
      async transform(source, id) {
          if (!id.endsWith('.wasm')) return
          // ファイルを読み込む
          const file = readFileSync(id);
          // ファイルを base64 エンコードする
          const base64 = file.toString('base64');
          // base64 エンコードされたデータを JavaScript コードに埋め込む
          const code = `data:application/wasm;base64,${base64}";`;
          // JavaScript コードを返す
          return dataToEsm(code)
      },
    },
    wasm(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },  
  server: {
    watch: {
      usePolling: true
    }
  }  
});
