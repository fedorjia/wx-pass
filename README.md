# Mongo Scripts

## 创建APP
```
db.apps.save({
    name: 'your name',
    desc: 'your description',
    wx_appid: 'your wx appid',
    wx_appsecret: 'your wx app secret',
    created_at: Date.now()
});
```

## APP 列表
db.apps.find().pretty();
