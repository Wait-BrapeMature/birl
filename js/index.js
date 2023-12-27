var birdGame = {
    gameLeft: 0,
    gameSpeed: 2,
    birdTop: 235,
    birdTo: 0,
    birdLeft: 0,
    count: 0,
    playGame: false,
    pipeArr: [],
    scores: 0,
    scoreArr: [],
    //获取系统时间
    enddate: function () {
        date = new Date();
        year = date.getFullYear();
        month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return `${year}年${month}月${day}日 ${hour}:${minute}:${second}`
    },
    // 元素获取
    element: function () {
        this.game = document.getElementById('game');
        this.bird = document.getElementsByClassName('bird')[0];
        this.start = document.getElementsByClassName('start')[0];
        this.score = document.getElementsByClassName('score')[0];
        this.mask = document.getElementsByClassName('mask')[0];
        this.end = document.getElementsByClassName('end')[0];
        this.endItem = document.getElementsByClassName('end-item')[0];
        this.endScore = this.end.getElementsByClassName('end-score')[0];
        this.continue = this.end.getElementsByClassName('continue')[0];

        this.scoreArr = this.getScore();
    },
    //计时器
    time: function () {
        this.timer = setInterval(() => {
            this.gameBackground();
            if (++this.count % 10 === 0) {
                if (!this.playGame) {
                    this.birdJump();
                    this.startText();
                }
                this.birdFly();
            }
            if (this.playGame) {
                this.birdDown();
                this.gameBorder();
                this.pipeMove();
            }
        }, 30)
    },
    // 游戏背景天空运动
    gameBackground: function () {
        this.gameLeft -= this.gameSpeed;
        this.game.style.backgroundPositionX = this.gameLeft + 'px';
    },
    //游戏开始文字变化
    startText: function () {
        this.start.className = this.start.className === 'start' ? 'start blue' : 'start'
    },
    //小鸟跳动
    birdJump: function () {
        this.birdTop = this.birdTop === 220 ? 260 : 220;
        this.bird.style.top = this.birdTop + 'px'
    },
    //小鸟加速降落
    birdDown: function () {
        this.birdTop += ++this.birdTo;
        this.bird.style.top = this.birdTop + 'px'
    },
    //小鸟点击上升
    tobird: function () {
        this.game.onclick = () => {
            this.birdTo = -10;
        };
    },
    //小鸟扇翅膀
    birdFly: function () {
        this.birdLeft === -60 ? this.birdLeft = 0 : this.birdLeft -= 30;
        this.bird.style.backgroundPositionX = this.birdLeft + 'px';
    },
    //碰撞检测
    gameBorder: function () {
        //上天入地游戏结束
        if (this.birdTop <= 0 || this.birdTop >= 570) {
            this.playEnd();
        };
        //撞到柱子游戏结束
        for (var i = 0; i < 7; i++) {
            var upheight = this.pipeArr[i].up;
            if (upheight.offsetLeft <= 95 && upheight.offsetLeft >= 11) {
                if (this.birdTop <= upheight.clientHeight || this.birdTop >= upheight.clientHeight + 120) {
                    this.playEnd();
                }
            };
        };
    },
    //元素生成
    eleBorn: function (eleName, classArr, styleObj) {
        var dom = document.createElement(eleName);
        for (var i = 0; i < classArr.length; i++) {
            dom.classList.add(classArr[i]);
        };
        for (var key in styleObj) {
            dom.style[key] = styleObj[key];
        }
        return dom;
    },
    //制作柱子
    pipeBorn: function (x) {
        var upHeight = 100 + Math.floor(Math.random() * 200);
        var downHeight = 450 - upHeight;
        this.UpPipe = this.eleBorn('div', ['pipe', 'pipe-up'], {
            'left': x + 'px',
            'height': upHeight + 'px',
        });
        this.DownPipe = this.eleBorn('div', ['pipe', 'pipe-down'], {
            'left': x + 'px',
            'height': downHeight + 'px',
        });
        this.game.appendChild(this.UpPipe);
        this.game.appendChild(this.DownPipe);
        this.pipeArr.push({
            up: this.UpPipe,
            down: this.DownPipe,
        })
    },
    //柱子移动
    pipeMove: function () {
        for (var i = 0; i < 7; i++) {
            var uppipe = this.pipeArr[i].up;
            var downpipe = this.pipeArr[i].down;
            var x = uppipe.offsetLeft - this.gameSpeed;
            if (x == 15) {//得分判断
                this.score.innerText = ++this.scores;
            };
            if (x <= -52) {
                x = 2045;
                var upHeight = 100 + Math.floor(Math.random() * 200);
                var downHeight = 450 - upHeight;
                uppipe.style.height = upHeight + 'px';
                downpipe.style.height = downHeight + 'px'
            };
            uppipe.style.left = x + 'px';
            downpipe.style.left = x + 'px';
        }
    },
    //本地储存
    setLocal: function (key, value) {
        if (typeof value === 'object' && value !== null) {
            value = JSON.stringify(value);
        }
        localStorage.setItem(key, value);
    },
    //获取缓存
    getScore: function () {
        var scoreArr = this.getLocal('score');
        return scoreArr ? scoreArr : [];
    },
    getLocal: function (key) {
        var value = localStorage.getItem(key);
        if (value === null) { return null }
        if (value[0] === '[' || value[0] === '{') {
            return JSON.parse(value);
        }
        return value;
    },
    //点击事件开始游戏
    tostart: function () {
        this.start.onclick = () => {
            this.toPlayGame();
        };
    },
    //点击事件继续游戏
    tocontinue: function () {
        this.continue.onclick = () => {
            sessionStorage.setItem('play', true);
            window.location.reload();
        };
    },
    toPlayGame: function () {
        this.bird.style.transition = 'none';
        this.playGame = true;
        this.gameSpeed = 5;
        this.score.style.display = 'block';
        this.start.style.display = 'none';
        this.bird.style.left = '80px';
        this.tobird();
        for (var i = 0; i < 7; i++) {
            this.pipeBorn(300 * (i + 1));
        };
        this.pipeMove();
    },
    //游戏结束
    playEnd: function () {
        this.scoreArr.push({
            score: this.scores,
            time: this.enddate(),
        });
        this.setLocal('score', this.scoreArr);
        clearInterval(this.timer)
        this.mask.style.display = 'block';
        this.end.style.display = 'block';
        this.score.style.display = 'none';
        this.endScore.innerText = this.scores;
        this.rankList();
    },
    //排名列表
    rankList: function () {
        var lilist = '';
        var coust = this.scoreArr.length >= 8 ? 8 : this.scoreArr.length;
        this.scoreArr.sort(function (a, b) {
            return b.score - a.score
        })
        for (var i = 0; i < coust; i++) {
            var color = '';
            switch (i) {
                case 0:
                    color = 'rankcolor1';
                    break;
                case 1:
                    color = 'rankcolor2';
                    break;
                case 2:
                    color = 'rankcolor3';
                    break;
            };
            lilist += `<li class="list">
            <span class="list-rank ${color}">${i + 1}</span>
            <span class="list-score">${this.scoreArr[i].score}</span>
            <span class="list-time">${this.scoreArr[i].time}</span>
            </li>`
        };
        this.endItem.innerHTML = lilist;
    },
};
birdGame.element();
birdGame.time();
birdGame.tostart();
birdGame.tocontinue();
if(sessionStorage.getItem('play')){
    birdGame.toPlayGame();
}