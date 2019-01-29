cc.Class({
    extends: cc.Component,

    properties: {
        rankPanel:cc.Node,
        content:cc.Node,
        prefab:cc.Prefab
    },

    start () {
        let _self=this;
        wx.onMessage(data=>{
            console.log('onMessage:'+data.message);
            if(data.text==="ShowRankPanel"){
                this.ShowRankPanel();
            }else if(data.text==="HideRankPanel"){
                this.HideRankPanel();
            }
        });
        // wx.getUserInfo({
        //     openIdList: ['selfOpenId'],
        //     lang: 'zh_CN',
        //     success: (res) => {
        //         console.log('getUserInfo success:', res.data);
        //         let userInfo = res.data[0];
        //         _self.createUserBlock(userInfo);
        //     },
        //     fail: (res) => {
        //         reject('getUserInfo reject:'+res);
        //     }
        // });
    },
    ShowRankPanel(){
       // console.log("ShowRankPanel:"+this.rankPanel.active);
        this.rankPanel.active=true;

        this.cannons = [];
        this.cannons = this.content.getChildren();
        this.cannons.forEach((n)=>{
            n.destroy();
        })
        
       // console.log("ShowRankPanel:"+this.rankPanel.active);
        this.GetFriendCloudStorage();
    },
    HideRankPanel(){
        this.cannons = [];
        this.cannons = this.content.getChildren();
        this.cannons.forEach((n)=>{
            n.destroy();
        })
        this.rankPanel.active=false;
    },
    GetFriendCloudStorage(){
        let _self=this;
        wx.getFriendCloudStorage({
            keyList:["score"],
            success(res) {
                console.log('getFriendCloudStorage success:', res.data);
                _self.sortList(res.data);
                res.data.forEach((n)=>{
                    _self.createUserBlock(n);
                });
            },
            fail(res) {
                reject('getFriendCloudStorage reject:'+res);
            }
        });
    },
    sortList(dataList){
        for(let i=0;i<dataList.length-1;i++){
            for(let j=dataList.length-2;j>=i;j--){
                if(Number(dataList[j].KVDataList[0].value)<Number(dataList[j+1].KVDataList[0].value)){
                    let temp=dataList[j];
                    dataList[j]=dataList[j+1];
                    dataList[j+1]=temp;
                }
            }
        }
        //return dataList;
    },
    createUserBlock (user) {
        let node = this.createPrefab();

        let nickName = user.nickname;
        let score=user.KVDataList[0].value;
        let avatarUrl = user.avatarUrl;

        let userName = node.getChildByName('UserName').getComponent(cc.Label);
        let userscore = node.getChildByName('Score').getComponent(cc.Label);
        let userIcon = node.getChildByName('Mask').children[0].getComponent(cc.Sprite);

        userName.string = nickName;
        userscore.string=score;
        //console.log(nickName + '\'s info has been getten.');
        cc.loader.load({
            url: avatarUrl, type: 'png'
        }, (err, texture) => {
            if (err) console.error(err);
            userIcon.spriteFrame = new cc.SpriteFrame(texture);
        });                   
    },

    createPrefab () {
        let node = cc.instantiate(this.prefab);
        node.parent = this.content;
        return node;
    }
});
