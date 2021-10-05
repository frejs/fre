## SSR 使用指南

### 1. 切换到demo目录
```shell script
cd ./demo
```

### 2. esbuild 编译ssr服务端脚本
```shell script
npm run ssr-build
```

### 3. 开启ssr服务
```shell script
npm run ssr-serve
```

### 4. 借助vite加载客户端做水合
```shell script
npm run dev
```

### 5. 看下效果
```shell script
http://localhost:8080/ssr
```
