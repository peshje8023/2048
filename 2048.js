var game={
	data:null,//保存RN行CN列的二维数组
	RN:4,//保存总行数
	CN:4,//保存总列数
	score:0,
	//启动游戏
	start:function(){
		this.data=[];
		for(var r=0;r<this.RN;r++){
			this.data.push([]);
			for(var c=0;c<this.CN;c++){
				this.data[r][c]=0;
			}
		}

		// 调用randomNum()方法，生成2个随机数
		this.randomNum();
		this.randomNum();
		//调用updateView，更新页面
		this.updateView();


		//留住this
		var me=this;

		//为当前网页绑定键盘按下事件
		document.onkeydown=function(){
			//获得按键号：2步
			var e=window.event||arguments[0];
			switch(e.keyCode){
				case 37:me.moveLeft();break;
				case 38:me.moveUp();break;
				case 39:me.moveRight();break;
				case 40:me.moveDown();break;
			}
		}
	},

	//判断游戏是否结束
	gameOver:function(){
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				if(this.data[r][c]==0){return false;}
				if(c<this.CN-1&&this.data[r][c]==this.data[r][c+1]){return false;}
				if(r<this.RN-1&&this.data[r][c]==this.data[r+1][c]){return false;}			
			}
		}
		return true;
	},



	//重构所有移动方法的相同的部分
	move:function(iterator){
		//将data转为String,保存在before中
		var before=String(this.data);
		iterator.call(this);
		//将data转为String,保存在after中
		var after=String(this.data);
		//如果before不等于after
		if(before!=after){
			//调用randomNum随机生成一个数
			this.randomNum();
			//调用updateView更新页面
			this.updateView();
			//计算成绩
			for(var r=0;r<this.RN;r++){
				for(var c=0;c<this.CN;c++){
					this.score+=this.data[r][c];
				}
			}
			var scoreText=document.getElementById('score');
			var final=document.getElementById('final');
			final.innerHTML=this.score;
			scoreText.innerHTML=this.score;
			this.score=0;
		}
		if(this.gameOver()){
			document.getElementById('gameOver').style.display='block';

		}
	},


	//上移所有列
	moveUp:function(){
		this.move(function(){
			for(var c=0;c<this.CN;c++){
				this.moveUpInCol(c);
			}
		});
	},

	//上移第c列
	moveUpInCol:function(c){
		//从0开始遍历data中c列的每个格，到<RN-1结束
		for(var r=0;r<this.RN-1;r++){
			//调用getNextInCol,查找下一个不为0的数的位置nextr,同时传入c和r作为参数
			var nextr=this.getNextInCol(r,c);
			// 如果nextr等于-1，就退出循环
			if(nextr==-1){break;}
			// 否则，如果当前元素是0
			else if(this.data[r][c]==0){
				//就将当前元素设置为nextr位置的元素
				this.data[r][c]=this.data[nextr][c];
				//将nextr位置设置为0
				this.data[nextr][c]=0;
				r--;
			}
			//否则，如果当前元素等于nextr位置的元素
			else if(this.data[r][c]==this.data[nextr][c]){
				//将当前元素*2
				this.data[r][c]*=2;
				//下一个元素等于0
				this.data[nextr][c]=0;
			}
		}
	},

	//查找r下一个不为0的位置
	getNextInCol:function(r,c){
		//nextr从r+c位置遍历c列中剩余元素
		for(var nextr=r+1;nextr<this.RN;nextr++){
			//如果nextr位置的元素不等于0，就返回nextr
			if(this.data[nextr][c]!=0){return nextr;}
		}
		//遍历结束,返回-1
		return -1;
	},


	//下移所有列
	moveDown:function(){
		this.move(function(){
			for(var c=0;c<this.RN;c++){
				this.moveDownInCol(c);
			}
		})
	},

	//下移第c列
	moveDownInCol:function(c){
		for(var r=this.RN-1;r>0;r--){
			var prevr=this.getPrevInCol(r,c);
			if(prevr==-1){break;}
			else if(this.data[r][c]==0){
				this.data[r][c]=this.data[prevr][c];
				this.data[prevr][c]=0;
				r++;
			}
			else if(this.data[r][c]==this.data[prevr][c]){
				this.data[r][c]*=2;
				this.data[prevr][c]=0;
			}
		}
	},

	//查找r之前以前一个不为0的位置
	getPrevInCol:function(r,c){
		for(var prevr=r-1;prevr>=0;prevr--){
			if(this.data[prevr][c]!=0){return prevr;}
		}
		return -1;
	},


	//右移所有行
	moveRight:function(){
		this.move(function(){
			for(var r=0;r<this.RN;r++){
				this.moveRightInRow(r);
			}
		});
	},

	//右移第r行
	moveRightInRow:function(r){
		//从CN-1开始，到1结束，遍历data中r行的元素
		for(var c=this.CN-1;c>0;c--){
			//调用getPrevInRow,查找前一个不为0的位置prevc
			var prevc=this.getPrevInRow(r,c);
			//如果prevc等于-1，就推出循环
			if(prevc==-1){break;}
			//否则，如果当前值等于0
			else if(this.data[r][c]==0){
				//将prevc位置的值，替换当前值
				this.data[r][c]=this.data[r][prevc];
				//将prevc位置设置为0
				this.data[r][prevc]=0;
				//c留在原地
				c++;
			}
			//否则，如果当前值等于prevc位置的值
			else if(this.data[r][c]==this.data[r][prevc]){
				//将当前值*=2
				this.data[r][c]*=2;
				//将prevc位置设置为0
				this.data[r][prevc]=0;
			}
		}
	},

	//查找c之前前一个不为0的位置
	getPrevInRow:function(r,c){
		//prevc从c-1位置开始，到0结束
		for(var prevc=c-1;prevc>=0;prevc--){
		//如果prevc位置的值不等于0，就返回prevc
			if(this.data[r][prevc]!=0){return prevc;}
		}
		return -1;
		//遍历结束，返回-1
	},


	//左移所有行
	moveLeft:function(){
		this.move(function(){
			for(var r=0;r<this.RN;r++){
				//调用moveLeftInRow,传入行号r作为参数
				this.moveLeftInRow(r);
				//(遍历结束)
			}
		})
	},

	// 左移第r行
	moveLeftInRow:function(r){
		//从0开始遍历data中r行的每个格，到<CN-1结束
		for(var c=0;c<this.CN-1;c++){
			//调用个体NexInRow,查找下一个不为0的数的位置nextc,同时传入c和r作为参数
			var nextc=this.getNextInRow(r,c);
			//如果nextc等于-1，就退出循环
			if(nextc==-1){break;}
			//否则，如果当前元素是0
			else if(this.data[r][c]==0){
				//就将当前元素设置为nextc位置的元素
				this.data[r][c]=this.data[r][nextc];
				//将nextc位置设置为0
				this.data[r][nextc]=0;
				c--;
			}
			//否则，如果当前元素等于nextc位置的值
			else if(this.data[r][c]==this.data[r][nextc]){
				//就将当前元素*2
				this.data[r][c]*=2;
				//将nextc位置设置为0
				this.data[r][nextc]=0;
			}
		}
	},

	// 查找c之后下一个不为0的位置
	getNextInRow:function(r,c){
		//nextc从c+1开始遍历r行中剩余元素
		for(var nextc=c+1;nextc<this.CN;nextc++){
			//如果nextc位置的元素不等于0,返回nextc
			if(this.data[r][nextc]!=0){return nextc;}
		}
		// 遍历结束，返回-1
		return -1;
	},



	//在随机位置生成2或者4
	randomNum:function(){
		for(;;){
			//在0~RN-1之间生成一个随机整数r
			var r=parseInt(Math.random()*this.RN);
			//在0~CN-1之间生成一个随机整数c
			var c=parseInt(Math.random()*this.CN);
			//如果data中r行c列的值为0
			if(this.data[r][c]==0){
				//随机一个数字，如果<0.5，就设置data的r行c列为2，否则设置为4
				this.data[r][c]=Math.random()<0.5?2:4;
				break;
			}
		}
	},


	//将data中的数据更新到页面
	updateView:function(){
		//遍历data中每个元素
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				//找到页面上id为'c'+r+c的div
				var div=document.getElementById("c"+r+c);
				//如果data中r行c列的元素不等于0
				if(this.data[r][c]!=0){
				//设置div的内容为data中r行c列的值
				div.innerHTML=this.data[r][c];
				//设置div的className属性为'cell n'+data中r行c列的值
				div.className="cell n"+this.data[r][c];
				}else{
				//设置div的内容为''
					div.innerHTML="";
				//设置div的className为'cell'
					div.className="cell";
				}
			}
		}
	}
}
// 页面加载后自动启动游戏
window.onload=function(){
	game.start();
}