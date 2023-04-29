import {dataToEsm} from '@rollup/pluginutils'
import { readFileSync } from 'fs';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import wasm from 'vite-plugin-wasm'

export default defineConfig({
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
  server: {
    watch: {
      usePolling: true
    }
  }  
});

//      transform: (code, id) => {
//        const fileData = readFileSync(id);
//        const base64Data = fileData.toString('base64');
//        return `export default "data:application/octet-stream;base64,${fileContents}"`;
//      },



//import { defineConfig } from 'vite'
//import vue from '@vitejs/plugin-vue'
//import string from 'vite-plugin-string'
//import wasm from 'vite-plugin-wasm'
//
//export default defineConfig({
//  plugins: [
//    vue(),
//    string({
//		include: [
//    	    '**/*.wasm' // バンドルしたいファイルのパターンを指定します。
//      	]
//    }),    
//    wasm(),
//  ],
//})

