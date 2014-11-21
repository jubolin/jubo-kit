JuBo
====

JuBo is an ultra-simple environment for building OpenWrt APP.

## 安装JuBo

```
git clone https://github.com/jubolin/jubo.git
cd jubo
./scripts/generat-kit.sh
```

## 创建应用
`jubo create first-app`

## 运行应用

```
cd first-app
jubo
```

打开浏览器访问http://localhost:3000 就可以看到应用了。

## 发布应用到OpenWrt设备
`jubo deploy openwrt-dev-addr`

*OpenWrt设备的内存和存储空间应不少于64MB*
发布成功后，访问http://openwrt-dev-addr:22786 就可以看到应用了。

## 开发资源
JuBo是在Meteor(https://www.meteor.com) 的基础上开发的，Meteor的开发资源都可以应用在JuBo上。

## 联系我们

EMail: jubolin@126.com



