import React, { Component } from 'react';
import './App.css';

const frameRate = 5; //fps - how many loop per seconds
const colNum = 10; //stage column(x)
const rowNum = 10; //stage row(y)
const cols = [];
const rows = [];

for (let i = 0; i < colNum; i++) {
  cols.push(i);
}

for (let i = 0; i < rowNum; i++) {
  rows.push(i);
}

class App extends Component {
    constructor(props){
      super(props);
      this.state = {
        input: 'right',
        direction: 'right',
        food: {},
        snake: {
            head: {},
            tails: []
        }
      };
      this.handleKeypress = this.handleKeypress.bind(this);
    }


    getRandomGrid(){
        return {
            x: Math.floor((Math.random() * colNum)),
            y: Math.floor((Math.random() * rowNum))
        }
    }

    generateFood(){
      let foodGrid = this.getRandomGrid();
      while(this.isOnSnake(foodGrid.x, foodGrid.y)){
          foodGrid = this.getRandomGrid();
      }
      return foodGrid;
    }

    isFood(x, y){
      let food = this.state.food;
      if(food.x === x && food.y === y) return true;
      return false;
    }

    isOnSnakeTail(x, y){
        let snake = this.state.snake;
        for(let i = 0; i < snake.tails.length; i++) {
            if(snake.tails[i].x === x && snake.tails[i].y === y) return true;
        }
        return false;
    }

    isOnSnakeHead(x,y){
        let snake = this.state.snake;
        if(snake.head.x === x && snake.head.y === y) return true;
        return false;
    }

    isOnSnake(x, y){
        return this.isOnSnakeTail(x,y)&&this.isOnSnakeHead(x,y);
    }

    reset(){
        this.setState({
            input: 'right',
            direction: 'right',
            food: this.generateFood(),
            snake: {
                head: {
                    x: Math.floor((colNum-1)/2),
                    y: Math.floor((rowNum-1)/2) 
                },
                tails: []
            }
        });
    }

    updateSnake(){
        //update position
        const {input, direction, snake, food} = this.state;
        let newFood = {...food};
        let newSnake = {...snake};
        let newDirection = '';
        newSnake.tails = [{...newSnake.head} , ...newSnake.tails];

        switch (input) {
            case "left":
                newDirection = direction === 'right' ? direction : 'left';
                break;
            case "up":
                newDirection = direction === 'down' ? direction : 'up';
                break;
            case "right":
                newDirection = direction === 'left' ? direction : 'right';
                break;
            case "down":
                newDirection = direction === 'up' ? direction : 'down';
                break;
            default:
        }

        switch (newDirection) {
            case "left":
                newSnake.head.x -= 1;
                if(newSnake.head.x < 0) newSnake.head.x = colNum-1;
                break;
            case "up":
                newSnake.head.y -= 1;
                if(newSnake.head.y < 0) newSnake.head.y = rowNum-1;
                break;
            case "right":
                newSnake.head.x += 1;
                if(newSnake.head.x > colNum-1) newSnake.head.x = 0;
                break;
            case "down":
                newSnake.head.y += 1;
                if(newSnake.head.y > rowNum-1) newSnake.head.y = 0;
                break;
            default:
        }

        //if collide with food 
        if(this.isOnSnakeHead(food.x, food.y)){
            newFood = this.generateFood();
        }
        else{
            newSnake.tails.pop();
        }

        //if collide with self
        if(this.isOnSnakeTail(newSnake.head.x, newSnake.head.y)){
            const score = newSnake.tails.length+1;
            alert("Game Over, Score =" + score);
            this.reset();
        }
        else{
            this.setState({
                food: newFood,
                snake: newSnake,
                direction: newDirection
            });
        }
    }

    handleKeypress(e){
        let newInput = '';
        switch (e.keyCode) {
            case 37:
            case 65:
                newInput = 'left';
                break;
      
            case 38:
            case 87:
                newInput = 'up';
                break;
      
            case 39:
            case 68:
                newInput = 'right';
                break;
      
            case 40:
            case 83:
                newInput = 'down';
                break;

            default:
        }
        this.setState({input: newInput});
    }

    componentDidMount(){
        document.body.addEventListener('keydown', this.handleKeypress);
        this.reset();
        window.interval = setInterval(()=>{
            this.updateSnake();
        }, 1000/frameRate);
    }

    componentWillUnmount(){
        document.body.removeEventListener('keydown', this.handleKeypress);
        clearInterval(window.interval);
    }

    render(){
      return(
        <div className="app">
            <h1>Snake Game</h1>
            <div className = "grid">
              {rows.map(y => {
                return(
                  <div className = "grid-row" key={y}>
                    {cols.map(x => {
                      return(
                        <div 
                          key={x}
                          className = {
                            this.isOnSnakeTail(x,y)
                            ? 'grid-cell snake-tail' : this.isOnSnakeHead(x,y) 
                            ? 'grid-cell snake-head' : this.isFood(x,y)
                            ? 'grid-cell food' : 'grid-cell'
                          }
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
        </div>
      );
    }
}

export default App;
